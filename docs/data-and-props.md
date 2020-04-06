# `data` 和 `props` 的处理

## `data`

### `data` 必须是函数

当实例化一个组件时，会对 `data` 进行初始化：

```js
function initData(vm) {
  let data = vm.$options.data
  data = vm._data = typeof data === 'function' ? data.call(vm) : data

  // ...省略待分析代码
}
```

上面的代码回答了一个问题，**为什么根组件的 `data` 可以是一个对象，而子组件的 `data` 必须是一个函数？**

因为对于一个页面来说，只会有一个根组件，而子组件却不一定。

对于同一个子组件的不同实例来说，它们的 `data` 肯定是不能互相影响的，所以 `data` 必须是一个函数。而每个实例自身的数据也被保存到了 `_data` 上。

但是等等，我们访问 `data` 中的数据是通过组件实例访问的，所以我们需要对它进行代理：

```js
function initData(vm) {
  let data = vm.$options.data
  data = vm._data = typeof data === 'function' ? data.call(vm) : data

  const keys = Object.keys(data)
  for (let i = 0; i < keys.length; i++) {
    let value = vm._data[key]
    Object.defineProperty(vm, key, {
      enumerable: true,
      configurable: true,
      get() {
        return value
      },
      set(val) {
        value = val
      }
    })
  }
}
```

### 响应式数据

上面的代码中，对 `data` 进行了初始化，但是现在的数据还不是响应式数据。`Vue` 会对 `data` 进行遍历，将 `data` 中的所有数据变为响应式数据（即劫持`getter/setter`）:

```js
function observe(value) {
  const ob = new Observer(value)

  return ob
}

class Observer {
  constructor(value) {
    this.value = value
    this.walk(value)
  }

  walk(value) {
    const keys = Object.keys(value)

    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }
}
```

### “深”监听

尝试下面的例子：

```js
const vm = new Vue({
  data() {
    return {
      name: {
        firstname: 'nail'
      }
    }
  },
  template: `
    <div>{{ name.firstname }}</div>
  `
})

vm.name.firstname = 'Nail'
```

修改实例的 `name.firstname` 属性的值会导致视图更新，也就说明 `vm.name.firstname` 是响应式数据，这就表明 `data` 的数据时对象时，会进行一次遍历：

```js
function defineReactive(obj, key, val = obj[key]) {
  const dep = new Dep()

  // 新增代码
  observe(val)

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      // 更新代码
      dep.depend()
      return val
    },
    set(newVal) {
      val = newVal
      // 新增代码
      observe(val)
      dep.notify()
    }
  })
}

function observe(value) {
  // 新增代码
  if (typeof value !== 'object' || value === null) {
    return
  }

  const ob = new Observer(value)

  return ob
}
```

上面的代码回答了一个问题，**为什么无法监测到属性的添加和删除？**

添加和删除属性的操作也无法被 `Object.defineProperty()` 劫持；而且新添加的属性，并没有被 `Vue` 进行处理，所以新添加的数据不是响应式数据。

### 对 `Array` 类型数据的处理

当数据是 `Array` 类型时，通过副作用方法（如 `push()`, `pop()` 等会导致数组自身变化的方法）修改数组时，上面的代码并不会触发依赖的更新，这很棘手，`Vue` 通过对这些方法拦截（并添加了一层原型链）来实现这部分功能：

```js
const arrayProto = Array.prototype
const arrayMethods = Object.create(arrayProto)
;[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
].forEach(method => {
  const original = arrayProto[method]

  arrayMethods[method] = function mutator(...args) {
    // apply 在调用该新方法的数组上
    const result = original.apply(this, args)
    // 获取 value 的 Observer 实例
    const ob = this.__ob__

    switch (method) {
      case 'push':
      case 'unshift':
      case 'splice':
        // 因为新添加的值不是响应式数据
        // 此处可以只对新添加的值进行响应式处理
        ob.observeArray(result)
        break;
    }

    return result
  }
})

class Observer {
  constructor(value) {
    this.value = value

    // 新增代码
    // 在数组被修改后
    // 需要通过该属性找到当前 Observer 实例
    // 通过该实例将新添加的值变为响应式
    value.__ob__ = this

    // 新增代码
    if (Array.isArray(value)) {
      value.__proto__ = arrayMethods
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }

  // 新增代码
  observeArray(items) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }

  walk(value) {
    const keys = Object.keys(value)

    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }
}
```

#### 数组的依赖列表

当访问一个数组类型的响应式数据时，上面的代码仍可以在 `getter` 中对依赖进行收集；但是通过副作用方法修改数组的值时，无法进行依赖更新的通知，因为不会触发 `setter`。

所以在方法拦截器中，需要添加通知依赖更新的逻辑。但问题是，如何同时在 `getter` 和方法拦截器都能拿到这个依赖列表？

为了达到这一目的，可以把数组的依赖添加到 `Observer` 中，这样在 `getter` 和方法拦截器中就都可以拿到依赖列表了：

```js
class Observer {
  constructor() {
    // 新增代码
    this.dep = new Dep()

    // 省略多余代码...
  }

  // 省略多余代码...
}

const arrayProto = Array.prototype
const arrayMethods = Object.create(arrayProto)
;[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
].forEach(method => {
  const original = arrayProto[method]

  arrayMethods[method] = function mutator(...args) {
    // apply 在调用该新方法的数组上
    const result = original.apply(this, args)
    // 获取 value 的 Observer 实例
    const ob = this.__ob__

    switch (method) {
      case 'push':
      case 'unshift':
      case 'splice':
        // 因为新添加的值不是响应式数据
        // 此处可以只对新添加的值进行响应式处理
        ob.observeArray(result)
        break;
    }

    // 新增代码，通知依赖更新
    ob.dep.notify()

    return result
  }
})
```

上面的代码在拦截器中对依赖进行了通知，而在 `getter` 中获取依赖列表需要绕个弯：

```js
function observe(value) {
  // 新增代码
  if (typeof value !== 'object' || value === null) {
    return
  }

  // 更新代码
  let ob
  if (value.hasOwnProperty('__ob__']) && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else {
    ob = new Observer(value)
  }

  return ob
}

function defineReactive(obj, key, val = obj[key]) {
  const dep = new Dep()

  // 新增代码
  const dependArray = value => {
    val.forEach(v => {
      v && v.__ob__ && v.__ob__.dep.depend()
      if (Array.isArray(v)) {
        dependArray(v)
      }
    })
  }
  const ob = observe(val)

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      dep.depend()
      // 更新代码
      // 为数组进行依赖收集
      ob.dep.depend()
      // 将依赖添加到数组的所有子孙数组中
      if (Array.isArray(val)) {
        dependArray(val)
      }

      return val
    },
    set(newVal) {
      val = newVal
      observe(newVal)
      dep.notify()
    }
  })
}
```

#### 数组的子孙数组

上面有一段代码我感到疑惑：

```js
function defineReactive(obj, key, val = obj[key]) {
  const dep = new Dep()

  // 新增代码
  const dependArray = value => {
    val.forEach(v => {
      v && v.__ob__ && v.__ob__.dep.depend()
      if (Array.isArray(v)) {
        dependArray(v)
      }
    })
  }
  const ob = observe(val)

    // 省略多余代码...
    get() {
      // 省略多余代码...

      // 为数组进行依赖收集
      ob.dep.depend()
      if (Array.isArray(val)) {
        dependArray(val)
      }

      return val
    },
    // 省略多余代码...
}
```

为什么要在 `getter` 触发时，不仅将依赖收集到了数据的依赖列表中，还将依赖收集到数组的所有子孙数组的依赖列表中？

```js
vm = new Vue({
  data() {
    return {
      person: {
        name: {
          firstname: 'nail'
        }
      }
    }
  }
})

vm.person.name.firstname
```

上面的代码中，当访问 `vm.person.name.firstname` 时，会触发该响应式数据上经过的所有属性的 `getter`，所以依赖被收集到 `vm.person.name.firstname` 的依赖列表时，也会被收集到 `vm.person.name` 和 `vm.person` 中。

但是对于数组类型的数据：

```js
vm = new Vue({
  data() {
    return {
      arr: [
        0,
        { one: 1 },
        [2]
      ]
    }
  }
})

vm.arr[0]
vm.arr[1].one
vm.arr[2][0]
```

像上面例子一样访问这些属性，会触发哪些 `getter`？

当然，肯定都会触发 `vm.arr` 的 `getter`，但是除此以外呢？

```js
vm.arr[0] // 无

vm.arr[1].one // { one: 1 } 的 `getter`

vm.arr[2][0] // 无
```

`vm.arr[2][0]` 没有触发依赖 `vm.arr[2]` 的依赖收集！这是有问题的，但是 `Observer` 确实不会对数组的子孙数组添加 `getter/setter` 的劫持，所以就需要在触发数组 `getter` 的同时，触发所有子孙数组的依赖收集，来解决这一问题。

## `props`

### 格式化

由于 `props` 支持多种形式，如：

```js
// 数组形式
{
  props: ['propA', 'propB']
}

// 对象形式
{
  props: {
    propA: {
      type: String,
      required: true
    },
    propB: {
      type: Number,
      default: 0
    }
  }
}

// 另一种对象形式
{
  props: {
    propA: '',
    propB: {
      type: Number,
      default: 0
    }
  }
}
```

所以需要将两种形式转换为对象形式，以便于处理：

```js
/**
 * 都转换为
 * {
 *  propA: {
 *    type: ...
 *  }
 * }
 * 风格
**/
function normalizeProps(props) {
  const res = {}
  if (Array.isArray(props)) {
    let i = props.length
    while (i--) {
      res[props[i]] = {
        type: null
      }
    }
  } else {
    for (const key in props) {
      const value = props[key]
      res[key] = isPlainObject(value) ? value : { type : value }
    }
  }
  return res
}
```

### 设置默认值

设置默认值的过程非常简单，基本就是获取 `default` 属性

```js
function getPropDefaultValue(prop) {
  if (!prop.hasOwnProperty('default')) {
    return undefined
  }
  const def = prop.default

  if (typeof default === 'object' && default !== null) {
    // 警告， 对象类型需要通过函数返回
  }

  return typeof def === 'function' && prop.type !== Function ? def.call(vm) : def
}
```

### 验证属性

验证属性分为以下三点：
- 属性是否是必填项
- 属性值是否满足类型要求
- 处理自定义验证器：自定义验证器就是一个函数，非常简单，该文章就不介绍了

#### 验证必填项

```js
if (prop.required && !prop.hasOwnProperty(key)) {
  // 必填属性缺失警告
}
```

#### 验证是否满足类型

```js
const simpleType = [String, Number, Boolean, Function, Symbol]
function validProp(prop) {
  let type = prop.type
  const value = getPropDefaultValue(prop)
  if (!Array.isArray(type)) {
    type = [type]
  }

  let valid
  for (let i = 0; i < type.length && !valid; i++) {
    const expectedType = type[i]
    if (simpleType.indexOf(expectedType) > -1) {
      // 原始类型直接用 typeof
      const valueType = typeof value
      valid = valueType === expectedType.name.toLowerCase()
    } else if (expectedType === Array) {
      valid = Array.isArray(value)
    } else if (expectedType === Object) {
      valid = isPlainObject(value)
    } else {
      // 处理自定义类型
      valid = value instanceof expectedType
    }
  }
}
```

##### 处理原始包装类型

`Vue` 的 `props` 对原始包装类型（如 `new Number(1)`）是有特殊处理的：

```js
{
  numberWrapperObj: {
    type: Number
  }
}
```

对代码中的 `numberWrapperObj` 属性设置 `new Number(1)` 是验证通过的，所以需要对代码进行修改：

```js
if (simpleType.indexOf(expectedType) > -1) {
    const valueType = typeof value
    valid = valueType === expectedType.name.toLowerCase()
    // 原始包装类型
    if (!valid && valueType === 'object') {
      valid = value instanceof expectedType
    }
  }
```

总结：

- **对简单类型而言：通过 `typeof` 判断，原始包装类型需要用 `instanceof` 做二次验证**
- **对自定义类型而言：通过 `instanceof` 判断**

### 设置 `props`

设置组件的 `props` 是个非常简单的过程，发生在组件挂载中的[《创建组件的占位节点》](/mount-component.html#组件的占位节点)阶段，可以总结为**从 `VNodeData` 来，到 `props` 去**。

```js
function extractPropsFromVNodeData(vnodeData, Ctor) {
  const propsOptions = Ctor.options.props

  if (!propsOptions) return

  const { attrs, props } = vnodeData

  const res = {}
  if (attrs || props) {
    for (const key in propsOptions) {
      // 实际上 key 会被转换为 hyphen 风格
      if (props.hasOwnProperty(key)) {
        res[key] = props[key]
      } else if (attrs[key]) {
        res[key] = attrs[key]
        delete attrs[key]
      }
    }
  }
}
```

这段代码同时回答了另一个问题，组件不会区分一个属性是 `attribute` 还是 `prop`，对于组件而言，**如果一个属性没有被声明为 `prop` 那么就认为是 `attribute`。**
![非 Prop 属性](@imgs/data-and-props/screenshot_331.png)

### 对 `Boolean` 类型的属性进行特殊处理

`Vue` 对 `Boolean` 类型的 `props` 是有特殊处理的，原因是：

```html
<input type="checkbox" name="vehicle" value="Car" checked />

<input type="checkbox" name="vehicle" value="Bus" checked='checked' />

<input type="checkbox" name="vehicle" value="Bike" checked='' />
```

在上面的代码中， `checked` 这个 `attribute` 的值都会被认为是 `true`。所以对于 `Boolean` 类型的 `props/attrs` 来说，在父组件中使用该组件时，声明的属性只要满足以下条件就会被认为是 `true`：

- 只声明了属性名
- 值和属性相同
- 值是空字符串

```js
if (value === '' || value === propKey) {
  value = true
}
```

但是一个属性是可能有多种类型的，以上例来说，如果即有 `Boolean` 类型又有 `String` 类型的话，该如何处理呢？

答案是判断 `Boolean` 和 `String` 在 `type` 数组中的位置，所以最终的代码为：

```js
if (value === '' || value === propKey) {
  const stringIndex = prop.type.indexOf(String)
  if (stringIndex < 0 || stringIndex > prop.type.indexOf(Boolean)) {
    value = true
  }
}
```

<!-- ## 完整代码

响应式部分的完整代码更新为:

```js
function observe(value) {
  if (typeof value !== 'object' || value === null) {
    return
  }

  let ob
  if (value.hasOwnProperty('__ob__']) && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else {
    ob = new Observer(value)
  }

  return ob
}

class Observer {
  constructor(value) {
    this.value = value
    this.walk(value)

    // 在数组被修改后
    // 需要通过该属性找到当前 Observer 实例
    // 通过该实例将新添加的值变为响应式
    value.__ob__ = this

    if (Array.isArray(value)) {
      value.__proto__ = arrayMethods
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }

  observeArray(items) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }

  walk(value) {
    const keys = Object.keys(value)

    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }
}

function defineReactive(obj, key, val = obj[key]) {
  const dep = new Dep()
  const dependArray = value => {
    val.forEach(v => {
      v && v.__ob__ && v.__ob__.dep.depend()
      if (Array.isArray(v)) {
        dependArray(v)
      }
    })
  }
  const ob = observe(val)

  observe(val)

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      dep.depend()
      ob.dep.depend()
      if (Array.isArray(val)) {
        dependArray(val)
      }

      return val
    },
    set(newVal) {
      val = newVal
      observe(val)
      dep.notify()
    }
  })
}

function observe(value) {
  if (typeof value !== 'object' || value === null) {
    return
  }

  const ob = new Observer(value)

  return ob
}

const arrayProto = Array.prototype
const arrayMethods = Object.create(arrayProto)
;[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
].forEach(method => {
  const original = arrayProto[method]

  arrayMethods[method] = function mutator(...args) {
    // apply 在调用该新方法的数组上
    const result = original.apply(this, args)
    // 获取 value 的 Observer 实例
    const ob = this.__ob__

    switch (method) {
      case 'push':
      case 'unshift':
      case 'splice':
        // 因为新添加的值不是响应式数据
        // 此处可以只对新添加的值进行响应式处理
        ob.observeArray(result)
        break;
    }

    return result
  }
})
``` -->

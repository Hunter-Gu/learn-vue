# `$set` 和 `$delete` 的原理

在[《`data` 和 `props` 的处理》](/data-and-props.html#深-监听)部分，解释了“`Vue` 无法检测到对象属性的添加或删除”的原因：

- 添加和删除属性的操作无法被 `Object.defineProperty()` 劫持
- 新添加的属性不会被 `Vue` 处理为响应式数据
- `Vue` 只在初始化时，将数据转换为响应式数据

## `$set()`

但是如果需要添加响应式属性，也是可以办到的 - `Vue.prototype.$set()` 或 `Vue.set()`，这两个方法是一模一样的。

看例子：

```js
const vm = new Vue({
  data() {
    return {
      name: {
        firstname: 'nail'
      }
    }
  }
})

vm.$set(vm.name, 'lastname', 'hunter')
```

先定义该函数，既然是添加响应式属性，那就一定会用到之前的 [`defineReactive()` 函数](/data-and-props.html#响应式数据)：

```js
Vue.prototype.$set = function(target, key, value) {
  defineReactive(target, key, value)
}
```

### 添加后通知依赖更新

上面的代码给对象上添加了一个响应式数据，但是并不会通知依赖进行更新，假设如下场景时：

```js
const vm = new Vue({
  data() {
    return {
      name: {
        firstname: 'nail'
      }
    }
  },
  template: `<div>
    <p v-if="name.firstname && name.lastname">
      hello {{name.firstname}}.{{name.lastname}}
    </p>
  </div>`
})

vm.$set(vm.name, 'lastname', 'hunter')
```

在添加 `lastname` 属性后，希望组件会重新渲染从而更新页面。所以就**需要对依赖进行通知**，那么怎么才能获取到依赖列表？

恰好在[《`data` 和 `props` 的处理》](/data-and-props.html#数组的依赖列表)中为了解决数组的依赖通知问题，在 `Observer` 类上添加了依赖列表，现在我们就可以再次利用它：

```js
Vue.prototype.$set = function(target, key, value) {
  // 新增代码
  const ob = target.__ob__

  defineReactive(target, key, value)
  // 新增代码
  ob.dep.notify()
}
```

### 处理 `Array` 类型的对象

上面的代码并不适用于数组类型的响应式对象，好在现在 `Array` 的某些副作用方法是可以通知依赖进行更新的：

```js
Vue.prototype.$set = function(target, key, value) {

  // 新增代码
  if (Array.isArray(target)) {
    target.length = Math.max(target.length, key)
    // 利用了数组的拦截器的方法
    target.splice(key, 1, value)
    return
  }

  // 省略多余代码
}
```

## `$delete()`

通过 `$delete()` 删除响应式属性的目的是**通知视图更新**，仍旧用这个例子：

```js
const vm = new Vue({
  data() {
    return {
      name: {
        firstname: 'nail',
        lastname: 'hunter'
      }
    }
  },
  template: `<div>
    <p v-if="name.firstname && name.lastname">
      hello {{name.firstname}}.{{name.lastname}}
    </p>
  </div>`
})

vm.$delete(vm.name, 'lastname')
```

当删除属性 `lastname` 后，需要视图更新，所以 `$delete` 做的事情很简单：

- 删除属性
- 通知视图更新

```js
Vue.prototype.$delete = function(target, key) {

  // 数组仍旧使用拦截器中的方法
  if (Array.isArray(target)) {
    target.splice(key, 1)
    return
  }

  const ob = target.__ob__

  delete target[key]

  ob.dep.notify()
}
```

# `computed` 和 `watch` 的原理

## `computed`

首先看一下 `Vue` 里面是怎么定义 `computed` 的：

```js
// 方式一
{
  data() {
    return {
      age: 18
    }
  },
  computed: {
    getAge() {
      return this.age + 'years old'
    }
  }
}

// 方式二
{
  data() {
    return {
      age: 18
    }
  },
  computed: {
    getAge: {
      get() {
        return this.age + 'years old'
      },
      set(newAge) {
        this.age = newAge
      }
    }
  }
}
```

看到方式二很容易想到 `Object.defineProperty()` 这个 API 的 `getter/setter`，实际上确实有点关系：

```js
function initComputed(vm, computed) {
  for (const key in computed) {
    const userDef = computed[key]
    let getter
    let setter = function noop () {}

    if (typeof userDef === 'function') {
      getter = userDef
    } else {
      getter = userDef.get
      setter = userDef.set
    }

    Object.defineProperty(vm, key, {
      enumerable: true,
      configurable: true,
      get: getter,
      set: setter
    })
  }
}
```

官方文档上有提到：

> `computed` 是基于它的响应式依赖进行缓存的，只在相关的响应式依赖改变时才会重新求值。

从这句话我们可以得到两点信息：
- `computed` 也会触发响应式数据的依赖收集
- `computed` 的执行结果是会被缓存的

### 触发依赖收集

既然会触发依赖收集，那一定会涉及 `Watcher`，因为在[《变化监测》](/observe.html#依赖)章节说过，`Watcher` 就是依赖。

那么接下来的问题是如何将响应式数据、`computed` 以及 `Watcher` 三者进行关联？

以如下代码为例：

```js
{
  data() {
    return {
      age: 18
    }
  },
  computed: {
    getAge() {
      return this.age + 'years old'
    }
  }
}
```

`getAge()` 的调用会触发 `age` 的 `getter` 从而进行依赖收集；所以只需要将 `getAge()` 作为 `Watcher` 的[触发函数](/watch.html#触发函数)就可以达到这个目的了：

```js
function initComputed(vm, computed) {
  const watchers = vm._computedWatchers = {}
  for (const key in computed) {
    const userDef = computed[key]
    let getter
    let setter = function noop () {}

    if (typeof userDef === 'function') {
      getter = userDef
    } else {
      getter = userDef.get
      setter = userDef.set
    }

    // 新增代码
    watchers[key] = new Watcher(vm, getter, () => {})

    Object.defineProperty(vm, key, {
      enumerable: true,
      configurable: true,
      // 更新代码
      get() {
        return watchers[key].value
      },
      set: setter
    })
  }
}
```

### “懒惰的” `computed`

`computed` 是“懒惰的”，例子如下：

```js
{
  data() {
    return {
      age: 18
    }
  },
  computed: {
    getAge() {
      return this.age + 'years old'
    }
  }
}
```

如果没有使用 `getAge`，那么就不应该触发 `getAge()` 这个函数的执行，所以需要将 `Watcher` 修改：

```js
class Watcher {
  constructor(vm, key, cb, options) {
    this.obj = vm
    this.cb = cb
    this.deps = []
    // 新增代码
    this.lazy = (options && options.lazy) || false
    this.deep = (options && options.deep) || false

    if (typeof keyOrFn === 'function') {
      this.getter = keyOrFn.bind(vm)
    } else {
      this.getter = () => _.get(vm, keyOrFn)
    }

    // 新增代码
    this.value = this.lazy ? undefined : this.get()
  }

  get() {
    target = this

    const value = this.getter()

    if (this.deep) {
      traverse(value)
    }

    target = undefined
    return value

  }

  addDep(dep) {
    if (this.deps.indexOf(dep) === -1) {
      this.deps.push(dep)
    }
  }

  update() {
    const value = this.get()
    const oldValue = this.value
    if (value !== oldValue) {
      this.value = value
      this.cb.call(this.obj, value, oldValue)
    }
  }

  teardown() {
    const watcher = this
    this.deps.forEach(dep => {
      const index = dep.subs.indexOf(watcher)
      dep.subs.splice(index, 1)
    })
  }
}
```

对应的 `initComputed()` 则修改为：

```js
function initComputed(vm, computed) {
  const watchers = vm._computedWatchers = {}
  for (const key in computed) {
    // 省略多余代码...

    // 更新代码
    watchers[key] = new Watcher(vm, getter, () => {}, {
      lazy: true
    })

    Object.defineProperty(vm, key, {
      enumerable: true,
      configurable: true,
      // 更新代码
      get() {
        return watchers[key].get()
      },
      set: setter
    })
  }
}
```

### 支持缓存

支持缓存比较简单，只需要添加一个标志位：

```js
class Watcher {
  constructor(vm, key, cb, options) {
    this.lazy = (options && options.lazy) || false
    // 新增代码
    this.dirty = this.lazy
  }

  // 省略多余代码...

  // 新增代码
  evaluate() {
    this.value = this.get()
    this.dirty = false
  }

  update() {
    // 更新代码
    if (this.lazy) {
      // computed 的计算结果变化了，清除缓存
      this.dirty = true
    } else {
      // 原来的代码
      const value = this.get()
      const oldValue = this.value
      if (value !== oldValue) {
        this.value = value
        this.cb.call(this.obj, value, oldValue)
      }
    }
  }
}

const watchers = vm._computedWatchers = {}
function initComputed(vm, computed) {
  for (const key in computed) {
    // 省略多余代码...

    Object.defineProperty(vm, key, {
      enumerable: true,
      configurable: true,
      // 更新代码
      get() {
        const watcher = watchers[key]

        if (watcher.dirty) {
          watcher.evaluate()
        }

        return watcher.value
      },
      set: setter
    })
  }
}
```

当标志位 `dirty` 为 `true` 时表示依赖的响应式数据变化了，需要重新执行 `computed` 的函数进行计算，否则直接将之前的结果返回，达到了缓存的目的。

## `watch`

`watch` 的原理就约等于 `Vue.prototype.$watch()` 的原理，感兴趣可以直接看[`$watch` 章节](/watch.html)，这里将 `watch` 和 `computed` 放在一起是因为大家总是习惯将这两者比较，官方文档中也有涉及这[两者的比较](https://cn.vuejs.org/v2/guide/computed.html#%E8%AE%A1%E7%AE%97%E5%B1%9E%E6%80%A7-vs-%E4%BE%A6%E5%90%AC%E5%B1%9E%E6%80%A7)。

<!-- ## 完整代码

`Watcher` 的完整代码更新为：

```js
class Watcher {
  constructor(vm, key, cb, options) {
    this.obj = vm
    this.cb = cb
    this.deps = []
    // 新增代码
    this.lazy = (options && options.lazy) || false
    this.deep = (options && options.deep) || false

    if (typeof keyOrFn === 'function') {
      this.getter = keyOrFn.bind(vm)
    } else {
      this.getter = () => _.get(vm, keyOrFn)
    }

    this.value = this.lazy ? undefined : this.get()
  }

  get() {
    target = this

    const value = this.getter()

    if (this.deep) {
      traverse(value)
    }

    target = undefined
    return value
  }

  evaluate() {
    this.value = this.get()
    this.dirty = false
  }

  addDep(dep) {
    if (this.deps.indexOf(dep) === -1) {
      this.deps.push(dep)
    }
  }

  update() {
    if (this.lazy) {
      this.dirty = true
    } else {
      const value = this.get()
      const oldValue = this.value
      if (value !== oldValue) {
        this.value = value
        this.cb.call(this.obj, value, oldValue)
      }
    }
  }

  teardown() {
    const watcher = this
    this.deps.forEach(dep => {
      const index = dep.subs.indexOf(watcher)
      dep.subs.splice(index, 1)
    })
  }
}
``` -->

# 变化监测

变化监测是响应式系统中最核心的部分。所谓响应式系统，就是当我们在修改 Model 中的数据后，视图会自动更新。这使得我们开发变得简单，只需要关注 Model 层。

## 依赖

通过 `Object.defineProperty()` 劫持属性的 `getter/setter`，赋予了 `Vue` 监听数据变化的能力，进而通知数据的依赖进行更新，达到响应式的目的。而**依赖收集正是这一部分的关键。**

那么什么是依赖呢？

```js
new Vue({
  data: {
    message: '',
    count: 1
  },
  computed: {
    day() {
      return this.count + '天'
    }
  },
  template: `
  <div>
    <p>{{ message }}</p>
    <p>{{ day }}</p>
  </div>`
})
```

上例中：
- `template` 中使用数据 `message`，那么 `template` 就依赖了数据 `message`；
- 同样的 `template` 中使用了 `day`，而 `day` 中又使用了数据 `count`，那么 `day` 就依赖了 `count`

所以简单来说，依赖就是使用了这个数据的地方，那么如何抽象这一种行为呢？

- 当数据 `message` 的 `getter` 被触发时，我们就能知道数据 `message` 被依赖了，这时我们把这个依赖存起来
- 当数据 `message` 的 `setter` 被触发时，我们就能知道数据 `message` 被更新了，这时候需要通知依赖进行更新

### 总结

上述行为可以总结为：

- **在 `getter` 中收集依赖**
- **在 `setter` 中更新依赖**

以单次依赖为例，把依赖想象成一个拥有 `update()` 方法的对象：

```js
let dep
let val = obj[key]
Object.defineProperty(obj, key, {
  enumerable: true,
  configurable: true,
  get() {
    // 收集了依赖
    dep = xxx
    return val
  },
  set(newVal) {
    val = newVal
    dep.update()
  }
})
```

## `Watcher`

继续上面的例子，我们把这个依赖的类命名为 `Watcher`，那么 `Watcher` 的声明如下：

```js
class Watcher {
  update() {
    // ... 更新视图
  }
}
```

每次触发 `getter` 时会收集 `Watcher`，触发 `setter` 时调用 `update` 触发更新：

```js
let dep
let val = obj[key]
Object.defineProperty(obj, key, {
  enumerable: true,
  configurable: true,
  get() {
    // 新增代码
    dep = new Watcher()
    return val
  },
  set(newVal) {
    val = newVal
    dep.update()
  }
})
```

## Dep

同一个数据可能被多处依赖，所以需要一个容器来存储这些依赖，称之为 `Dep`，它是一个数组，这个数组会在数据变化时，通知所有依赖更新：

```js
class Dep {
  constructor() {
    this.subs = []
  }

  addSub(sub) {
    this.subs.push(sub)
  }

  notify() {
    const subs = this.subs
    for (let i = 0; i < subs.length; i++) {
      subs[i].update()
    }
  }
}

// 更新代码
const dep = new Dep()
let val = obj[key]
Object.defineProperty(obj, key, {
  enumerable: true,
  configurable: true,
  get() {
    // 更新代码
    dep.addSub(new Watcher)
    return val
  },
  set(newVal) {
    val = newVal
    // 更新代码
    dep.notify()
  }
})
```

## 通过 `Watcher` 触发 `getter`

上面的代码有一个问题，同一个依赖触发数据的 `getter` 时，仍会新建一个 `Watcher` 实例，所以我们需要修改上面的代码：

1.  把新建 `Watcher` 的过程提到 `getter` 外
2.  触发 `getter` 时，把触发这次 `getter` 的依赖添加到 `Dep`

第一个问题很容易解决，但是第二个问题比较棘手。为了解决第二个问题，我们需要修改 `Watcher`，由 `Watcher` 触发数据的 `getter`：

```js
let target

class Watcher {
  constructor(obj, key) {
    this.getter = () => obj.key
  }

  get() {
    target = this
    // 执行后触发 getter
    const value = this.getter()
    target = undefined
    return value
  }
  // ...省略多余代码
}

// ...省略多余代码
Object.defineProperty(obj, key, {
  enumerable: true,
  configurable: true,
  get() {
    // 更新代码
    dep.depend()
    return val
  },
  // ...省略多余代码
})

class Dep {
  // ...省略多余代码
  // 新增代码
  depend() {
    if (target) {
      if (this.subs.indexOf(target) === -1) {
        this.addSub(target)
      }
    }
  }
}
```

## `defineReactive()`

将上述转换响应式数据的代码抽象为一个函数命名为 `defineReactive()`：

```js
function defineReactive(obj, key, val = obj[key]) {
  const dep = new Dep()

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
      // 更新代码
      dep.notify()
    }
  })
}
```

变化监测部分的原理到这里就差不多分析完了，但是通过 `defineReactive()` 转换响应式数据的部分只涉及了最基础的部分，在 [《`data` & `props`》](/data-and-props.html)章节会进一步分析；`Watcher` 的作用也远没有分析完，在 `computed`, `watch`和 `$watch()` 中都需要提到它，详见 [ 《`$watch` 的原理》](watch.html)以及[《`computed` 和 `watch` 的原理》](/computed-and-watch.html)。

## 完整代码

```js
let target

function defineReactive(obj, key, val = obj[key]) {
  const dep = new Dep()

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      dep.depend()
      return val
    },
    set(newVal) {
      val = newVal

      dep.notify()
    }
  })
}

class Watcher {
  constructor(obj, key) {
    this.getter = () => obj.key
  }

  get() {
    target = this
    // 执行后触发 getter
    const value = this.getter()
    target = undefined
    return value
  }

  update() {
    // 更新代码
  }
}

class Dep {
  constructor() {
    this.subs = []
  }

  addSub(sub) {
    this.subs.push(sub)
  }

  notify() {
    const subs = this.subs
    for (let i = 0; i < subs.length; i++) {
      subs[i].update()
    }
  }

  depend() {
    if (target) {
      if (this.subs.indexOf(target) === -1) {
        this.addSub(target)
      }
    }
  }
}
```

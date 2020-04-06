# 异步更新队列

[`Vue` 的官方文档](https://cn.vuejs.org/v2/guide/reactivity.html#%E5%BC%82%E6%AD%A5%E6%9B%B4%E6%96%B0%E9%98%9F%E5%88%97)中有对异步更新队列进行介绍，而 `Vue.prototype.$nextTick()/Vue.nextTick()` 就是对外包暴露的接口。

简单来说，异步更新队列就是**将一段时间内的修改，延迟到某个时间点统一执行**。这么做的好处是可以避免不必要的渲染。

我们每次修改数据，会导致组件的重新渲染，对于一个组件而言，一段时间内不大可能只修改一个数据，这就会引起多次重新渲染，这显然是不必要的。而将修改缓存，在一段时间后只执行一次重新渲染听起来就是个不错的主意。

## 异步任务队列 - `Vue.prototype.$nextTick()`

我把 `Vue.prototype.$nextTick()` 称为异步任务队列，因为它并不具备更新视图的能力。

```js
const queue = []
let pending = false

function nextTick(cb) {
  queue.push(cb)

  if (!pending) {
    pending = true
    runTimerFunc()
  }
}

function flushQueue() {
  const copies = queue.slice(0)
  queue.length = 0

  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
  pending = false
}

// 异步任务执行器
let microTask
let macroTask
let useMicroTask = true
if (typeof Promise !== undefined) {
  const p = Promise.resolve()
  microTask = () => p.then(flushQueue)
} else {
  task = () => setTimeout(flushQueue, 0)
  useMicroTask = false
}

function runTimerFunc() {
  if (useMicroTask) {
    microTask()
  } else {
    task()
  }
}
```

此处涉及的 JavaScript 事件循环以及任务、微任务可以看[这篇文章](https://hunter-gu.github.io/personal-blog/2020/03/20/event-loop/)。

## 更新视图

在[《变化监测》](/observe.html#watcher)章节，我们反复提到**响应式数据变化后，会通知依赖（视图）更新**。

在[《组件挂载》](/mount-component.html#更新组件-prepatch)章节，也提及了组件的更新。

但是却从没有提到依赖是如何触发更新的？

非常简单：

```js
new Watcher(vm, () => {
  vm.update(vm.render())
})
```

别看只有一行代码，它是[触发函数](/watch.html#触发函数)的典型使用！想想看，执行 `render()` 函数一定会导致 `data` 中的响应式数据的 `getter`，就会触发依赖收集，而且这些数据收集的依赖都是这一个 `Watcher` 实例！

更有意思的是，无论哪个响应式数据的 `setter` 触发了，就会执行 `update()` 以更新视图，而更新视图对于该 `Watcher` 实例就只需要执行当前 `Watcher` 实例的 `getter()` 方法。

这个过程的精髓也就是官网的这张图：

![MVVM](@imgs/async-queue/data.png)

实际上，组件的挂载和更新都是通过这样的方式。在执行 `new Watcher` 时，回调函数会执行，这时候是组件的挂载；之后触发回调的执行就会更新组件。

```js
class Watcher {

  // 省略多余代码...

  update() {
    const value = this.get()
    const oldValue = this.value
    if (value !== oldValue) {
      this.value = value
      this.cb.call(this.obj, value, oldValue)
    }
  }
}
```

> 上面是[目前为止](/watch.html)我们得到的 `Watcher`，由于此处会涉及 `update()` 方法，所以将它列出，其他部分就省略了。

`update` 中执行了 `get()`，从而执行了 `render()` 导致视图更新。

### 调度器

在上面的代码目前可以运行，但是组件的生命周期是混乱的。子组件修改某个数据后，父组件再修改某个数据，会导致子组件的 `update` 钩子先触发，这是不符合感知的。

我们希望，**对于同一种生命周期函数，总是按照从父组件到子组件的顺序触发。**所以就需要进行调度来实现顺序的编排，那么该怎么做？ - 给 `Watcher` 添加 `id`！

为什么给 `Watcher` 添加 `id` 可以是实现顺序的编排？

因为创建组件是按照从父组件到子组件的顺序创建的，那么对应的组件的 `Watcher` 就也是按照这个顺序，话句话说父组件的 `id` 肯定是小于子组件的 `id` 的：

```js
id = 0
class Watcher {
  constructor() {
    this.id = ++id
    // 省略多余代码
  }

  // 省略多余代码
}
```

接着就是对 `Watcher` 缓存，并对执行顺序进行编排：

```js
const queue = []

function flushSchedulerQueue() {
  queue.sort((a, b) => a.id - b.id)

  for (let i = 0; i < queue.length; i++) {
    const watcher = queue[i]
    callHook(watcher.vm, 'beforeUpdate')
    watcher.update()
    callHook(watcher.vm, 'updated')
  }


  queue.length = 0
}

function queueWatcher(watcher) {

  if (queue.indexOf(watcher) > -1) {
    return
  }

  queue.push(watcher)

  nextTick(flushSchedulerQueue)
}
```

在 `Watcher` 中调用该方法：

```js
class Watcher {

  // 省略多余代码...

  update() {
    // 更新代码

    // 表示是触发 computed 的依赖更新
    if (this.lazy) {
      const value = this.get()
      const oldValue = this.value
      if (value !== oldValue) {
        this.value = value
        this.cb.call(this.obj, value, oldValue)
      }
    } else {
      // 表示是修改响应式数据了
      queueWatcher(this)
    }
  }
}
```

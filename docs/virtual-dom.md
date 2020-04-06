# 虚拟 DOM

关于虚拟 DOM 有非常好的[文章](http://hcysun.me/vue-design/zh/essence-of-comp.html)，强烈推荐！

---

> 注：这篇文章不会完整的分析虚拟 DOM，也没有专门地对 `Vue` 中的虚拟 DOM 进行分析，这篇文章的主要目的是讲解虚拟 DOM 中的关键点。

在模板编译部分，最终我们会得到 `render()` 函数，执行后返回的是 `VNode` 树，通过这颗树渲染页面。

## 终极问题

首先通过回答终极问题，来了解虚拟 DOM。

### 是什么

通过描述状态和 DOM 之间的映射关系，将数据渲染为视图。比如：

```html
<div class="box"></div>
```

可以描述为：

```js
{
  tag: 'div',
  attrs: {
    class: 'box'
  }
}
```

然后通过当前平台的渲染 API，就可以渲染出页面。

### 为什么

那么为什么要使用虚拟 DOM 呢？

- 一方面，因为操作 JavaScript 对象比操作 DOM 要快得多。而当涉及**频繁**的 DOM 操作时，通过浏览器的 API 来操作 DOM 就可能会导致性能问题。
- 另一方面，虚拟 DOM 是分层设计，它抽象了渲染的过程，使得框架可以跨平台运行，这是**虚拟 DOM 的最大优点**。

## `VNode`

JavaScript 对象，用于描述状态和 DOM 之间的关系，形如：

```js
{
  tag: 'div',
  attrs: {
    class: 'box'
  },
  children: []
}
```

### `h()`

`h()` 函数用于创建 `VNode()` 节点：

```js
function h(tag, data, children) {
  return {
    tag, data, children
  }
}
```

## `mount()`

在得到 `VNode` 节点后，需要做两件事：

- 创建对应的 DOM 节点
- 挂载到指定的父节点下

```js
// 原生 DOM 节点
function mountElement(vnode, container) {
  const element = document.createElement(vnode.tag)
  container.appendChild(element)
}
```

这对平台原生的 DOM 节点来说很简单，但是组件该怎么挂载？

### 组件挂载

每个组件都有 `render()` 函数，而 `render()` 函数可以返回 `VNode` 对象：

```js
function mountComponent(vnode, container) {
  const instance = new node.tag()
  const instance.vnode = instance.render()

  mountElement(instance.vnode, container)
}
```

### `Fragment`

假设当前页面的模板如下：

```html
<h1></h1>
<comp-main></comp-main>
<footer></footer>
```

对应的 `comp-main` 组件的模板如下：

```html
<div>
  <h2></h2>
  <p></p>
</div>
```

最终渲染后的 html 就是：

```html
<h1></h1>
<div>
  <h2></h2>
  <p></p>
</div>
<footer></footer>
```

最外层的 `div` 可能是不需要的，但是对组件而言必须要有根标签。`Fragment` 组件表示只**挂载子孙节点**，而 `Fragment` 标签不会被挂载。

所以把 `comp-main` 组件的模板修改后：

```html
<Fragment>
  <h2></h2>
  <p></p>
</Fragment>
```

最终得到的 html 如下：

```html
<h1></h1>

<h2></h2>
<p></p>

<footer></footer>
```

### `Portal`

`Portal` 组件用于将子节点渲染到父组件以外的节点，当我们在写弹层组件时，可能会用到：

以点击按钮后弹出弹层为例，如果逻辑很复杂，我们可能将按钮和弹层封装在一个组件中，它的模板如下：

```html
<template>
  <div class="comp">
    <button></button>
    <dialog></dialog>
  </div>
<template>
```

在这个例子中，`dialog` 组件的样式会受限于 `.comp`。对于 `dialog` 组件来说，我们期望它是在 `body` 节点中的最后一个子元素，而这就是 `Portal` 组件的作用 - **将子孙节点渲染到指定的节点下**：

```html
<template>
  <div class="comp">
    <button></button>
    <Portal target="body">
      <dialog></dialog>
    </Portal>
  </div>
<template>
```

## `patch()`

挂载完成后，修改数据就需要更新视图。

最简单的方式，可以从根节点开始全部基于新数据重新挂载，这很容易办到。

但是一般情况下，修改的数据可能只会导致部分需要更新，所以全部重新挂载显然是没必要的，这就需要进行所谓的 diff：

- 判断前、后 tag 的是否相同
- 比对前、后 vnode 的属性变化，进行更新
- 更新组件的视图

### 组件的更新

组件更新时，本质上是执行组件的 `render()` 函数，`render()` 函数会根据组件的当前状态生成新的 `VNode` 节点用于 `patch()`，可以在 `mountComponent()` 时，给组件实例动态添加 `update()` 方法：

```js
function mountComponent(vnode, container) {
  const instance = new node.tag()

  instance.update = function() {
    if (instance._mounted) {
      const prevVnode = instance.vnode
      const vnode = instance.vnode = instance.render()
      patch(vnode, prevVnode)
    } else {
      const instance.vnode = instance.render()
      instance._mounted = true
      mountElement(instance.vnode, container)
    }
  }
}
```

在对组件进行 `patch()` 时，只需要执行组件的 `update()` 方法即可。

### `key`

我们肯定希望尽可能的复用 DOM 元素，而在处理列表时经常会有交换位置的情况，所以上面的方法还有优化的空间 - 通过 `key` 给 `VNode` 对象添加唯一标识。

## diff

在有了 `key` 之后，就需要对节点的子元素进行 diff 算法，找到列表更新前、后的同一节点进行 `patch()`，以及交换位置操作。

需要强调的是**所有交换位置的操作，都需要针对旧节点元素**。

### 常规操作 - 双层循环

最容易想到的方式必然是双层循环：

```js
function diff(children, prevChildren, container) {
  for (let i = 0; i < children.length; i++) {
    const vnode = children[i]

    for (let j = 0; j < prevChildren.length; j++) {
      const prevVnode = prevChildren[j]

      if (vnode.key === prevVnode.key) {
        patch(vnode, prevVnode)

        if (i < children.length - 1 && i !== j) {
          const refNode = children[i + 1].$el
          container.insertBefore(prevVnode.$el, refNode)
        }

        break
      }
    }
  }
}
```

### 递增索引 - 双层循环

上面的双层循环中，其实有些节点是不需要移动的，举个例子：

```
prev children:  li-a  li-b  li-c  li-d

new  children:  li-c  li-a  li-d  li-b
```

该例子中，实际上只需要两个移动操作即可：

- 将 li-a 插入到 li-d 前
- 将 li-b 插入到末尾

先看一下什么情况下不需要移动：

```
prev children:  li-a  li-b  li-c  li-d

new  children:  li-a  li-b  li-c  li-d
```

对应的索引是 0 -> 1 -> 2 -> 3 递增的，所以只需要满足**寻找过程中的索引值不是递增的，则说明该节点需要移动。**

为了知道寻找过程中的索引值是否是递增的，只需要添加一个变量记录上一次的索引：

```js
function diff(children, prevChildren, container) {
  let lastIndex = 0
  for (let i = 0; i < children.length; i++) {
    const vnode = children[i]

    for (let j = 0; j < prevChildren.length; j++) {
      const prevVnode = prevChildren[j]

      // 不是递增
      if (j < lastIndex) {
        // 插入到两个节点中间
        const refNode = children[i - 1].el.nextSibling
        container.insertBefore(prevVnode.el, refNode)
      } else {
        lastIndex = j
      }
    }
  }
}
```

### 双端对比

[递增索引](#递增索引-双层循环)方式可以避免一些不必要的移动，但是在某些情况下还有提升的空间：


```
prev children:  li-a  li-b  li-c  li-d

new  children:  li-d  li-a  li-b  li-c
```

上例中，最好的方法应该是直接吧 li-d 插入到 li-a 前，但是在[递增索引](#递增索引-双层循环)方式中居然要移动 3 次。

双端对比的思路如图：

![双端对比](@imgs/virtual-dom/diff-vue2-4.b1c3cc2a.png)

详情请看[文章](http://hcysun.me/vue-design/zh/renderer-diff.html#%E5%8F%A6%E4%B8%80%E4%B8%AA%E6%80%9D%E8%B7%AF-%E5%8F%8C%E7%AB%AF%E6%AF%94%E8%BE%83)。

## ref

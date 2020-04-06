# 事件机制

## 模板中的 `v-on/@`

一般情况下，通过在模板中使用 `v-on/@` 监听事件，并在触发时运行一些 JavaScript 代码。

那么模板中的 `v-on/@` 会被怎样处理，以实现事件监听呢？

```html
<div @click="handleClick"></div>
```

模板的编译时，除标签以外都会被认为是属性，所以在 `start` 钩子中创建的 AST 节点对象如下：

```js
{
  tag: 'div',
  attrs: {
    '@click': 'handleClick'
  }
}
```

### 维护事件列表

而在 `end` 钩子中，就会对所有属性进行处理：

```js
// el 是 AST 节点对象
// name 是事件名
// value 是方法名
const onRe = /^@|^v-on:/

if (onRe.test(name)) {
  const events = el.events || (el.events = {})
  name = name.replace(onRe, '')

  events[name] = (events[name] || []).concat(value)
}
```

所以得到的 AST 节点如下：

```js
{
  tag: 'div',
  events: {
    click: ['handleClick']
  }
}
```

### 修饰符

`Vue` 提供[修饰符](https://cn.vuejs.org/v2/guide/events.html#%E4%BA%8B%E4%BB%B6%E4%BF%AE%E9%A5%B0%E7%AC%A6)来简化事件的使用，那么如何实现修饰符的功能？

```html
<div @click.stop="handleClick"></div>
```

解析修饰符：

```js
const modifierRe = /\.[^.]+/g
function parseModifier(name) {
  const match = name.match(modifierRe)
  if (match) {
    const ret = {}

    match.forEach(m => {
      ret[m.slice(1)] = true
    })

    return ret
  }
}
```

所以维护事件列表时的代码就需要修改：

```js
// el 是 AST 节点对象
// name 是事件名
// value 是方法名
const onRe = /^@|^v-on:/
const modifierRe = /\.[^.]+/g
const modifiers = parseModifier(name)

// 新增代码
if (modifiers) {
  name = name.replace(modifierRe)
}

if (onRe.test(name)) {
  name = name.replace(onRe, '')
  // 更新代码

  let events = el.events || (el.events = {})

  // 新增代码
  const handler = {
    value: value.trim(),
    modifiers: modifiers
  }

  events[name] = (events[name] || []).concat(handler)
}
```

所以得到的 AST 节点如下：

```js
{
  tag: 'div',
  events: {
    click: {
      value: 'handleClick',
      modifiers: {
        stop: true
      }
    }
  }
}
```

## 原生 DOM 事件

> 注：这一部分在 `Vue` 中实际是通过代码字符串的方式拼接，最后通过 `new Function()` 等方式动态执行的。这里只做分析所以没有必要这么做。

通过模板编译，把模板中的 `v-on/@` 解析成了 JavaScript 对象，就下来就要在代码生成中嵌入当前平台上的事件方法（以监听事件为例）：

```js
// el 表示元素
for (const event in events) {
  const handler = events[event]

  el.addEventListener(event, handler.value)
}
```

但是还需要对修饰符进行处理，而且在 `Vue` 中事件的值是支持表达式的，如：

```html
<div @click="visible = false"></div>
```

所以需要进行一些特殊处理：

```js
for (const event in events) {
  const handler = events[event]

  el.addEventListener(event, function(event) {

    if (handler.modifiers.stop) {
      event.stopPropagation()
    }

    if (handler.modifiers.prevent) {
      event.preventDefault()
    }

    // ...省略

    // 判断是否是函数，此处简化了
    if (/[a-zA-Z0-9_$]/.test(handler.value)) {
      handler.value(event)
    } else {
      new Function(handle.value) // 此处只是举个例子，表示执行该 js 语句，如 a = 1 这样的语句
    }
  })
}
```

对于修饰符这一部分，有些修饰符并不是这么处理的， 如 `capture`，因为 `capture` 在 web 平台下是 `addEventListener()` 的参数，对于这些修饰符，实际上在模板编译时会对事件名进行特殊的处理。以 `capture` 为例：
```js
const onRe = /^@|^v-on:/
const modifierRe = /\.[^.]+/g
const modifiers = parseModifier(name)

if (modifiers) {
  name = name.replace(modifierRe)
}

if (onRe.test(name)) {
  name = name.replace(onRe, '')

  // 新增代码
  if (modifiers.capture) {
    name = `!` + name
  }

  let events = el.events || (el.events = {})

  const handler = {
    value: value.trim(),
    modifiers: modifiers
  }

  events[name] = (events[name] || []).concat(handler)
}
```

对应在代码生成时：

```js
for (const event in events) {
  const handler = events[event]
  // 新增代码
  let params = {}
  if (event[0] = '!') {
    params.capture = true
    event = event.slice(1)
  }

  el.addEventListener(event, function(event) {

    if (handler.modifiers.stop) {
      event.stopPropagation()
    }

    if (handler.modifiers.prevent) {
      event.preventDefault()
    }

    if (/[a-zA-Z0-9_$]/.test(handler.value)) {
      handler.value(event)
    } else {
      new Function(handle.value) // 此处只是举个例子，表示执行该 js 语句，如 a = 1 这样的语句
    }
  }, params) // 新增代码
}
```

## 组件的事件

但是目前的方式都只适用于浏览器中的 DOM 标签元素，并不适用于 `Vue` 组件，所以需要对组件的事件特殊处理。

### 发布订阅模式

组件的事件机制非常简单，就是发布订阅模式：

```js
Vue.prototype.$emit = function(event, ...args) {
  const vm = this

  let cbs = vm._events[event]

  if (cbs) {
    cbs = cbs.length > 1 ? cbs.slice(0) : cbs
    cbs.forEach(cb => cb.apply(vm, args))
  }
}

Vue.prototype.$on = function(event, handler) {
  const vm = this

  if (vm._events) {
    vm._events = Object.create(null)
  }

  (vm._events[event] || vm._events[event] = []).push(handler)
}

Vue.prototype.$off = function(event, handler) {
  const vm = this
  // 移除所有事件
  if (!arguments.length) {
    vm._events = Object.create(null)
  }

  if (!handler) {
    vm._events[event] = []
  }
  const cbs = vm._events[event]
  const i = cbs.indexOf(handler)

  cbs.splice(i, 1)
}
```

### 父、子组件间的处理

但是这样的机制只能运行在当前组件实例自身范围内，举个例子：

```js
const vm = new Vue({
  template: `
    <div>
      <comp-name @eventname="handleEvent"></comp-name>
    </div>
  `,
  methods: {
    handleEvent() {
      // ...
    }
  }
})
```

对于这个组件实例来说：

- 子组件 `comp-name` 会 `emit` 事件 `eventname`
- 当前组件提供了处理函数 `handleEvent`

也就是或，_事件的处理函数和事件的触发是在不同组件实例上_，在阅读源码之前，我以为需要去父组件实例中寻找该方法，但实际上并不，那么该怎么做呢？

> 处理函数的作用域在初始化时，已经绑定在该组件了。所以问题的关键只有如何寻找到这个处理函数！

对于例子中的模板，最终 `render()` 函数返回的 `VNode` 树大致如下：

```js
{
  tag: 'div',
  children: [
    {
      tag: 'vue-component-2-comp-name',
      listeners: {
        eventname: function handleEvent() {
          // ...
        }
      }
    }
  ]
}
```

注意 `listeners` 中事件的处理函数，并不是事件名，而是一个函数！因为 `render()` 函数中通过 `with` 绑定了作用域，所以在直接通过变量名就可以找到该函数。为了方便理解，我们直接把 `render` 绑定到组件的构造函数上（实际上并不如此，另外实际上需要通过代码字符串动态执行，此处这么做都是为了便于理解）：

```js
VueComponent.prototype.render = function () {
  // 理解为 render 函数的作用域
  with(vm) {
    return createElement(
      'div',
      [
        createElement('SubComp', {
          on: {
            "test": handleClick // 不是字符串，是变量名，这很关键
          },
          nativeOn: {
            "click": function ($event) {
              return handleClick($event)
            }
          }
        })
      ]
    )
  }
}
```

所以当在子组件中处理该事件时，可以直接使用该函数，而并不需要去父组件中寻找了：

```js
const vm = vnode.componentInstance
// 子组件的事件，可以在子组件实例的 `listeners` 属性上获取到
const listeners = vnode.listeners

for (const event in listeners) {
  vm.$on(event, listeners[event])
}
```

整个过程非常简单！

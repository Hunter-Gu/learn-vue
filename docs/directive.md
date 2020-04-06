# 指令的奥秘

指令的本质/奥秘是什么？

- `v-if`是怎么实现的？
- `v-for`是怎么实现的？
- `v-model`是怎么实现的?
- `v-on`是怎么实现的?
- `v-bind`是怎么实现的?

指令的处理会贯穿 `Vue` 内部的各个核心技术点：

```mermaid
stateDiagram
  normalizeDirectives --> create --> update --> destroy
```

## 格式化

由于指令支持函数和对象类型，所以在初始化时格式化为对象类型：

```js
function normalizeDirectives(directives) {
  if (directives) {
    for (const key in directives) {
      const def = directives[key]
      if (typeof def === 'function') {
        // 转换为对象形式
        directives[key] = {
          bind: def,
          update: def
        }
      }
    }
  }
}
```

可以看到，`bind` 和 `update` 两个钩子是一定会有的，之后会介绍它们在何时触发。

## 模板编译时解析

在模板编译阶段，会对指令进行一些处理，把指令添加到当前 AST 节点的指令栈（`directives` 属性）中：

```js
// el 是 VNode 节点对象
// value 是绑定的值
const attrsList = el.attrsList

const dirRe = /^v-/
for (let i = 0; i < attrsList.length; i++) {
  let name = attrsList[i].name
  const value = attrsList[i].value
  if (dirRe.test(name)) {
    name = name.replace(dirRe, '')

    if (!el.directives) {
      el.directives = []
    }

    el.directives.push({
      name,
      value
    })
  }
}
```

### 指令的修饰符和参数

和[事件](/event.html#修饰符)一样，指令也同样支持修饰符，解析方式也是和[事件的修饰符](/event.html#修饰符)一模一样：

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

参数的解析也很类似：

```js
const argRe = /:(.*)$/
function parseArg(name) {
  const match = name.match(argRe)
  return match && match[1]
}
```

但是参数还支持动态参数，所以需要对该函数进行修改：

```js
const argRe = /:(.*)$/
const dynamicArgRe = /^\[.*\]$/
function parseArg(name) {
  const match = name.match(argRe)
  let arg = match && match[1]
  let isDynamic = false

  if (arg) {
    name = name.slice(0, -(arg.length + 1))
    if (dynamicArgRe.test(name)) {
      arg = arg.slice(1, -1)
      isDynamic = true
    }
  }

  return { arg, isDynamic }
}
```

所以，**最终解析指令的代码**为：

```js
// el 是 VNode 节点对象
// value 是绑定的值
const attrsList = el.attrsList

const dirRe = /^v-/
const modifierRe = /\.[^.]+/g
const argRe = /:(.*)$/
const dynamicArgRe = /^\[.*\]$/

for (let i = 0; i < attrsList.length; i++) {
  let name = attrsList[i].name
  const value = attrsList[i].value
  if (dirRe.test(name)) {
    name = name.replace(dirRe, '')

    const modifier = parseModifier(name)

    if (modifier) {
      name = name.replace(modifierRe, '')
    }

    const { arg, isDynamic, name: _name } = parseArg(name)

    if (arg) {
      name = _name
    }

    if (!el.directives) {
      el.directives = []
    }

    el.directives.push({
      name,
      value,
      modifier,
      arg,
      isDynamic
    })
  }
}

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

function parseArg(name) {
  const match = name.match(argRe)
  let arg = match && match[1]
  let isDynamic = false

  if (arg) {
    name = name.slice(0, -(arg.length + 1))
    if (dynamicArgRe.test(arg)) {
      arg = arg.slice(1, -1)
      isDynamic = true
    }
  }

  return { arg, isDynamic, name }
}
```

## 指令的本质

指令的本质是 `VNode`? 节点的钩子函数。实际上 `transition` 组件、`class` 和 `style` 的特殊处理都是通过类似的方式。

`Vue` 内部对指令定义了如下三个钩子函数：

- `create`
- `update`
- `destroy`

### `create` - `bind` & `inserted`

当一个节点被创建后，就会触发 `create` 钩子。注意此时节点虽被创建但是还没有被插入 DOM 中，当然整个页面也还没有挂载。

`create` 意味着创建新的节点，所以会触发 `bind` 钩子函数：

```js
// vm 是当前组件的实例
const vm = vnode.context // 组件实例
const dirs = vm.$options.directives
for (const dir in dirs) {
  callHook(dirs, 'bind')
}
```

[官方文档上](https://cn.vuejs.org/v2/guide/custom-directive.html#%E9%92%A9%E5%AD%90%E5%87%BD%E6%95%B0)说：

> `inserted` 钩子函数在被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。

`Vue` 内部的实现其实非常简单，在触发 `bind` 钩子函数后，给该 `VNode` 对象动态的添加 `insert` 钩子函数：

```js
// vm 是当前组件的实例
const vm = vnode.context // 组件实例
const dirs = vm.$options.directives
for (const dir in dirs) {
  callHook(dirs, 'bind')

  // 新增代码
  vnode.insert = () => {
    callHook(dirs, 'inserted')
  }
}
```

那么在何时触发这个函数？和[组件节点的挂载](/mount-component.html#mounted-生命周期-insert)以相同的方式处理即可。

### `update` - `update` & `componentUpdated`

在[组件更新](/mount-component.html#更新组件-prepatch)时会调用 `VNode` 节点对象的 `prepatch` 钩子函数，实际上还有 `update` 和 `postpatch` 这两个钩子函数：

- `prepatch`
- `update`
- `postpatch`

而 `update` 和 `postpatch` 就是组件更新时会调用的指令上的钩子函数，并且处理方式和 `create` 几乎类似：

```js
// vm 是当前组件的实例
const vm = vnode.context // 组件实例
const dirs = vm.$options.directives
for (const dir in dirs) {
  callHook(dirs, 'componentUpdated')

  // 新增代码
  vnode.postpatch = () => {
    callHook(dirs, 'postpatch')
  }
}
```

### `destroy` - `unbind`

在[组件销毁](/mount-component.html#销毁组件-destroy)时会调用 `VNode` 节点对象的 `destroy` 钩子函数，而这个钩子函数中就会触发指令的 `unbind` 钩子函数：

```js
// vm 是当前组件的实例
const vm = vnode.context // 组件实例
const dirs = vm.$options.directives
for (const dir in dirs) {
  callHook(dirs, 'unbind')
}
```

## 总结

总的来说，指令的原理其实是很简单的，它的本质就是**在 `VNode` 对象的不同阶段，触发不同的回调函数**。

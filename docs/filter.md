# filter 的本质

## `filter` 的本质

在函数式编程中有一个概念叫 `compose`（或 `pipe`），可以将多个函数组合起来，得到一个新的函数，其本质就是上一个函数的返回值作为下一个函数的参数，这和 `fitler` 很类似。

实际上 Angular 也有类似 `filter` 的功能叫做 `pipeline`，我个人觉得这个名字更贴切。

在 `Vue` 中，我们可以在文本以及属性中使用 `filter`，并且 `filter` 还可以串联，那么 `filter` 是如何被解析的呢？

## 解析 `filter`

以在文本中使用为例：

```html
<p>hello {{ name | capitalize }}</p>
```

`filter` 的处理可以理解为一个文本解析器：

- 先匹配模板标记中的内容，如上例的 `name | capitalize`，通过正则很容易办到
- 依次遍历每一位，判断是否是 `|`
- 保存 `filter` 继续解析
- 转换为代码字符串

```js
function parseFilters(exp) {
  const filters = []
  let experssion
  let lastFilterIndex
  let i

  const pushFilter = () => {
    filters.push(exp.slice(lastFilterIndex, i).trim())
  }

  for (i = 0; i < exp.length; i++) {
    // 确保不是 ||
    if (exp[i] === '|' && exp[i - 1] !== '|' && exp[i + 1] !== '|') {
      // 变量，如上例的 name
      if (experssion === undefined) {
        experssion = exp.slice(0, i).trim()
        // 下一次开始截取的位置
        lastFilterIndex = i + 1
      } else {
        pushFilter()
      }
    }
  }

  // 处理最后一项
  // 如 name | capitalize | addColon
  // addColon 后面没有 | 符号，所以没办法触发循环中的 pushFilter 函数
  if (expression === undefined) {
    experssion = exp.slice(0, i).trim()
  } else {
    pushFilter()
  }
}
```

## 处理 `filter` 的参数

最后，需要将 `filter` 转换为对应的代码字符串：
```js
const wrapFilter(arg, filter) {
  const i = filter.indexOf('(')

  if (i < 0) {
    return `_f(${filter})(${arg})`
  } else {
    const filterName = filter.slice(0, i)
    let args = filter.slice(i + 1)
    args = args === ')' ? args : ',' + args
    return `_f(${filter})(${arg + args}`
  }

}

if (filters.length) {
  for (let i = 0; i < filters.length; i++>) {
    // experssion 实际就是下一个 filter 的参数
    expression = wrapFilter(experssion, filters[i])
  }
}
```

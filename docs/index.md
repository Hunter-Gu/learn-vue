# Vue 源码学习

> 记录我学习 `Vue` 源码的过程。

## 前提

看源码是有前提的，你需要对框架足够熟悉了再去看，大致可以分为如下几个问题。

**`Vue` 解决了什么问题?**
- 组件化
- 声明式渲染
- MVVM

**`Vue` 的设计思想是什么？**
- 响应式数据

**`Vue` 有哪些主要的功能点？**
- 变化监测
- 模板编译
- 虚拟 DOM

## 准备

### 项目目录

`Vue` 的仓库采用了 monorepo 的方式，也就是所有相关的项目都在这个仓库中，我们熟悉的 `vue-template-compiler` 就在其中，具体有哪些在 /package 中都可以看到，下面是一些主要的文件夹及其对应的功能：

```
/vue
  ├── /flow                                     # flow 的声明文件
  ├── /packages                                 # 相关项目，如 vue-template-compiler
  ├── /scripts                                  # 构建、发布相关的脚本
  ├── /src
        ├── /compiler                           # 模板编译
        ├── /core                               # 核心代码
                ├── /components                 # 全局内置组件，目前只包括 `keep-alive`
                ├── /global-api                 # 定义 `Vue` 上的 API
                ├── /instance                   # 定义 `Vue.prototype` 上的 API
                ├── /observer                   # 响应式
                ├── /util                       # core 文件夹下的工具函数
                ├── /vdom                       # 虚拟 dom
        ├── /platforms                          # 不同平台的支持
                ├── /web
                      ├── /compiler             # web 平台下，模板编译支持的属性和指令，如 `v-model`，`v-text` 等
                      ├── /runtime              # web 平台下，运行时支持的属性和指令，如 `transition`,`style`, `v-model` 等
                      ├── /server               # 服务端渲染
                      ├── /util                 # web 平台下的工具含糊
                      ├── entry-xxx.js          # 不同版本的入口文件，如包括运行时编译的 entry-runtime-with-compiler.js
                ├── /weex
      ├── /server                               # 服务端渲染
      ├── /sfc                                  # .vue 文件解析
      ├── /shared                               # 共享代码
├── /test                                       # 测试用例
├── /types                                      # ts 类型声明文件
```

### 构建

以 Runtime+Compiler 版本为例，是以 `src/platforms/web/entry-runtime-with-compiler.js` 为入口开始构建的，通过注入的方式为特定环境添加特定的功能，如：

```js
const mount = Vue.prototype.$mount

// 注入当前版本特定的
// 该函数中调用了 compiler
Vue.prototype.$mount = function(el, hydrating) {
  // ...
}
```

## 核心模块

我看的版本是 2.5.18-beta.0 版本的，但其实更好的方式是看早期版本，如 1.0 或者更早的，因为那时候是比较纯粹的，现在的版本会有许多折中可能不太适合阅读。

我将 Vue 的核心分为如下模块，在看代码时采取分块阅读的方式：

- 变化监测
- 模板编译
- 虚拟 DOM

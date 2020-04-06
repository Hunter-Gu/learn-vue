const { resolve } = require('path')

module.exports = {
  base: '/learn-vue/',
  title: 'Vue 源码学习',
  themeConfig: {
    activeHeaderLinks: true,
    sidebarDepth: 2,
    sidebar: [
      // '/',
      ['/observe', '变化监测'],
      ['/watch', '$watch'],
      ['/data-and-props', 'data & props'],
      ['/set-and-delete', '$set & $delete'],
      ['/computed-and-watch', 'computed & watch'],
      ['/template-compiler', '模板编译'],
      ['/virtual-dom', '虚拟 DOM'],
      ['/mount-component', '组件的挂载、更新和销毁'],
      ['/async-queue', '异步更新队列'],
      ['/event', '事件机制'],
      ['/filter', 'filter 的本质'],
      ['/directive', '指令的奥秘'],
      ['/slot', 'slot'],
      // ['/internal-component', '内置组件'],
    ],
    repo: 'Hunter-Gu/learn-vue',
    docsDir: 'docs',
    // editLinks: true,
  },
  plugins: [
    'vuepress-plugin-mermaidjs'
  ],
  configureWebpack: {
    resolve: {
      alias: {
        '@as': resolve(__dirname, './assets'),
        '@imgs': resolve(__dirname, './assets/imgs')
      }
    }
  }
}

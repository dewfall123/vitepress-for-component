## 写 Demo

我们很赞同 [dumi 的 Demo 理念](https://d.umijs.org/zh-CN/guide/demo-principle)，并以它为标准来实现的 demo 功能。

### demo 类型

目前只支持了一种写 demo 的形式。

```md
<demo src="../demo-example.vue"
  language="vue"
  title="Demo演示"
  desc="这是一个Demo渲染示例">
</demo>
```

渲染效果如下
<demo src="../demo-example.vue"
  language="vue"
  title="Demo演示"
  desc="这是一个Demo渲染示例">
</demo>

### demo在线演示
`v0.16.0`开始采用 `https://sfc.vuejs.org/`。

很常见的需求是demo中会需要引入第三方库，此时需要在`.vitepress/config.js`传入 `importMap` 的配置项。

例如: 
```js
// .vitepress/config.js
module.exports = {
  lang: 'zh-CN',
  title: 'vitepress-for-component',
  importMap: {
    'vue-typical': 'https://cdn.jsdelivr.net/npm/vue-typical@2.1.0/dist/vue-typical.es.min.js'
  },
  ...
}
```

`sfc.vuejs.org` 有以下限制:
- 暂不支持 `lang="less"` `lang="ts"` 等需要编译的代码。

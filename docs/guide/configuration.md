# Configuration

在`VitePress`里，`.md`文件的路径决定它的路由。如果我们想把文档和 demo 放在一起，配置`alias`会很麻烦而且复杂。

`vitepress-for-componnet`提供了 root 外`.md`文件映射功能。

假设文档 root 是`docs/`。我们有这样一个文件`packages\vhooks\src\useHover\index.zh-CN.md`。

```
---
map:
  path: /hooks/use-hover
---

## useHover

...
```

它实际会被映射成到`docs/zh/hooks/use-hover/index.md`。也就是说，我们可以把`.md`和源码放在一起，又不影响`vitepress`。

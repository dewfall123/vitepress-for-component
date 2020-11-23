## 文件映射

运行`yarn dev`后可以看到，VFC 会在 docs 目录里面生成一个`.temp`文件，`.temp`是 **当前 root 下所有文件** + **`config.srcIncludes`里面的`.md`文件** 映射结果。

例如`yarn create vlib`生成的`.temp`文件结构如下：

```
.temp
├── components
│   ├── button
│   │   └── index.md
│   └── loading
│       └── index.md
├── en
│   ├── components
│   │   ├── button
│   │   │   └── index.md
│   │   └── loading
│   │       └── index.md
│   └── index.md
├── index.md
└── package.json
```

文件映射规则有两个:

### 1. 根据`map.path`映射

VFC 在启动服务前会根据`config.srcIncludes`(默认`[src]`)的目录，来扫描里面的`.md`文件。识别`.md`文件的`Front Matter`的`map.path`字段，这个 path 就是映射的目标地址。

例如:

`src\loading\index.en-US.md`

```
---
map:
  path: /components/loading
---
...
```

会被映射成`.temp\en\components\loading\index.md`。

如果`src\loading\index.en-US.md`缺少`Front Matter`的`map.path`字段，会以当前路径映射到`.temp`里面，即`.temp\en\components\loading\index.md`。

### 2. locale 后缀映射规则

VFC 会根据 locale 配置生成一个`lang` -> `path`的映射表。

例如模板项目里面的 locale 配置如下：
docs\.vitepress\config.js

```js
{
  lang: 'zh-CN',
  ...
  locales: {
    '/': {
      lang: 'zh-CN',
      ...
    },
    '/en/': {
      lang: 'en-US',
      ...
    }
  }
}
```

会生成这样的一个映射表:

```js
{ 'zh-CN: '/', 'en-US': '/en/', '': '/' }
```

映射例子:

`/comp/foo.zh-CN.md` -> `/comp/foo.md`

`/comp/foo.en-US.md` -> `/en/comp/foo.md`

`/comp/foo.md ->` `/comp/foo.md`

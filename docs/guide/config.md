`VitePress` 配置地址[vitepress-config](https://vitepress.vuejs.org/config/).

新增的配置如下：

## srcIncludes

- 类型：`string[]`
- 默认: `['src']`

配置扫描的文档目录，VFC 会尝试在配置的目录中递归寻找 `.md` 文件，然后映射到文档目录。

## alias

- 类型： `Record<string, string>`
- 默认：`{}`

vite 的 alias。

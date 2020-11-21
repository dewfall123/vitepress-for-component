# vitepress-for-component

## vitepress-for-component 是什么?

Fork 自[`VitePress`](https://github.com/vuejs/vitepress)，针对**组件开发**场景做了一些功能增强和默认样式修改。

:::warning
`vitepress-for-componnet`在`demo`组件设计和页面样式很大程度借鉴了[dumi](https://d.umijs.org/zh-CN/guide)。
:::

## 它做了哪些增强?

### 1. 内置引入`Demo`组件

我们可以在`.md`文件中这样来引入`demo`。

```md
<demo src="./demo.vue"
  language="vue"
  title="Demo演示"
  desc="这是一个Demo渲染示例">
</demo>
```

渲染效果如下
<demo src="./demo.vue"
  language="vue"
  title="Demo演示"
  desc="这是一个Demo渲染示例">
</demo>

### 2. 像 dumi 一样的组织文件

#### 源码与文档放在一起

#### 多语言

`VitePress`支持多语言需要使用如下的文件结构。

```
docs
├─ README.md
├─ foo.md
├─ nested
│  └─ README.md
└─ zh
   ├─ README.md
   ├─ foo.md
   └─ nested
      └─ README.md
```

在看了 [dumi](https://d.umijs.org/zh-CN/guide) 的多语言支持后，我们觉得这样的结构更易读，对比清晰。

```
.
└── docs/
    ├── index.en-US.md # 如果 en-US 为默认 locale，则 index.md 和 index.en-US.md 等价
    ├── index.zh-CN.md
```

### 3. 更合适的默认样式

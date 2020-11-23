## 使用脚手架（推荐）

### 初始化

```
yarn create vlib
```

按照提示输入项目信息后，会看到如下信息：

```
�  Successfully created project test-project.
�  Get started with the following commands:

$ cd test-project
$ yarn dev
```

### 开发

成功初始化后，会有一个简单的模板项目，并且包含一些组件开发常用的功能。

1. `yarn dev`: 热更新的开发服务.
2. `yarn test`: [jest](https://jestjs.io/) 单元测试.
3. `yarn build`: [Rollup](https://www.rollupjs.com/) 打包源码.
4. `yarn docs-build`: 文档打包（SSR）.
5. `docs-static`: 验证文档打包（通过 koa 开启静态文件服务）.
6. `yarn docs-deploy`: 使用 [gh-pages](https://pages.github.com/) 以分支的形式部署到 github.io.
7. `yarn changelog`: 用`conventional-changelog-cli`生成 changelog .
8. `yarn lint` && `yarn ls-lint`: lint 检查.

## 普通使用

像`vitepress`一样使用。

[getting-started](https://vitepress.vuejs.org/guide/getting-started.html).

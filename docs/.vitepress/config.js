const base =
  process.env.NODE_ENV === 'production' ? '/vitepress-for-component' : ''

module.exports = {
  lang: 'zh-CN',
  title: 'vitepress-for-component',
  description: 'Fork自vitepress，针对组件开发做了一些功能增强',

  base,
  importMap: {
    'vue-typical':
      'https://cdn.jsdelivr.net/npm/vue-typical@2.1.0/dist/vue-typical.es.min.js'
  },
  themeConfig: {
    repo: 'dewfall123/vitepress-for-component',
    docsDir: 'docs',

    editLinks: false,
    editLinkText: '在Github上编辑此页面',

    editLinks: false,
    editLinkText: 'Edit this page on GitHub',
    lastUpdated: '最近更新',

    algolia: {
      apiKey: 'c57105e511faa5558547599f120ceeba',
      indexName: 'vitepress'
    },

    nav: [
      { text: '指南', link: '/' },
      {
        text: '更新日志',
        link:
          'https://github.com/dewfall123/vitepress-for-component/blob/master/CHANGELOG.md'
      }
    ],

    sidebar: getGuideSidebar()
  }
}

function getGuideSidebar() {
  return [
    {
      text: '介绍',
      children: [
        { text: '介绍', link: '/' },
        { text: '开始', link: '/guide/getting-started' }
      ]
    },
    {
      text: '用法',
      children: [
        { text: '文件映射', link: '/guide/mapping' },
        { text: '写Demo', link: '/guide/write-demo' },
        { text: '配置', link: '/guide/config' }
      ]
    }
  ]
}

module.exports = {
  lang: 'zh-CN',
  title: 'vitepress-for-component',
  description: 'Fork自vitepress，针对组件开发做了一些功能增强',

  themeConfig: {
    repo: 'vitepress-for-component',
    docsDir: 'docs',

    editLinks: true,
    editLinkText: '在Github上编辑此页面',

    nav: [
      { text: '指南', link: '/' },
      { text: '配置项', link: '/config/' },
      {
        text: '更新日志',
        link:
          'https://github.com/dewfall123/vitepress-for-component/blob/master/CHANGELOG.md'
      }
    ],

    sidebar: {
      '/': getGuideSidebar(),
      '/guide/': getGuideSidebar(),
      '/config/': getConfigSidebar()
    }
  }
}

function getGuideSidebar() {
  return [
    {
      text: '介绍',
      children: [
        { text: '介绍?', link: '/' },
        { text: '快速上手', link: '/guide/getting-started' },
        { text: '配置项', link: '/guide/configuration' },
        { text: 'Customization', link: '/guide/customization' },
        { text: 'Deploying', link: '/guide/deploy' }
      ]
    }
  ]
}

function getConfigSidebar() {
  return [{ text: 'Config Reference', link: '/config/' }]
}

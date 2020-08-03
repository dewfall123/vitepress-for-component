import path from 'path'
import matter from 'gray-matter'
import LRUCache from 'lru-cache'
import {
  createMarkdownRenderer,
  MarkdownOptions,
  DemoComponentData
} from './markdown/markdown'
import { deeplyParseHeader } from './utils/parseHeader'
import { PageData } from '../../types/shared'

const debug = require('debug')('vitepress:md')
const cache = new LRUCache<string, MarkdownCompileResult>({ max: 1024 })

interface MarkdownCompileResult {
  vueSrc: string
  pageData: PageData
}

export function createMarkdownToVueRenderFn(
  root: string,
  options: MarkdownOptions = {}
) {
  const md = createMarkdownRenderer(options)

  return (
    src: string,
    file: string,
    lastUpdated: number,
    injectData = true
  ) => {
    file = path.relative(root, file)
    const cached = cache.get(src)
    if (cached) {
      debug(`[cache hit] ${file}`)
      return cached
    }
    const start = Date.now()

    const { content, data: frontmatter } = matter(src)
    const { html, data } = md.render(content)

    // TODO validate data.links?

    // inject page data
    const pageData: PageData = {
      title: inferTitle(frontmatter, content),
      frontmatter,
      headers: data.headers,
      lastUpdated
    }

    const additionalBlocks = injectData
      ? injectPageData(data.hoistedTags || [], pageData)
      : data.hoistedTags || []

    injectComponentData(additionalBlocks, data.demoSrcs || [])

    const vueSrc =
      additionalBlocks.join('\n') + `\n<template><div>${html}</div></template>`

    debug(`[render] ${file} in ${Date.now() - start}ms.`)

    const result = { vueSrc, pageData }
    console.log(vueSrc)
    cache.set(src, result)
    return result
  }
}

const scriptRE = /<\/script>/

function injectPageData(tags: string[], data: PageData) {
  const code = `\nexport const __pageData = ${JSON.stringify(
    JSON.stringify(data)
  )}`
  const existingScriptIndex = tags.findIndex((tag) => scriptRE.test(tag))
  if (existingScriptIndex > -1) {
    tags[existingScriptIndex] = tags[existingScriptIndex].replace(
      scriptRE,
      code + `</script>`
    )
  } else {
    tags.push(`<script>${code}\nexport default {}</script>`)
  }

  return tags
}

function injectComponentData(tags: string[], demoSrcs: DemoComponentData[]) {
  console.log(demoSrcs)

  const importCode = demoSrcs
    .map((componentData) => {
      return `\n import ${componentData.componentName} from '${componentData.src}'`
    })
    .join(' ')

  const exportCode = `\nexport default {
    components: {
      ${demoSrcs.map((componentData) => componentData.componentName).join(', ')}
    }
  }`

  const existingScriptIndex = tags.findIndex((tag) => scriptRE.test(tag))
  if (existingScriptIndex > -1) {
    tags[existingScriptIndex] = tags[existingScriptIndex].replace(
      `<script>`,
      `<script> ${importCode}`
    )
    tags[existingScriptIndex] = tags[existingScriptIndex].replace(
      scriptRE,
      exportCode + `</script>`
    )
  } else {
    tags.push(`<script>${importCode} ${exportCode}</script>`)
  }

  return tags
}

const inferTitle = (frontmatter: any, content: string) => {
  if (frontmatter.home) {
    return 'Home'
  }
  if (frontmatter.title) {
    return deeplyParseHeader(frontmatter.title)
  }
  const match = content.match(/^\s*#+\s+(.*)/m)
  if (match) {
    return deeplyParseHeader(match[1].trim())
  }
  return ''
}

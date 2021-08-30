import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import LRUCache from 'lru-cache'
import {
  createMarkdownRenderer,
  MarkdownOptions,
  HoistedTags
} from './markdown/markdown'
import { deeplyParseHeader } from './utils/parseHeader'
import { PageData, HeadConfig } from '../../types/shared'
import { slash } from './utils/slash'
import chalk from 'chalk'

const debug = require('debug')('vitepress:md')
export const cache = new LRUCache<string, MarkdownCompileResult>({ max: 1024 })

interface MarkdownCompileResult {
  vueSrc: string
  pageData: PageData
  deadLinks: string[]
}

export function createMarkdownToVueRenderFn(
  root: string,
  options: MarkdownOptions = {},
  pages: string[],
  importMap?: Record<string, string>
) {
  const md = createMarkdownRenderer(root, options)
  pages = pages.map((p) => slash(p.replace(/\.md$/, '')))

  return (src: string, file: string): MarkdownCompileResult => {
    // file is full path
    const relativePath = slash(path.relative(root, file))

    const cached = cache.get(src)
    if (cached) {
      debug(`[cache hit] ${relativePath}`)
      return cached
    }

    const start = Date.now()

    const { content, data: frontmatter } = matter(src)
    md.realPath = frontmatter?.map?.realPath
    md.urlPath = file
    md.importMap = importMap
    let { html, data } = md.render(content)

    // avoid env variables being replaced by vite
    html = html
      .replace(/import\.meta/g, 'import.<wbr/>meta')
      .replace(/process\.env/g, 'process.<wbr/>env')

    // validate data.links
    const deadLinks = []
    if (data.links) {
      const dir = path.dirname(file)
      for (let url of data.links) {
        url = url.replace(/[?#].*$/, '').replace(/\.(html|md)$/, '')
        if (url.endsWith('/')) url += `index`
        const resolved = slash(
          url.startsWith('/')
            ? url.slice(1)
            : path.relative(root, path.resolve(dir, url))
        )
        if (!pages.includes(resolved)) {
          console.warn(
            chalk.yellow(
              `\n(!) Found dead link ${chalk.cyan(
                url
              )} in file ${chalk.white.dim(file)}`
            )
          )
          deadLinks.push(url)
        }
      }
    }

    const pageData: PageData = {
      title: inferTitle(frontmatter, content),
      description: inferDescription(frontmatter),
      frontmatter,
      headers: data.headers,
      relativePath,
      // TODO use git timestamp?
      lastUpdated: Math.round(fs.statSync(file).mtimeMs)
    }

    data.hoistedTags = data.hoistedTags || {}
    data.hoistedTags.script = data.hoistedTags.script || []
    injectComponentData(data.hoistedTags)

    injectPageData(data.hoistedTags, pageData)

    const vueSrc =
      `<script>${(data.hoistedTags.script ?? []).join('\n')}</script>` +
      `<style>${(data.hoistedTags.style ?? []).join('\n')}</style>` +
      `\n<template><div>${html}</div></template>`

    debug(`[render] ${file} in ${Date.now() - start}ms.`)

    const result = {
      vueSrc,
      pageData,
      deadLinks
    }
    cache.set(src, result)
    return result
  }
}

function injectPageData(hoistedTags: HoistedTags, data: PageData) {
  const code = `\nexport const __pageData = ${JSON.stringify(
    JSON.stringify(data)
  )}`

  hoistedTags.script?.push(code)
}

function injectComponentData(hoistedTags: HoistedTags) {
  const exportCode = `\nexport default {
    components: {
      ${(hoistedTags.components || []).join(', ')}
    },
  }
  `

  hoistedTags.script?.push(exportCode)
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

const inferDescription = (frontmatter: Record<string, any>) => {
  const { description, head } = frontmatter

  if (description !== undefined) {
    return description
  }

  return (head && getHeadMetaContent(head, 'description')) || ''
}

const getHeadMetaContent = (
  head: HeadConfig[],
  name: string
): string | undefined => {
  if (!head || !head.length) {
    return undefined
  }

  const meta = head.find(([tag, attrs = {}]) => {
    return tag === 'meta' && attrs.name === name && attrs.content
  })

  return meta && meta[1].content
}

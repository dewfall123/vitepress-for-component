import MarkdownIt from 'markdown-it'
import { MarkdownParsedData } from '../markdown'
import fs from 'fs'
import path from 'path'

// hoist <script> and <style> tags out of the returned html
// so that they can be placed outside as SFC blocks.
export const demoPlugin = (md: MarkdownIt) => {
  const RE = /<demo /i

  md.renderer.rules.html_inline = (tokens, idx) => {
    const content = tokens[idx].content
    const data = (md as any).__data as MarkdownParsedData
    const demoSrcs = data.demoSrcs || (data.demoSrcs = [])

    if (RE.test(content.trim())) {
      const componentName = 'demo1'
      const src = (content.match(/src=("|')(.*)('|")/) || [])[2] ?? ''
      const srcPath = path.resolve(process.cwd(), src)
      if (!src || !fs.existsSync(srcPath)) {
        console.warn(`[vitepress]: ${srcPath} is not exist!`)
        return `<demo src="${src}" >`
      }

      console.log(`srcPath=${srcPath}`)
      const htmlStr = fs.readFileSync(src).toString()
      demoSrcs.push({
        src,
        componentName,
        htmlStr
      })
      return content.replace(
        '>',
        ` componentName="${componentName}" htmlStr="${encodeURIComponent(
          htmlStr
        )}" >
        <${componentName}></${componentName}>
        `
      )
    } else {
      return content
    }
  }
}

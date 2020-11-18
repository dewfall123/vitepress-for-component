import MarkdownIt from 'markdown-it'
import { MarkdownParsedData } from '../markdown'
import fs from 'fs'
import path from 'path'
import { highlight } from './highlight'
// import matter from 'gray-matter'

// interface DemoProps {
//   componentName: string,
//   htmlStr: string,
//   codeStr: string,
//   title?: string,
//   desc?: string,
// }

let index = 1
// hoist <script> and <style> tags out of the returned html
// so that they can be placed outside as SFC blocks.
export const demoPlugin = (md: MarkdownIt) => {
  const RE = /<demo /i

  md.renderer.rules.html_inline = (tokens, idx) => {
    const content = tokens[idx].content
    const data = (md as any).__data as MarkdownParsedData
    const hoistedTags =
      data.hoistedTags ||
      (data.hoistedTags = {
        script: [],
        style: [],
        components: []
      })

    if (RE.test(content.trim())) {
      const componentName = `demo${index++}`
      let language = (content.match(/language=("|')(.*)('|")/) || [])[2] ?? ''
      const src = (content.match(/src=("|')(\S+)('|")/) || [])[2] ?? ''
      const realPath = (md as any).realPath
      const srcFilePath = path.join(realPath, '../', src)
      const importPath = '/@' + srcFilePath.split(path.sep).join('/')
      if (!src || !fs.existsSync(srcFilePath)) {
        const warningMsg = `${srcFilePath} does not exist!`
        console.warn(`[vitepress]: ${warningMsg}`)
        return `<demo src="${importPath}" >
        <p>${warningMsg}</p>`
      }
      if (!language) {
        language = (importPath.match(/\.(.+)$/) || [])[1] ?? 'vue'
      }

      const codeStr = fs.readFileSync(srcFilePath).toString()
      // const { content: codeContent, data: frontmatter } = matter(codeStr)
      const htmlStr = encodeURIComponent(highlight(codeStr, language))

      hoistedTags.script!.unshift(
        `import ${componentName} from '${importPath}' \n`
      )
      hoistedTags.components!.push(componentName)

      return content.replace(
        '>',
        ` componentName="${componentName}" htmlStr="${htmlStr}" codeStr="${encodeURIComponent(
          codeStr
        )}" >
        <${componentName}></${componentName}>
        `
      )
    } else {
      return content
    }
  }
}

import MarkdownIt from 'markdown-it'
import { MarkdownParsedData } from '../markdown'

// hoist <script> and <style> tags out of the returned html
// so that they can be placed outside as SFC blocks.
export const hoistPlugin = (md: MarkdownIt) => {
  const RE = /^<(script|style)(?=(\s|>|$))/i

  md.renderer.rules.html_block = (tokens, idx) => {
    const content = tokens[idx].content
    const data = (md as any).__data as MarkdownParsedData
    const hoistedTags =
      data.hoistedTags ||
      (data.hoistedTags = {
        script: [],
        style: [],
        components: []
      })
    const hoistTag = (content.match(RE) || [])[1]
    if (hoistTag) {
      const tag = hoistTag.toLocaleLowerCase() as 'script' | 'style'
      hoistedTags[tag] = hoistedTags[tag] || []
      hoistedTags[tag]?.push(
        content.replace(/^<(script|style)(?=(\s|>|$))/gi, '')
      )
      return ''
    } else {
      return content
    }
  }
}

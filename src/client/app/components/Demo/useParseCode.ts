import { reactive, computed, toRefs } from 'vue'

import { JS_RE, CSS_RE, HTML_RE } from './OnlineEdit/constants'
import { getMatchedResult, parseAndDecode } from './OnlineEdit/utils'

export function useParseCode(
  decodedCodeStr: string,
  jsLibsStr: string,
  cssLibsStr: string
) {
  const state = reactive({
    expand: false
  })

  const toggleExpand = () => (state.expand = !state.expand)

  const parsedCode = computed(() => {
    const js = getMatchedResult(JS_RE)(decodedCodeStr) || ''
    const css = getMatchedResult(CSS_RE)(decodedCodeStr) || ''
    const html =
      getMatchedResult(HTML_RE)(decodedCodeStr) ||
      decodedCodeStr
        .replace(JS_RE, '')
        .replace(CSS_RE, '')
        .replace(HTML_RE, '')
        .trim()

    const jsLibs = parseAndDecode(jsLibsStr)
    const cssLibs = parseAndDecode(cssLibsStr)

    return { js, css, html, jsLibs, cssLibs }
  })

  return {
    ...toRefs(state),
    toggleExpand,
    parsedCode
  }
}

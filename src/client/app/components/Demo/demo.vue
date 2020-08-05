<template>
  <article class="demo">
    <div class="demo-slot">
      <slot></slot>
    </div>

    <div class="demo-actions">
      <div class="demo-platforms">
        <OnlineEdit
          v-for="platform in platforms"
          :key="platform"
          v-bind="parsedCode"
          :platform="platform"
        />
      </div>
      <div class="demo-buttons">
        <copySvg
          class="demo-actions-copy"
          @click="toggleExpand()"
          title="复制"
        />
        <codeSvg
          class="demo-actions-expand"
          @click="toggleExpand()"
          title="展开"
        />
      </div>
    </div>
    <div
      v-show="state.expand"
      v-html="decodedHtmlStr"
      :class="`language-${language} extra-class`"
    />
  </article>
</template>

<script lang="ts">
import { reactive, computed } from 'vue'
import './demo.css'
import copySvg from './icons/copy.vue'
import codeSvg from './icons/code.vue'
import OnlineEdit from './OnlineEdit'
import { JS_RE, CSS_RE, HTML_RE } from './OnlineEdit/constants'
import { getMatchedResult, parseAndDecode } from './OnlineEdit/utils'

export default {
  props: {
    componentName: String,
    htmlStr: String,
    codeStr: String,
    language: { default: 'vue', type: String },
    platforms: {
      default: () => ['codepen'],
      type: Array
    },
    jsLibsStr: { type: String, default: '[]' },
    cssLibsStr: { type: String, default: '[]' },
    codesandboxStr: { type: String, default: '{}' }
  },
  components: {
    copySvg,
    codeSvg,
    OnlineEdit
  },
  setup(props) {
    const state = reactive({
      expand: false
    })

    const toggleExpand = () => (state.expand = !state.expand)

    const decodedHtmlStr = computed(() => decodeURIComponent(props.htmlStr))
    const decodedCodeStr = computed(() => decodeURIComponent(props.codeStr))

    const parsedCode = computed(() => {
      const js = getMatchedResult(JS_RE)(decodedCodeStr.value) || ''
      const css = getMatchedResult(CSS_RE)(decodedCodeStr.value) || ''
      const html =
        getMatchedResult(HTML_RE)(decodedCodeStr.value) ||
        decodedCodeStr.value
          .replace(JS_RE, '')
          .replace(CSS_RE, '')
          .replace(HTML_RE, '')
          .trim()

      const jsLibs = parseAndDecode(props.jsLibsStr)
      const cssLibs = parseAndDecode(props.cssLibsStr)
      const codesandboxOptions = parseAndDecode(props.codesandboxStr)

      return { js, css, html, jsLibs, cssLibs, codesandboxOptions }
    })

    return {
      state,
      toggleExpand,
      decodedHtmlStr,
      parsedCode
    }
  }
}
</script>

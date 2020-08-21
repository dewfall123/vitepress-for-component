<template>
  <form
    class="demo-and-code-online-edit-wrapper"
    target="_blank"
    :action="actionUrl"
    method="post"
  >
    <!-- https://blog.codepen.io/documentation/api/prefill/ -->
    <template v-if="platform === 'codepen'">
      <input type="hidden" name="data" :value="codepenValue" />
    </template>

    <button type="submit" :data-tip="platformTip">
      <component :is="platform" />
    </button>
  </form>
</template>

<script lang="ts">
import codepen from './icons/CodepenIcon.vue'
import jsfiddle from './icons/JsfiddleIcon.vue'
import codesandbox from './icons/CodeSandboxIcon.vue'
import { getJsTmpl, getHtmlTmpl } from './utils'
import { PLATFORMS, ACTION_MAP, PLATFORM_TIP_MAP } from './constants'
import './onlineEdit.css'

const vueJs = 'https://unpkg.com/vue@3.0.0-beta.14/dist/vue.global.js'

export default {
  name: 'OnlineEdit',
  components: {
    codepen,
    jsfiddle,
    codesandbox
  },
  props: {
    platform: {
      type: String,
      required: true,
      validator: (val: string) => PLATFORMS.indexOf(val) !== -1
    },
    js: { type: String, default: '' },
    css: { type: String, default: '' },
    html: { type: String, default: '' },
    jsPre: { type: String, default: 'babel' },
    layout: { type: String, default: 'left' },
    jsLibs: { type: Array, default: () => [] },
    cssLibs: { type: Array, default: () => [] },
    editors: { type: String, default: '101' }
  },
  computed: {
    jsTmpl: (vm) => getJsTmpl(vm.js),
    htmlTmpl: (vm) => getHtmlTmpl(vm.html),
    actionUrl: (vm) => ACTION_MAP[vm.platform],
    resources: (vm) => vm.jsLibsWithVue.concat(vm.cssLibs).join(','),
    js_external: (vm) => vm.jsLibsWithVue.join(';'),
    platformTip: (vm) => PLATFORM_TIP_MAP[vm.platform],
    css_external: (vm) => vm.cssLibs.join(';'),
    jsLibsWithVue: (vm) => vm.jsLibs.concat(vueJs),
    codepenValue: (vm) =>
      JSON.stringify({
        js: vm.jsTmpl,
        css: vm.css,
        html: vm.htmlTmpl,
        layout: vm.layout,
        editors: vm.editors,
        js_external: vm.js_external,
        css_external: vm.css_external,
        js_pre_processor: vm.jsPre
      })
  }
}
</script>

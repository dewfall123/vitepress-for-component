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
          title="展开123"
        />
      </div>
    </div>
    <div
      v-show="state.expand"
      v-html="decodeURIComponent(htmlStr)"
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

export default {
  props: {
    componentName: String,
    htmlStr: String,
    language: { default: 'vue', type: String },
    platforms: {
      default: () => ['codepen', 'jsfiddle', 'codesandbox'],
      type: Array
    }
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

    // const copy = () =>

    return {
      state,
      toggleExpand
    }
  }
}
</script>

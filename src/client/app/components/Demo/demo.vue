<template>
  <article class="demo">
    <div class="demo-slot">
      <slot></slot>
    </div>

    <div class="demo-actions">
      <div class="demo-platforms"></div>
      <div>
        <span class="demo-actions-copy" @click="toggleExpand()" title="复制">
          <copySvg />
        </span>
        <span class="demo-actions-expand" @click="toggleExpand()" title="展开">
          <codeSvg />
        </span>
      </div>
    </div>
    <div v-show="state.expand" class="language-vue">
      {{ decodeURIComponent(htmlStr) }}
    </div>
  </article>
</template>

<script lang="ts">
import { reactive } from 'vue'
import './demo.css'
import copySvg from './icons/copy.vue'
import codeSvg from './icons/code.vue'

export default {
  props: {
    componentName: String,
    htmlStr: String
  },
  components: {
    copySvg,
    codeSvg,
  },
  setup() {
    const state = reactive({
      expand: false
    })

    const toggleExpand = () => (state.expand = !state.expand)

    // const copy = () => 

    return {
      state,
      toggleExpand,
    }
  },
}
</script>

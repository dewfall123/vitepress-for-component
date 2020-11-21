<template>
  <div class="page">
    <slot name="top" />

    <div class="content">
      <Content />
    </div>

    <EditLink />
    <NextAndPrevLinks />

    <slot name="bottom" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import EditLink from './EditLink.vue'
import NextAndPrevLinks from './NextAndPrevLinks.vue'

export default defineComponent({
  components: {
    EditLink,
    NextAndPrevLinks
  }
})
</script>

<style scoped>
.page {
  margin: 0 auto;
  margin-right: var(--slug-width);
  padding: 0.025rem 2.5rem 2rem;
  /* max-width: 50rem; */
  width: calc(100% - var(--slug-width));
}

.content {
  padding-bottom: 1.5rem;
}
</style>

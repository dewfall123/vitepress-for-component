<template>
  <main class="page">
    <div class="container hover-scrollbar">
      <slot name="top" />

      <div class="content">
        <Content />
      </div>

      <PageFooter />

      <NextAndPrevLinks />

      <slot name="bottom" />
    </div>
  </main>
</template>

<script setup lang="ts">
import PageFooter from './PageFooter.vue'
import NextAndPrevLinks from './NextAndPrevLinks.vue'
</script>

<style scoped>
.page {
  padding-top: var(--header-height);
}

@media (min-width: 720px) {
  .page {
    margin-left: 16.4rem;
  }
}

@media (min-width: 960px) {
  .page {
    margin-left: 20rem;
  }
}

.container {
  margin: 0 auto;
  margin-right: var(--slug-width);
  padding: 0.025rem 2.5rem 2rem;
  /* max-width: 50rem; */
  width: calc(100% - var(--slug-width));
  height: 100%;
}

@media (max-width: 900px) {
  .container {
    margin-right: 0;
    width: 100%;
  }
}

.content {
  padding-bottom: 1.5rem;
}

@media (max-width: 420px) {
  .content {
    /* fix carbon ads display */
    clear: both;
  }
}
</style>

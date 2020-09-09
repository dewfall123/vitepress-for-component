<template>
  <div class="content">
    <Content />
    <NextAndPrevLinks />
  </div>
</template>

<script>
import NextAndPrevLinks from './NextAndPrevLinks.vue'
export default {
  components:{ NextAndPrevLinks }
}
</script>

<style>
.content {
  margin: 0 auto;
  margin-right: var(--slug-width);
  padding: 0.025rem 2.5rem 2rem;
  /* max-width: 50rem; */
  width: calc(100% - var(--slug-width));
}

.content a {
  color: var(--accent-color);
}

.content a:hover {
  text-decoration: underline;
}

.content img {
  max-width: 100%;
}
/*
.content div > h1:first-child, .content div > h2:first-child {
  margin-top: 0;
} */
</style>

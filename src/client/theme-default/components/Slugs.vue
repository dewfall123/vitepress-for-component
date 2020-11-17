<template>
  <ul class="right-slug">
    <li
      v-for="{ level, link, title } of slugs"
      :class="`slug-item level-${level}`"
    >
      <a :href="link" class="link">
        {{ title }}
      </a>
    </li>
  </ul>
</template>

<script lang="ts" src="./Slugs"></script>

<style scoped>
.slug-item {
  list-style: none;
  font-size: 14px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  padding: 4px 0 4px 16px;
  margin: 0;
  border-left: 2px solid #ebedf1;
}

.level-2 {
  font-size: 13px;
  padding-left: 28px;
}

.link {
  color: var(--text-color);
}
</style>

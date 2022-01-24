<template>
  <aside class="sidebar hover-scrollbar" :class="{ open }">
    <NavLinks class="nav" />

    <slot name="sidebar-top" />

    <SideBarLinks />

    <slot name="sidebar-bottom" />
  </aside>
  <Slugs />
</template>

<script setup lang="ts">
import NavLinks from './NavLinks.vue'
import SideBarLinks from './SideBarLinks.vue'
import Slugs from './Slugs.vue'

defineProps({
  open: { type: Boolean, required: true }
})
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: var(--header-height);
  bottom: 0;
  left: 0;
  z-index: var(--z-index-sidebar);
  border-right: 1px solid var(--c-divider);
  width: 16.4rem;
  background-color: var(--c-bg);
  overflow-y: auto;
  transform: translateX(-100%);
  transition: transform 0.25s ease;
}

@media (min-width: 720px) {
  .sidebar {
    transform: translateX(0);
  }
}

@media (min-width: 960px) {
  .sidebar {
    width: 20rem;
  }
}

.sidebar.open {
  transform: translateX(0);
}

.nav {
  display: block;
  margin: 0;
  border-left: 0.25rem solid transparent;
  padding: 0.35rem 1.5rem 0.35rem 1.25rem;
  line-height: 1.7;
  font-size: 1.05em;
  font-weight: 500;
  color: var(--text-color);
}

a.sidebar-link {
  transition: color 0.15s ease;
}

@media (min-width: 720px) {
  .nav {
    display: none;
  }
}

.sidebar-right {
  position: fixed;
  right: 0;
}
</style>

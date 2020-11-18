import { useRoute } from 'vitepress'
import { computed } from 'vue'

export default {
  setup() {
    const route = useRoute()
    const slugs = computed(() => {
      // only display two level
      const headers = route.data.headers ?? []
      let minLevel = 10
      for (const { level } of headers) {
        minLevel > level && (minLevel = level)
      }

      return headers
        .filter((h) => h.level < minLevel + 2)
        .map((h) => ({
          ...h,
          link: `#${h.slug}`,
          level: h.level === minLevel ? 1 : 2
        }))
    })

    return {
      slugs
    }
  }
}

import { useRoute, useSiteData } from 'vitepress'
import { FunctionalComponent, h, VNode } from 'vue'
import { Header } from '../../../../types/shared'
import { joinUrl, isActive } from '../utils'
import { ResolvedSidebarItem } from './SideBar'

export const SideBarItem: FunctionalComponent<{
  item: ResolvedSidebarItem
}> = (props) => {
  const {
    item: { link: relLink, text, children }
  } = props

  const route = useRoute()
  const siteData = useSiteData()

  const link = resolveLink(siteData.value.base, relLink || '')
  const active = isActive(route, link)
  const headers = route.data.headers
  const childItems = createChildren(active, children, headers)

  return h('li', { class: 'sidebar-item' }, [
    h(
      link ? 'a' : 'p',
      {
        class: { 'sidebar-link': true, active },
        href: link
      },
      text
    ),
    childItems
  ])
}

function resolveLink(base: string, path: string): string | undefined {
  return path
    ? // keep relative hash to the same page
      path.startsWith('#')
      ? path
      : joinUrl(base, path)
    : undefined
}

function createChildren(
  active: boolean,
  children?: ResolvedSidebarItem[],
  headers?: Header[]
): VNode | null {
  if (children && children.length > 0) {
    return h(
      'ul',
      { class: 'sidebar-items' },
      children.map((c) => {
        return h(SideBarItem, { item: c })
      })
    )
  }

  return null
}

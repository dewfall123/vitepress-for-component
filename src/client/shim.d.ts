declare const __VP_HASH_MAP__: Record<string, string>

declare module '*.vue' {
  import { ComponentOptions } from 'vue'
  const comp: ComponentOptions
  export default comp
}

declare module '@siteData' {
  const data: string
  export default data
}

declare module 'prismjs'
declare module 'escape-html'
declare module 'prismjs/components/index'
declare module 'codesandbox-import-utils/lib/api/define'

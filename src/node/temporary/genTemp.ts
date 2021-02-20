import fsExtra from 'fs-extra'
import { resolveConfig, ServeOptions } from '../index'
import { LocaleConfig } from '/@types/shared'
import { copyAndWatchRoot, copyAndWatchSrc } from './copy'
import { join } from 'path'

export const TempFileName = '.temp'
export const DefaultSrcIncludes = ['src']

// generate a .temp dir
export async function genTemporary(options: ServeOptions = {}, watch: boolean) {
  const root = options.root!
  const config = await resolveConfig(join(root, '..'))
  const userConfig = config.userConfig
  const langToPathMapping = getLangToPathMapping(
    userConfig.locales ?? userConfig.themeConfig?.locales,
    config.userConfig.lang
  )

  const {
    userConfig: { srcIncludes: srcIncludes = DefaultSrcIncludes }
  } = config

  await fsExtra.remove(root)
  await fsExtra.ensureDir(root)

  await Promise.all([
    copyAndWatchRoot(root, langToPathMapping, watch),
    copyAndWatchSrc(root, srcIncludes, langToPathMapping, watch)
  ])

  console.log('copy to .temp success.')
}

// resolve a mapping from localeConfig
// like { 'zh-CN: '/', 'en-US': '/en/', '': '/' }
function getLangToPathMapping(
  locale: Record<string, LocaleConfig> | undefined,
  lang: string | undefined
) {
  if (!locale) {
    return null
  }
  const mapping = Object.entries(locale).reduce((map, [path, localeConfig]) => {
    map[localeConfig.lang] = path.slice(1)
    return map
  }, {} as Record<string, string>)

  // ensure default lang
  let defaultLangPrefix
  if (lang && mapping[lang]) {
    defaultLangPrefix = mapping[lang]
  } else {
    defaultLangPrefix = Object.values(mapping)[0]
  }
  mapping[''] = defaultLangPrefix

  return mapping
}

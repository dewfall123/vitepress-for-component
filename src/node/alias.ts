import path from 'path'
import { Alias, AliasOptions } from 'vite'
import { UserConfig } from './config'
import { DefaultSrcIncludes } from './temporary/genTemp'
import { clearSuffix } from './utils/parseHeader'

const PKG_ROOT = path.join(__dirname, '../../')
export const APP_PATH = path.join(__dirname, '../client/app')
export const SHARED_PATH = path.join(__dirname, '../client/shared')
export const DEFAULT_THEME_PATH = path.join(
  __dirname,
  '../client/theme-default'
)

// special virtual file
// we can't directly import '/@siteData' because
// - it's not an actual file so we can't use tsconfig paths to redirect it
// - TS doesn't allow shimming a module that starts with '/'
export const SITE_DATA_ID = '@siteData'
export const SITE_DATA_REQUEST_PATH = '/' + SITE_DATA_ID

export function resolveAliases(
  root: string,
  themeDir: string,
  userConfig: UserConfig
): AliasOptions {
  const srcIncludes = userConfig.srcIncludes ?? DefaultSrcIncludes
  const srcAlias = srcIncludes.reduce((map, src) => {
    map[`/@${clearSuffix(src)}/`] = path.resolve(src)
    return map
  }, {} as Record<string, string>)

  const paths: Record<string, string> = {
    ...userConfig.alias,
    ...srcAlias,
    '/@theme': themeDir,
    '/@shared': SHARED_PATH,
    [SITE_DATA_ID]: SITE_DATA_REQUEST_PATH
  }

  const aliases: Alias[] = [
    ...Object.keys(paths).map((p) => ({
      find: p,
      replacement: paths[p]
    })),
    {
      find: /^vitepress$/,
      replacement: path.join(__dirname, '../client/index')
    },
    {
      find: /^vitepress\/theme$/,
      replacement: path.join(__dirname, '../client/theme-default/index')
    },
    // alias for local linked development
    { find: /^vitepress\//, replacement: PKG_ROOT + '/' },
    // make sure it always use the same vue dependency that comes with
    // vitepress itself
    {
      find: /^vue$/,
      replacement: require.resolve(
        '@vue/runtime-dom/dist/runtime-dom.esm-bundler.js'
      )
    }
  ]

  return aliases
}

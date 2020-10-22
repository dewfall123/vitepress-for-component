import fs from 'fs-extra'
import { bundle, LangToPrefix } from './bundle'
import { BuildConfig as ViteBuildOptions } from 'vite'
import { resolveConfig, resolveUserConfig } from '../config'
import { renderPage } from './render'
import { OutputChunk, OutputAsset } from 'rollup'

export type BuildOptions = Pick<
  ViteBuildOptions,
  | 'root'
  | 'rollupInputOptions'
  | 'rollupOutputOptions'
  | 'rollupPluginVueOptions'
>

export async function build(buildOptions: BuildOptions = {}) {
  process.env.NODE_ENV = 'production'
  const siteConfig = await resolveConfig(buildOptions.root)
  const userConfig = await resolveUserConfig(siteConfig.root)
  const userAlias = userConfig.alias ?? {}
  // locale configs
  const localeConfigs = userConfig.themeConfig.locales ?? {}
  const langToPrefix = Object.entries(localeConfigs).reduce(
    (map, [key, { lang }]: any) => {
      map[lang] = key
      return map
    },
    {} as LangToPrefix
  )

  try {
    const [clientResult, , pageToHashMap] = await bundle(
      siteConfig,
      buildOptions,
      langToPrefix,
      userAlias
    )
    console.log('rendering pages...')

    const appChunk = clientResult.assets.find(
      (chunk) =>
        chunk.type === 'chunk' && chunk.fileName.match(/^app\.\w+\.js$/)
    ) as OutputChunk

    const cssChunk = clientResult.assets.find(
      (chunk) => chunk.type === 'asset' && chunk.fileName.endsWith('.css')
    ) as OutputAsset

    // We embed the hash map string into each page directly so that it doesn't
    // alter the main chunk's hash on every build. It's also embedded as a
    // string and JSON.parsed from the client because it's faster than embedding
    // as JS object literal.
    const hashMapStirng = JSON.stringify(JSON.stringify(pageToHashMap))

    for (const page of siteConfig.pages) {
      try {
        await renderPage(
          siteConfig,
          page,
          clientResult,
          appChunk,
          cssChunk,
          pageToHashMap,
          hashMapStirng,
          langToPrefix,
          userAlias
        )
      } catch (err) {
        console.log(err)
      }
    }
  } finally {
    await fs.remove(siteConfig.tempDir)
  }
  console.log('done.')
}

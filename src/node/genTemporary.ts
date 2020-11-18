import globby from 'globby'
import fsExtra from 'fs-extra'
import { cachedRead, ServerConfig } from 'vite'
import { basename, extname, join } from 'path'
import { resolveConfig } from './'
import matter from 'gray-matter'
import { clearSuffix } from './utils/parseHeader'
import { LocaleConfig } from '/@types/shared'

export const TempFileName = '.temp'
export const DefaultSrcIncludes = ['src']

// generate a .temp dir
export async function genTemporary(options: ServerConfig = {}) {
  const root = options.root ?? process.cwd()
  const realRoot = join(root, TempFileName)
  const config = await resolveConfig(root)
  const userConfig = config.userConfig
  const langToPathMapping = getLangToPathMapping(
    userConfig.locales ?? userConfig.themeConfig?.locales,
    config.userConfig.lang
  )

  const {
    userConfig: { srcIncludes: srcIncludes = DefaultSrcIncludes }
  } = config

  await fsExtra.remove(realRoot)
  await fsExtra.ensureDir(realRoot)

  await Promise.all([
    copyDocs(root, langToPathMapping),
    copySrc(root, srcIncludes, langToPathMapping)
  ])
}

// copy all file at root to .temp dir
async function copyDocs(
  root: string,
  langToPathMapping: Record<string, string> | null
) {
  const files = await globby([`**`, `!${TempFileName}`], {
    dot: true,
    cwd: root
  })
  files.forEach((file) => {
    const descFile = join(
      root,
      TempFileName,
      tolocalePath(langToPathMapping, file)
    )
    console.log(file + ' -> ' + descFile)
    fsExtra.copy(join(root, file), descFile)
  })
}

// copy userConfig.includes (default to ['src']) *.md to .temp
// dest file is frontmatter.map?.path or real path at .temp
async function copySrc(
  root: string,
  srcIncludes: string[],
  langToPathMapping: Record<string, string> | null
) {
  const srcPaths = srcIncludes.map((src) => `${clearSuffix(src)}/**/*.md`)
  const files = await globby(srcPaths, {
    dot: true,
    cwd: process.cwd(),
    ignore: ['node_modules', '**/node_modules']
  })

  await Promise.all(
    files.map(async (file) => {
      const fileBuffer = await cachedRead(null, file)
      const { data: frontmatter, content } = matter(fileBuffer)

      const fileName = basename(file)
      let destPath = file
      if (frontmatter.map?.path) {
        destPath = frontmatter.map?.path
        // maybe path includes fileName
        if (!destPath.endsWith(fileName)) {
          destPath = join(destPath, fileName)
        }
      }
      frontmatter.map = {
        ...frontmatter.map,
        realPath: file
      }
      const destFile = join(
        root,
        TempFileName,
        tolocalePath(langToPathMapping, destPath)
      )

      console.log(destFile)

      await fsExtra.ensureFile(destFile)
      await fsExtra.writeFile(destFile, matter.stringify(content, frontmatter))
    })
  )
  console.log('copy done.')
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
  console.log(mapping)
  return mapping
}

// resolve /comp/foo.zh-CN.md -> /zh/comp/foo.md
function tolocalePath(mapping: Record<string, string> | null, path: string) {
  if (!mapping) {
    return path
  }
  const fileName = basename(path)
  const ext = extname(fileName)
  console.log('fileName = ' + fileName)
  console.log('ext = ' + ext)
  // .zh-CN
  const lang = extname(fileName.slice(0, -ext.length))
  console.log('lang = ' + lang)
  const langPrefix = mapping[lang.slice(1)]
  console.log(`${langPrefix}${path.slice(0, -(ext + lang).length)}${ext}`)
  console.log('\n')
  return `${langPrefix}${path.slice(0, -(ext + lang).length)}${ext}`
}

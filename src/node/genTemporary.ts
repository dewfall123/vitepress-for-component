import globby from 'globby'
import fsExtra from 'fs-extra'
import { cachedRead, ServerConfig } from 'vite'
import { basename, join } from 'path'
import { resolveConfig } from './'
import matter from 'gray-matter'
import { clearSuffix } from './utils/parseHeader'

export const TempFileName = '.temp'
export const DefaultSrcIncludes = ['src']

export async function genTemporary(options: ServerConfig = {}) {
  const root = options.root ?? process.cwd()
  const realRoot = join(root, TempFileName)
  const config = await resolveConfig(root)
  const {
    userConfig: { srcIncludes: srcIncludes = DefaultSrcIncludes }
  } = config

  await fsExtra.remove(realRoot)
  await fsExtra.ensureDir(realRoot)

  await Promise.all([copyDocs(root), copySrc(root, srcIncludes)])
}

// copy all file at root to .temp dir
async function copyDocs(root: string) {
  const files = await globby([`**`, `!${TempFileName}`], {
    dot: true,
    cwd: root
  })
  files.forEach((file) => {
    fsExtra.copy(join(root, file), join(root, TempFileName, file))
  })
}

// copy userConfig.includes (default to ['src']) *.md to .temp
// dest file is frontmatter.map?.path or real path at .temp
async function copySrc(root: string, srcIncludes: string[]) {
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
      const destFile = join(root, TempFileName, destPath)

      await fsExtra.ensureFile(destFile)
      await fsExtra.writeFile(destFile, matter.stringify(content, frontmatter))
    })
  )
  console.log('copy done.')
}

import Koa from 'koa'
import StaticServer from 'koa-static-server'
import { resolveConfig } from '../config'

export interface ServeOptions {
  root?: string
  port?: number
}

export async function serve(options: ServeOptions = {}) {
  const port = options.port !== undefined ? options.port : 3000
  const site = await resolveConfig(options.root!)

  const app = new Koa()

  app.use(
    StaticServer({
      rootDir: site.outDir,
      rootPath: site.userConfig.base
    })
  )

  app.use(async (ctx) => {
    ctx.redirect(site.userConfig.base ?? '/')
  })

  app.listen(port)

  console.log(`listening at http://localhost:${port}`)
}

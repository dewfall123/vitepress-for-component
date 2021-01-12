import sirv from 'sirv'
import compression from 'compression'
import { resolveConfig } from '../config'

export interface ServeOptions {
  root?: string
  port?: number
}

export async function serve(options: ServeOptions = {}) {
  const port = options.port !== undefined ? options.port : 5000
  const site = await resolveConfig(options.root!)
  let base = site.userConfig.base ?? ''

  const compress = compression()
  const serve = sirv(site.outDir, {
    etag: true,
    single: true,
    maxAge: 31536000,
    immutable: true,
    setHeaders(res, pathname) {
      if (!pathname.includes(`${base}/assets/`)) {
        // force server validation for non-asset files since they are not
        // fingerprinted.
        res.setHeader('cache-control', 'no-cache')
      }
    }
  })

  require('polka')()
    .use(...(base ? [base, compress, serve] : [compress, serve]))
    .listen(port, (err: any) => {
      if (err) throw err
      console.log(`Built site served at http://localhost:${port}${base}/.\n`)
    })
}

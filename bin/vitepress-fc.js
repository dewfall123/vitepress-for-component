#!/usr/bin/env node
const chalk = require('chalk')
const argv = require('minimist')(process.argv.slice(2))
const portfinder = require('portfinder')
const path = require('path')
const {
  createServer,
  genTemporary,
  build,
  TempFileName
} = require('../dist/node')

console.log(chalk.green('[vitepress-dg] forked from vitepress~'))

console.log(chalk.cyan(`vitepress v${require('../package.json').version}`))
console.log(chalk.cyan(`vite v${require('vite/package.json').version}`))

const command = argv._[0]
const root = argv._[command ? 1 : 0]
argv.root = path.join(root ?? argv.root ?? process.cwd(), TempFileName)
console.log('root = ' + argv.root)

async function run() {
  await genTemporary(argv)
  if (!command || command === 'dev') {
    createServer(argv)
      .then(async (server) => {
        portfinder.basePort = parseInt(argv.port) || 3000
        const port = await portfinder.getPortPromise()
        server.listen(port, () => {
          console.log(`listening at http://localhost:${port}`)
        })
      })
      .catch((err) => {
        console.error(chalk.red(`failed to start server. error:\n`), err)
      })
  } else if (command === 'build') {
    build(argv).catch((err) => {
      console.error(chalk.red(`build error:\n`), err)
    })
  } else if (command === 'serve') {
    require('../dist/node')
      .serve(argv)
      .catch((err) => {
        console.error(chalk.red(`failed to start server. error:\n`), err)
        process.exit(1)
      })
  } else {
    console.log(chalk.red(`unknown command "${command}".`))
    process.exit(1)
  }
}

run()

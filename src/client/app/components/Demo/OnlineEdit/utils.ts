import { CODE_SANDBOX_JS, CODE_SANDBOX_HTML } from './constants'

export const getJsTmpl = (js: string) => {
  const vueAttrs = js
    .replace(/export\s+default\s*?\{\n*/, '')
    .replace(/\n*\}\s*$/, '')
    .trim()

  return `new Vue({\n\tel: '#app', \n\t${vueAttrs}\n})`
}

export const getHtmlTmpl = (html: string) =>
  `<div id="app">\n\n${html}\n\n</div>`

export const getMatchedResult = (re: RegExp) => (str: string) => {
  const matched = str.match(re)

  return matched && matched[1].trim()
}

const urlToHtmlTag = (type: string) => (url: string) =>
  type === 'js'
    ? `<script src="${url}"></script>\n`
    : type === 'css'
    ? `<link rel="stylesheet" href="${url}">\n`
    : 'Error type: js | css'

function compress(input: string) {
  return window
    .btoa(input)
    .replace(/\+/g, '-') // Convert '+' to '-'
    .replace(/\//g, '_') // Convert '/' to '_'
    .replace(/=+$/, '') // Remove ending '='
}
function getParameters(parameters: any) {
  return compress(JSON.stringify(parameters))
}

export const getCodeSandboxTmpl = ({
  js,
  css,
  html,
  deps,
  jsLibs,
  cssLibs
}: any) =>
  getParameters({
    files: {
      'index.js': { content: CODE_SANDBOX_JS },
      'App.vue': {
        content:
          `<template>\n\n${html}\n\n</template>\n\n` +
          `<script>\n${js}\n</script>\n\n` +
          `<style>\n${css}\n</style>\n`
      },
      'index.html': {
        content:
          cssLibs.map(urlToHtmlTag('css')) +
          jsLibs.map(urlToHtmlTag('js')) +
          CODE_SANDBOX_HTML
      },
      'package.json': {
        content: {
          dependencies: Object.assign({ vue: 'latest' }, deps)
        }
      }
    }
  })

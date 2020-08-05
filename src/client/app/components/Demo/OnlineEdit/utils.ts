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

export const parseAndDecode = (str: string) =>
  JSON.parse(decodeURIComponent(str))

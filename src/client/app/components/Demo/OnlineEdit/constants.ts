export const JS_RE = /<script.*>([\s\S]+)<\/script>/
export const CSS_RE = /<style>([\s\S]+)<\/style>/
export const HTML_RE = /<template>([\s\S]+)<\/template>/

export const PLATFORMS = ['codepen', 'jsfiddle']

export const ACTION_MAP = {
  codepen: 'https://codepen.io/pen/define',
  jsfiddle: 'https://jsfiddle.net/api/post/library/pure',
  codesandbox: 'https://codesandbox.io/api/v1/sandboxes/define'
}

export const PLATFORM_TIP_MAP = {
  codepen: 'Codepen',
  jsfiddle: 'JSFiddle',
  codesandbox: 'CodeSandbox'
}

export const CODE_SANDBOX_JS = `
import Vue from 'vue'
import App from './App.vue'

new Vue({
    el: '#app',
    template: '<App/>',
    components: { App },
})`

export const CODE_SANDBOX_HTML = '\n<div id="app"></div>'

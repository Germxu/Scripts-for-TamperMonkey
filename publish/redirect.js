// ==UserScript==
// @name         Redirect2target
// @name:zh-CN   跳转直达
// @namespace    https://github.com/Germxu
// @homepage     https://github.com/Germxu/Scripts-for-TamperMonkey
// @supportURL   https://github.com/Germxu/Scripts-for-TamperMonkey/issues/new
// @version      0.2
// @description  redirect to the target page directly
// @description:zh-CN  跳转直达, 干掉中间页
// @author       Finn
// @match        http://*/*
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// ==/UserScript==

// const reg = /https?:\/\/(url|to|target|redirect|links?).+\/\?(url|to|target|redirect|links?)=(.*?)/

(function () {
  'use strict';
  const maybeKeys = [ 'url', 'to', 'u', 'link', 'links', 'redirect', 'target', 't' ].join('|')
  const reg = new RegExp(`^https?://(${maybeKeys}).+\?(${maybeKeys})=(.*?)$`)
  const url = location.href
  if (reg.test(url)) {
    const redirectkey = url.match(reg)[ 2 ]
    const redirectValue = new URLSearchParams(location.search).get(redirectkey)
    // console.log("target: ", redirectkey, redirectValue)
    if (redirectValue && redirectValue.startsWith('http')) {
      location.href = redirectValue
    }
  }
})();
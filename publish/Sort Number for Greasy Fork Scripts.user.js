// ==UserScript==
// @name            Sort Number  for Greasy Fork Scripts
// @name:zh-CN       脚本列表排序
// @description   Show order number  for Greasy Fork script list page, for every page
// @description:zh-CN   脚本列表页显示排名序号, 翻页自动追加序号
// @namespace    https://github.com/Germxu
// @homepage     https://github.com/Germxu/Scripts-for-TamperMonkey
// @supportURL   https://github.com/Germxu/Scripts-for-TamperMonkey/issues/new
// @version      0.5
// @author       Finn
// @run-at       document-start
// @match        https://greasyfork.org/*/scripts*
//@exclude       https://greasyfork.org/*/scripts/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const page = +new URLSearchParams(document.location.search).get('page')||1;
    const q= `<style>#browse-script-list{counter-reset: section ${(page-1)*50 -1};}.ad-entry{height: 0;overflow: hidden;}#browse-script-list li{position:relative}
                #browse-script-list li:after{counter-increment: section;content:counter(section);font:bold 20px/30px Arial;color: #29b6f6;position:absolute;bottom:8px;right:15px}</style>`;
    document.documentElement.insertAdjacentHTML('afterbegin', q);

   //document.querySelector("#browse-script-list").style.counterReset =`section ${(page-1)*50 -1}`
})();
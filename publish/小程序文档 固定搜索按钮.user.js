// ==UserScript==
// @name         小程序文档 固定搜索按钮
// @version      1.0
// @author       Finn
// @namespace    https://github.com/Germxu
// @supportURL   https://github.com/Germxu/Scripts-for-TamperMonkey
// @description  小程序开发文档 固定搜索按钮

// @match        https://developers.weixin.qq.com/miniprogram/*
// @icon         https://res.wx.qq.com/a/wx_fed/assets/res/NTI4MWU5.ico
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// ==/UserScript==

(function () {
    'use strict';

    const search = `.navbar__right{width:auto!important}.search__wrp{position:fixed;top:80px;right:42px;display:inline-block;width:300px!important;background:#fff;box-shadow:0 0 20px rgb(0 0 0/23%);vertical-align:middle;transition:all .2s}.search__wrp.key{top:13%;right:0;left:0;margin:auto;width:40%!important;height:58px;line-height:58px}.search__wrp.ctk{width:500px!important}.reco-list__wrp{border-radius:0;box-shadow:0 10px 20px rgb(0 0 0/23%)}`;
    GM_addStyle(search);
    window.addEventListener("DOMContentLoaded", () => {
        const opt = document.querySelector(".weui-desktop-form__input");
        const ipt = document.querySelector(".search__wrp");
        document.onkeydown = function (e) {
            var keyCode = e.keyCode || e.which || e.charCode;
            var ctrlKey = e.ctrlKey || e.metaKey;
            if (ctrlKey && keyCode == 70) {
                ipt.classList.add("key")
                opt.focus()
                e.preventDefault();
            }
        }
        document.onclick = function (e) {
            const ev = e.target;
            if (ev === opt && !ipt.classList.contains("key")) ipt.classList.add("ctk");
        }
        document.addEventListener('focusout', (e) => {
            const ev = e.target;
            if (ev === opt) {
                ipt.classList.remove("ctk", "key");
                document.querySelector(".reco-list__wrp").style.display = 'none';
            }
        });
    })
})();
// ==UserScript==
// @namespace    https://github.com/Germxu
// @homepage     https://github.com/Germxu/Scripts-for-TamperMonkey
// @supportURL   https://github.com/Germxu/Scripts-for-TamperMonkey/issues/new
// @version      1.0
// @author       Finn
// @name         Show Password by double-click

// @name:zh-CN     查看密码
// @description   😎 Show password By double-click, and auto hide after 5 seconds, also hide when it blur
// @description:zh-CN  😎双击显示密码, 5秒自动隐藏, 失去焦点自动隐藏

// @include     *
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    document.addEventListener("dblclick", e => {
        const ev = e.target;
        if (ev.nodeName === "INPUT" && ev.getAttribute("type") === "password") {
            ev.setAttribute("type", "text");
            setTimeout(() => { ev.setAttribute("type", "password") }, 5000)
            ev.onblur = function () { ev.setAttribute("type", "password") }
        }
    })
})();
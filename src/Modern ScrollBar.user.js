// ==UserScript==
// @name:en        Modern ScrollBar
// @name:zh        现代滚动条
// @name:zh-CN     现代滚动条
// @namespace    https://github.com/Germxu
// @author       Finn
// @version      0.1
// @homepage     https://github.com/Germxu/Scripts-for-TamperMonkey
// @supportURL   https://github.com/Germxu/Scripts-for-TamperMonkey/issues/new

// @description  try to take over the world!
// @include        *
// @run-at        document-start
// @grant        GM_addStyle
// @license      MIT
// ==/UserScript==

(function () {
	'use strict';

	// Your code here...
	const sty = `
				::-webkit-scrollbar { width: 9px; border-radius: 15px; }
				::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.25); border-radius: 5px; }
				::-webkit-scrollbar-thumb:hover { background: rgba(0, 0, 0, 0.3); }
				`
	GM_addStyle(sty)
})();
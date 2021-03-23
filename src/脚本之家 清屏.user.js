// ==UserScript==
// @name         脚本之家 清屏
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Finn
// @match        https://www.jb51.net/article/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    'use strict';
    const hideChaos = `<style>
#main .main-right,.pt10,.lbd,.xgcomm,#header,.lbd_bot,#ewm,.subnav,.art_xg,.tags,#comments{display:none!important;}
body #main .main-left{padding:0;width:unset;float:none}
body #article{padding: 15px 20px 20px;box-shadow: 0 0 30px rgb(0 0 0 / 25%)}
#ewm + p{font-weight:bold;text-align:center;margin:20px;font-size:24px;}
body .syntaxhighlighter .line.alt1,body .syntaxhighlighter .line.alt2{background:#d4dbdc!important}
body .syntaxhighlighter div{padding:10px 0px!important}
.jb51code{width:960px!important}
.jb51code .syntaxhighlighter table{background:#d4dbdc!important}
                    </style>`;

    document.documentElement.insertAdjacentHTML('afterBegin', hideChaos);
})();
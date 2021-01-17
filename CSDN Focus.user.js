// ==UserScript==
// @name         CSDN Focus
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  CSS加载, 页面不再重绘
// @description  只显示页面文章和评论, 其他全部隐藏
// @author       Finn
// @match       blog.csdn.net/*/article/*
// @grant       GM_addStyle
// ==/UserScript==

(function() {
    'use strict';
    const hideChaos =  `
                       #csdn-toolbar,#blogColumnPayAdvert, .csdn-side-toolbar, aside, #dmp_ad_58, .recommend-box, .login-mark, #passportbox
                        {display:none!important;}
                       .d-flex{display:block!important}
                       main{width:100%!important; box-shadow: 0 0 50px #69808b78;}
                       #mainBox{margin:30px auto;width:1000px!important}
                      `;
    
   GM_addStyle(hideChaos)
})();

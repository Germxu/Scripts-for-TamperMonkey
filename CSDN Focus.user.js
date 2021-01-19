// ==UserScript==
// @name         CSDN Focus
// @namespace    https://github.com/Germxu
// @version      0.5
// @description  💡: 页面不重绘不闪屏! CSDN无登录弹窗无广告骚扰无推荐阅读! 纯CSS注入, 自动展开CSDN文章和全部评论,页面不重绘! 其他全部隐藏,只在CSDN文章页运行,沉浸式体验|受够了脚本注入导致的闪屏重绘页面吗, 试试不一样的感觉吧 😁
// @description:en   CSDN cleaner with css. If it help, star on github will be excellent 😄
// @author       Finn
// @homepage     https://github.com/Germxu/Scripts-for-TamperMonkey
// @supportURL   https://github.com/Germxu/Scripts-for-TamperMonkey/issues/new
// @run-at       document-start
// @match        blog.csdn.net/*/article/details/*
// @match        *.blog.csdn.net/article/details/*
// @grant        GM_addStyle
// @license      MIT
// ==/UserScript==

(function () {
    /*
     页面重新加载太不爽了, 我不喜欢, 希望您也一样, 如有增强功能需求, 请提交issue, 顺便点个赞👍, 如果呼声强烈, 我会考虑制作js版本😄
     后续本脚本会考虑支持其他网站净化, 但也是使用CSS, 避免js加载导致的页面重绘
     隐藏头部, 底部, 登录窗口, 左侧信息, 页面广告, 推荐阅读, 页面提示等等
     展开全部文章, 展开评论, 显示评论切换翻页按钮
     只删减, 不添加其他内容
    */
    'use strict';
    const hideChaos = `
                       #csdn-toolbar .toolbar-advert,#csdn-toolbar .toolbar-container-left,#csdn-toolbar .toolbar-container-right,
                       .toolbar-search-drop-menu.toolbar-search-half, ::-webkit-input-placeholder, #placeholder
                       #blogColumnPayAdvert, .csdn-side-toolbar, aside, #dmp_ad_58,
                       .recommend-box, .login-mark, .blog-footer-bottom, .template-box,.leftPop,
                       #toolBarBox, .comment-edit-box.d-flex, #passportbox, .opt-box.text-center,
                       .hide-article-box.hide-article-pos.text-center, #rightAside
                        {display:none!important; color: transparent; visible:hidden}
                        .toolbar-search.onlySearch{transition:all 0.3s ease;}
                       body #csdn-toolbar{box-shadow: 0 2px 10px 0 rgba(0,0,0,.15);position:fixed !important;top: 0px;left: 0px;width: 100%;z-index: 1993;}
                        .toolbar-search.onlySearch:focus-within {max-width:1000px!important; width:1000px!important}
                       .d-flex{display:block!important}
                       .main_father{height: auto !important;}
                       main{width:100%!important; box-shadow: 0 0 30px #959fa378; margin-bottom:0!important;}
                       #mainBox{margin:50px auto; width:1000px!important}
                       .comment-list-box{max-height:none!important}
                       #commentPage, .toolbar-container-middle{display:block!important}
                       #article_content{height:auto !important}
                       .comment-list-container{padding: 4px 0!important}
                       .article-header-box{padding-top: 18px !important}
                       main .comment-box{padding: 0;box-shadow: 0 0 10px rgba(0,0,0,0.05);margin:8px 0;}
                      `;

    GM_addStyle(hideChaos);
})();

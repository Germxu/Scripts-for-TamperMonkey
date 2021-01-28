// ==UserScript==
// @name         CSDN Focus
// @description  💡: 页面不重绘不闪屏! CSDN无弹窗无广告无推荐阅读, 展开文章和评论, 保留搜索栏, 外链直达! | 受够了脚本注入导致的闪屏重绘页面吗, 试试不一样的感觉吧 😁
// @version      0.8
// @author       Finn
// @namespace    https://github.com/Germxu
// @homepage     https://github.com/Germxu/Scripts-for-TamperMonkey
// @supportURL   https://github.com/Germxu/Scripts-for-TamperMonkey/issues/new
// @run-at       document-start
// @match        blog.csdn.net/*/article/details/*
// @match        *.blog.csdn.net/article/details/*
// @grant        none
// @license      MIT
// @note         V0.8 使用原生API, 放弃GM_***
// @note         V0.7 操作优化
// @note         V0.6 添加外联直达, 去他妈的跳转提醒
// @note         V0.5 保留搜索栏, 并优化搜索栏动作
// @note         v0.4 隐藏大屏幕下的右侧边栏
// @note         v0.3 展开全部评论和翻页键, 展开需要关注阅读文章
// @note         v0.2 JS重置样式改为纯CSS注入,页面不再重绘, 所见所得
// ==/UserScript==

(function () {
    'use strict';
    const hideChaos = `<style>
                        #csdn-toolbar .toolbar-advert,#csdn-toolbar .toolbar-container-left,#csdn-toolbar .toolbar-container-right,
                        .toolbar-search-drop-menu.toolbar-search-half, ::-webkit-input-placeholder, #placeholder
                        #blogColumnPayAdvert, .csdn-side-toolbar, aside, #dmp_ad_58,
                        .recommend-box, .login-mark, .blog-footer-bottom, .template-box,.leftPop,
                        #toolBarBox, .comment-edit-box.d-flex, #passportbox, .opt-box.text-center,
                        .hide-article-box.hide-article-pos.text-center, #rightAside, .hljs-button.signin
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
                    </style>`;

    document.documentElement.insertAdjacentHTML('afterbegin', hideChaos);

    //外链直达, 以新页面打开
    window.addEventListener("DOMContentLoaded", function () {
        document.body.addEventListener('click', function (e) {
            let ev = e.target;
            if (ev.nodeName.toLocaleLowerCase() === 'a') {
                if (ev.host.indexOf("csdn") === -1) {
                    e.stopImmediatePropagation();
                    window.open(ev.href);
                    e.preventDefault();
                }
            }
        }, true);
    })

})();

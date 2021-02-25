// ==UserScript==
// @name         CSDN Focus
// @description  💡: 页面不重绘不闪屏! CSDN无弹窗无广告无推荐阅读, 展开文章和评论, 保留搜索栏, 外链直达! | 受够了脚本注入导致的闪屏重绘页面吗, 试试不一样的感觉吧 😁
// @version      0.9.8
// @author       Finn
// @namespace    https://github.com/Germxu
// @homepage     https://github.com/Germxu/Scripts-for-TamperMonkey
// @supportURL   https://github.com/Germxu/Scripts-for-TamperMonkey/issues/new
// @updateURL    https://github.com/Germxu/Scripts-for-TamperMonkey/raw/main/CSDN%20Focus.user.js
// @run-at       document-start
// @match        blog.csdn.net/*/article/details/*
// @match        *.blog.csdn.net/article/details/*
// @grant        none
// @license      MIT
// @note         V0.9 添加返回顶部按钮, 重新释放侧边栏和推荐阅读, 尽可能不影响阅读
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
                        .toolbar-search-drop-menu.toolbar-search-half, ::-webkit-input-placeholder, #placeholder,
                        #blogColumnPayAdvert, .csdn-side-toolbar, #dmp_ad_58,
                         .login-mark, .blog-footer-bottom, .template-box,.leftPop,
                        #toolBarBox, .comment-edit-box.d-flex, #passportbox, .opt-box.text-center,
                        .hide-article-box.hide-article-pos.text-center, #rightAside, .hljs-button.signin
                        {display:none!important; color: transparent; visibility:hidden}
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
                        #FinnTop{width:36px;height:36px;position:fixed;left:50%;margin-left:520px;bottom:80px;z-index:999;cursor:pointer;background:#fff;border-radius:50%;box-shadow:0 0 20px #75757545;}
                        #FinnTop svg{margin:4px;}
                        .blog_container_aside{border:12px solid #fff;background:#fff;box-sizing: content-box;position:fixed; left:-315px!important;;transition:all 0.3s;box-shadow: 2px 0 10px 0 rgba(0,0,0,.15);z-index:99;}
                        .blog_container_aside:hover{left:0px!important;}
                        .recommend-box.insert-baidu-box{height:70%;overflow:auto;position: fixed;
                            background:#fff;box-sizing: content-box;transition:all 0.3s;box-shadow: 0 -3px 10px 0 rgba(0,0,0,.25);border:10px solid #fff;
                            z-index: 1995;top: calc(100% - 18px);left:0;right:0;margin:auto; width: 1000px;}
                        .recommend-box.insert-baidu-box:hover{top:29%;}
                        .recommend-box.insert-baidu-box::-webkit-scrollbar-thumb {
                            background-color: rgba(153,154,170,0.3);}
                        .recommend-box.insert-baidu-box::-webkit-scrollbar {
                            width: 5px;height: 100px; }
                        .recommend-item-box{display:none!important;}
                        .recommend-item-box.type_blog{display:block!important;}
                    </style>
                    <div id="FinnTop">
                    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3954" width="28" height="28"><path d="M312.656371 508.237303H11.161712v70.127174h112.52275v346.672604h75.943646V578.364477h113.028263zM500.36245 501.663584c-61.893652 0-111.803365 20.260439-148.340513 60.217477-36.243459 39.635719-54.622038 93.276407-54.622038 159.435199 0 61.635779 18.041912 112.559589 53.621245 151.354149 35.863812 39.10974 83.981716 58.941414 143.020344 58.941414 60.386322 0 109.444645-20.176528 145.81397-59.968813 36.074613-39.46892 54.366212-93.194542 54.366212-159.682839 0-61.606103-17.85567-112.51354-53.073776-151.309124-35.540448-39.142485-82.907245-58.987463-140.785444-58.987463z m82.695421 323.041394c-21.549805 24.74866-50.669006 36.778648-89.016383 36.778648-35.388998 0-63.229067-12.5662-85.111447-38.416961-22.103414-26.107611-33.310663-61.702294-33.310663-105.798605 0-43.73406 11.492752-79.358419 34.157961-105.879445 22.48306-26.306132 51.121308-39.093367 87.552032-39.093367 37.09178 0 65.35038 12.034081 86.387509 36.787858 21.255093 25.018813 32.033577 61.672618 32.033577 108.943224 0 45.874817-10.999518 81.766258-32.692586 106.678648zM975.277834 541.93273c-25.599028-22.358217-61.515029-33.695427-106.75028-33.695427H744.709551v416.799778h75.689866V778.630616h38.062898c43.991933 1.409093 81.277118-11.004635 110.87318-36.857442 30.034037-26.230408 45.260833-60.847833 45.260833-102.891392 0-41.534975-13.228279-74.15286-39.318494-96.949052z m-154.878417 35.926234h39.024805c26.649963 0 46.51029 5.362124 59.032488 15.93697 12.059664 10.187013 17.923208 25.596981 17.923208 47.109948 0 22.346961-6.443759 38.806841-19.697621 50.318012-13.592576 11.800767-34.472116 17.785062-62.060451 17.785062h-34.220382V577.858964z" fill="#d81719" p-id="3955"></path><path d="M496.017492 61.552891c-2.648316 1.526773-5.500271 2.64934-7.840572 4.989641-0.409322 0.508583-0.713244 0.915859-1.121544 1.324158-0.508583 0.610914-1.323135 0.813528-1.832741 1.322112L210.364637 354.334097c-7.334036 7.534604-10.999518 17.312294-10.999519 27.088962 0.001023 10.183943 4.072759 20.469194 12.016685 28.106128 15.581883 14.97097 40.326451 14.561647 55.29742-1.018189l247.872391-257.240759L758.860852 409.530211c14.868639 15.681144 39.615253 16.394389 55.297421 1.526772 15.683191-14.868639 16.396435-39.615253 1.526773-55.29742L543.473317 67.969021c-11.915377-12.628622-30.243815-14.968923-45.112454-7.841595-0.816598 0.304945-1.527796 1.01819-2.343371 1.425465m0 0" fill="#d81719" p-id="3956"></path></svg>
                    </div>`;

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
        $("#FinnTop").click(function () {
            $("body,html").animate({ scrollTop: 0 }, 300);
        });
        
    })
})();

//2021-2-18 22:59:55
//工作计划: 左侧栏目优化展现方式,以及 推荐阅读的呈现方式
//左侧自动隐藏
//2021-2-19 01:28:34 已完成

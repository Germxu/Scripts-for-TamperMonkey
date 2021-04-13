// ==UserScript==
// @name         CSDN Focus
// @description  💡: 页面不重绘不闪屏! CSDN, 脚本之家无弹窗无广告无推荐阅读, 展开文章和评论, 保留搜索栏, 外链直达! | 受够了脚本注入导致的闪屏重绘页面吗, 试试不一样的感觉吧 😁
// @version      1.2.4.13
// @author       Finn
// @namespace    https://github.com/Germxu
// @homepage     https://github.com/Germxu/Scripts-for-TamperMonkey
// @supportURL   https://github.com/Germxu/Scripts-for-TamperMonkey/issues/new
// @run-at       document-start
// @match        blog.csdn.net/*/article/details/*
// @match        *.blog.csdn.net/article/details/*
// @match        www.jb51.net/article/*
// @grant        none
// @license      MIT
// @note         V1.2 优化:作者标签显示为作者名字, 竖排以减小显示遮挡
// @note         V1.1 添加隐藏内容提示标签, 侧边栏和推荐阅读
// @note         V1.0 添加脚本之家页面净化 jb51.net 净化
// ==/UserScript==

(function () {
    'use strict';

    const csdn = `<style>
        #csdn-toolbar .toolbar-advert,#csdn-toolbar .toolbar-container-left,#csdn-toolbar .toolbar-container-right,
        .toolbar-search-drop-menu.toolbar-search-half, ::-webkit-input-placeholder, #placeholder,
        #blogColumnPayAdvert, .csdn-side-toolbar, #dmp_ad_58,#footerRightAds,.csdn-shop-window-common,
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
        .blog_container_aside{height:calc(100% - 100px);overflow-y:auto;overflow-x:hidden;border:solid #fff;border-width:20px 4px 0 4px;background:#fff;box-sizing: content-box;position:fixed;top:initial!important;left:-307px!important;;transition:all 0.35s;box-shadow: 2px 0 10px 0 rgba(0,0,0,.15);z-index:99;}
        .blog_container_aside::-webkit-scrollbar-track{-webkit-box-shadow: inset 0 0 15px rgba(0,0,0,0.13);background-color: #fefefe;}
		.blog_container_aside::-webkit-scrollbar{width: 6px;height:6px;background-color: #eee;}
		.blog_container_aside::-webkit-scrollbar-thumb{border-radius: 6px;background-color: #cecece;}
        .blog_container_aside:hover{left:0px!important;}
        .recommend-box.insert-baidu-box{height:79%;overflow:scroll;position: fixed;
        background:#fff;box-sizing: content-box;transition:all 0.38s;box-shadow: 0 -3px 10px 0 rgba(0,0,0,.25);border:10px solid #fff;z-index: 1995;top: calc(100% - 7px);left:0;right:0;margin:auto; width: 1000px;}
        .recommend-box.insert-baidu-box:hover{top:29%}
        .recommend-box.insert-baidu-box::-webkit-scrollbar-thumb { background-color: rgba(153,154,170,0.3);}
        .recommend-box.insert-baidu-box::-webkit-scrollbar {width: 5px;height: 100px; }
        .recommend-item-box{display:none!important;}
        .recommend-item-box.type_blog{display:block!important;}
        aside.blog_container_aside:before{width:20px;animation:wd 1s ease-out forwards;position:fixed;top:58px;left:0;z-index:999;padding:8px 0px;background:#ff4d4d;text-align:center;color:#fff;content: " "attr(username) " ";writing-mode: tb-rl;font-size:14px;line-height: 1.5;transition:all 0.35s ease;}
        @keyframes wd{from {left:-20px;}to {left:0;}}
         aside.blog_container_aside:hover::before{width:308px;height:18px;padding: 2px 0; writing-mode: rl-tb;}
        .recommend-box.insert-baidu-box:before{position:fixed;bottom:40px;left:50%;margin-left:510px;padding:4px;background:#ff4d4d;color:#fff;content:"推荐阅读";font-size:13px}
    </style>
    <div id="FinnTop">
    <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path d="M312.656 508.237H11.162v70.127h112.522v346.673h75.944V578.364h113.028zm187.706-6.573c-61.893 0-111.803 20.26-148.34 60.217-36.244 39.636-54.622 93.276-54.622 159.435 0 61.636 18.042 112.56 53.621 151.354 35.864 39.11 83.982 58.942 143.02 58.942 60.387 0 109.445-20.177 145.814-59.969 36.075-39.469 54.367-93.195 54.367-159.683 0-61.606-17.856-112.513-53.074-151.309-35.54-39.142-82.907-58.987-140.786-58.987zm82.696 323.041c-21.55 24.749-50.67 36.779-89.017 36.779-35.389 0-63.229-12.567-85.111-38.417-22.103-26.108-33.31-61.703-33.31-105.799 0-43.734 11.492-79.358 34.157-105.88 22.483-26.306 51.122-39.093 87.552-39.093 37.092 0 65.35 12.034 86.388 36.788 21.255 25.019 32.033 61.673 32.033 108.943 0 45.875-11 81.767-32.692 106.679zm392.22-282.772c-25.6-22.358-61.515-33.696-106.75-33.696H744.71v416.8h75.69V778.631h38.062c43.992 1.409 81.277-11.005 110.873-36.858 30.035-26.23 45.261-60.848 45.261-102.891 0-41.535-13.228-74.153-39.318-96.95zm-154.879 35.926h39.025c26.65 0 46.51 5.362 59.033 15.937 12.06 10.187 17.923 25.597 17.923 47.11 0 22.347-6.444 38.807-19.698 50.318-13.592 11.8-34.472 17.785-62.06 17.785h-34.22v-131.15zM496.017 61.553c-2.648 1.527-5.5 2.65-7.84 4.99-.41.508-.713.915-1.122 1.324-.508.61-1.323.813-1.832 1.322L210.365 354.334c-7.334 7.535-11 17.312-11 27.09.001 10.183 4.073 20.468 12.017 28.105 15.582 14.971 40.326 14.562 55.297-1.018l247.873-257.24L758.86 409.53c14.868 15.68 39.615 16.394 55.297 1.526 15.683-14.869 16.397-39.615 1.527-55.297L543.473 67.969C531.558 55.34 513.23 53 498.361 60.127c-.817.305-1.528 1.019-2.344 1.426m0 0" fill="#d81719"/></svg>
    </div>`;
    const jb51 = `<style>
                    #main .main-right,.pt10,.lbd,.xgcomm,#header,.lbd_bot,#ewm,.subnav,.art_xg,.tags,#comments{display:none!important;}
                    body #main .main-left{padding:0;width:unset;float:none}
                    body #article{padding: 15px 20px 20px;box-shadow: 0 0 30px rgb(0 0 0 / 25%)}
                    #ewm + p{font-weight:bold;text-align:center;margin:20px;font-size:24px;}
                    body .syntaxhighlighter .line.alt1,body .syntaxhighlighter .line.alt2{background:#d4dbdc!important}
                    body .syntaxhighlighter div{padding:10px 0px!important}
                    .jb51code{width:960px!important}
                    .jb51code .syntaxhighlighter table{background:#d4dbdc!important}
                </style>`;
    let hideChaos;
    if (location.host === "www.jb51.net") {
        hideChaos = jb51;
    } else {
        hideChaos = csdn;
        //外链直达, 以新页面打开
        window.addEventListener("DOMContentLoaded", function () {
            document.querySelector(".blog_container_aside").setAttribute("username",uid.title);
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
    }

    document.documentElement.insertAdjacentHTML('afterbegin', hideChaos);

})();
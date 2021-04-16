// ==UserScript==
// @name         CSDN Focus
// @description  💡: 页面不重绘不闪屏! CSDN,脚本之家无弹窗无广告无推荐阅读, 展开文章和评论, 保留搜索栏, 外链直达! | 受够了脚本注入导致的闪屏重绘页面吗, 试试不一样的感觉吧 😁
// @version      1.2.4.14
// @author       Finn
// @namespace    https://github.com/Germxu
// @homepage     https://github.com/Germxu/Scripts-for-TamperMonkey
// @supportURL   https://github.com/Germxu/Scripts-for-TamperMonkey/issues/new
// @run-at       document-start
// @match        blog.csdn.net/*/article/details/*
// @match        *.blog.csdn.net/article/details/*
// @match        www.jb51.net/article/*
//
// @grant        none
// @license      MIT
// @compatible   chrome 54+
// @compatible   firefox 49+
//
// @note         V1.2 优化:作者标签显示为作者名字, 竖排以减小显示遮挡, 优化动作
// @note         V1.1 添加隐藏内容提示标签, 侧边栏和推荐阅读
// @note         V1.0 添加脚本之家页面净化 jb51.net 净化
// ==/UserScript==

(function () {
    'use strict';

    let dark = localStorage.FinnDark;
    dark==1&&document.documentElement.setAttribute("darkMode",true);
    const csdn = `<style>[darkMode]{filter:invert(1) hue-rotate(180deg)}[darkMode]  #darkBtn,[darkMode] img,[darkMode]  code.hljs {filter: invert(1) hue-rotate(180deg);}
        html * {transition:filter 0.7s, background 0.7s}[darkMode] body{background:#ebebeb!important}
        #darkBtn{position:fixed; top:8px;left:50px;width:32px;height:32px;z-index:9999;background:gold;cursor:pointer;border-radius: 50%;transition:all 0.5s}
        [darkMode]  #darkBtn{background:transparent; box-shadow:-0.5em 0.3em 0 0 gold; left:60px;top:4px}
        #darkBtn:after{content:"打开夜间模式";width:100px;position:absolute;right:-120px;top:4px;font-size:14px;font-weight:600;transition:all 0.5s;display:none}
       [darkMode] #darkBtn:after{content:"关闭夜间模式";right:-110px;top:8px;filter: invert(1) hue-rotate(180deg);font-weight:600;}#darkBtn:hover:after{display:block}
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
        .blog_container_aside{height:calc(100% - 100px);overflow-y:auto;overflow-x:hidden;border:solid #fff;border-width:20px 4px 0 4px;background:#fff;box-sizing: content-box;position:fixed;top:initial!important;left:-307.8px!important;;transition:all 0.35s;box-shadow: 2px 0 10px 0 rgba(0,0,0,.15);z-index:99;}
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
        aside.blog_container_aside:before{width:14px;animation:_l 1s ease-in forwards;position:fixed;top:58px;left:0;z-index:999;padding:5px 1px;background:#ff4d4d;text-align:center;color:#fff;content: " "attr(username) " ";writing-mode: tb-rl;font-size:12px;line-height: 1.4;transition:all 0.35s ease;}
        @keyframes _l{from {left:-20px;}to {left:0;}}
         aside.blog_container_aside:hover::before{width:308px;height:18px;padding: 4px 0; writing-mode: rl-tb;font-size:14px;}
        .recommend-box.insert-baidu-box:before{position:fixed;bottom:40px;left:50%;margin-left:510px;padding:4px;background:#ff4d4d;color:#fff;content:"推荐阅读";font-size:13px}
    </style>
     <div id="darkBtn"></div>
    <div id="FinnTop">
    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3954" width="28" height="28"><path d="M312.656371 508.237303H11.161712v70.127174h112.52275v346.672604h75.943646V578.364477h113.028263zM500.36245 501.663584c-61.893652 0-111.803365 20.260439-148.340513 60.217477-36.243459 39.635719-54.622038 93.276407-54.622038 159.435199 0 61.635779 18.041912 112.559589 53.621245 151.354149 35.863812 39.10974 83.981716 58.941414 143.020344 58.941414 60.386322 0 109.444645-20.176528 145.81397-59.968813 36.074613-39.46892 54.366212-93.194542 54.366212-159.682839 0-61.606103-17.85567-112.51354-53.073776-151.309124-35.540448-39.142485-82.907245-58.987463-140.785444-58.987463z m82.695421 323.041394c-21.549805 24.74866-50.669006 36.778648-89.016383 36.778648-35.388998 0-63.229067-12.5662-85.111447-38.416961-22.103414-26.107611-33.310663-61.702294-33.310663-105.798605 0-43.73406 11.492752-79.358419 34.157961-105.879445 22.48306-26.306132 51.121308-39.093367 87.552032-39.093367 37.09178 0 65.35038 12.034081 86.387509 36.787858 21.255093 25.018813 32.033577 61.672618 32.033577 108.943224 0 45.874817-10.999518 81.766258-32.692586 106.678648zM975.277834 541.93273c-25.599028-22.358217-61.515029-33.695427-106.75028-33.695427H744.709551v416.799778h75.689866V778.630616h38.062898c43.991933 1.409093 81.277118-11.004635 110.87318-36.857442 30.034037-26.230408 45.260833-60.847833 45.260833-102.891392 0-41.534975-13.228279-74.15286-39.318494-96.949052z m-154.878417 35.926234h39.024805c26.649963 0 46.51029 5.362124 59.032488 15.93697 12.059664 10.187013 17.923208 25.596981 17.923208 47.109948 0 22.346961-6.443759 38.806841-19.697621 50.318012-13.592576 11.800767-34.472116 17.785062-62.060451 17.785062h-34.220382V577.858964z" fill="#d81719" p-id="3955"></path><path d="M496.017492 61.552891c-2.648316 1.526773-5.500271 2.64934-7.840572 4.989641-0.409322 0.508583-0.713244 0.915859-1.121544 1.324158-0.508583 0.610914-1.323135 0.813528-1.832741 1.322112L210.364637 354.334097c-7.334036 7.534604-10.999518 17.312294-10.999519 27.088962 0.001023 10.183943 4.072759 20.469194 12.016685 28.106128 15.581883 14.97097 40.326451 14.561647 55.29742-1.018189l247.872391-257.240759L758.860852 409.530211c14.868639 15.681144 39.615253 16.394389 55.297421 1.526772 15.683191-14.868639 16.396435-39.615253 1.526773-55.29742L543.473317 67.969021c-11.915377-12.628622-30.243815-14.968923-45.112454-7.841595-0.816598 0.304945-1.527796 1.01819-2.343371 1.425465m0 0" fill="#d81719" p-id="3956"></path></svg>
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
                console.log(1,dark)
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

            $("#darkBtn").click(function(){
                if(dark==1){
                     dark=0;
                     localStorage.FinnDark=0;
                    document.documentElement.removeAttribute("darkMode");
                }else{
                    dark=1;
                    localStorage.FinnDark=1;
                    document.documentElement.setAttribute("darkMode",true);
                }
            })
        })
    }

    document.documentElement.insertAdjacentHTML('afterbegin', hideChaos);

})();
// ==UserScript==
// @name         CSDN Focus
// @description  🌚 黑暗模式上线, 一键变天 | CSDN, 脚本之家 无弹窗无广告无任何干扰, 自动展开文章和评论, 外链直达! 隐藏属性等你发现, 不试一下? 😃
// @version      1.6
// @author       Finn
// @namespace    https://github.com/Germxu
// @homepage     https://github.com/Germxu/Scripts-for-TamperMonkey
// @supportURL   https://github.com/Germxu/Scripts-for-TamperMonkey/issues/new
// @run-at       document-start
// @match        blog.csdn.net/*/article/details/*
// @match        *.blog.csdn.net/article/details/*
// @match        www.jb51.net/article/*
//
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @compatible   chrome 54+
//
// @note         V1.6 重要更新: 修复了一直以来可能出现的运行不成功和后台加载脚本失败的问题
// @note         V1.5 重要更新: 添加黑暗模式, 一键切换, 优化精简大量静态代码,修复隐性Bug
// ==/UserScript==

(function () {
    'use strict';
    const csdn = `<style>:root{--finn-width:1000px}[DarkMode],[darkMode] #darkBtn,[darkMode] img,[darkMode] code.hljs,[darkMode] pre.prettyprint{filter:invert(1) hue-rotate(180deg);transition:all 0.5s}[darkModE] body{background:#ebebeb !important;transition:background 0.7s}#darkBtn{position:fixed;top:8px;left:50px;width:32px;height:32px;z-index:9999;background:gold;cursor:pointer;border-radius:50%;transition:all 0.5s}[darkMode] #darkBtn{background:transparent;box-shadow:-0.5em 0.3em 0 0 gold;left:60px;top:4px}div#darkBtn:before{content:"";width:50px;height:50px;display:block;transform:translate(-10px,-10px)}#darkBtn:after{content:"打开夜间模式";width:100px;position:absolute;right:-120px;top:4px;font-size:14px;font-weight:600;transition:all 0.5s;display:none}[darkMode] #darkBtn:after{content:"关闭夜间模式";right:-110px;top:8px;filter:invert(1) hue-rotate(180deg);font-weight:600;}#darkBtn:hover:after{display:block}#csdn-toolbar .toolbar-advert,#csdn-toolbar .toolbar-container-left,#csdn-toolbar .toolbar-container-right,.toolbar-search-drop-menu.toolbar-search-half,::-webkit-input-placeholder,#placeholder,#blogColumnPayAdvert,.csdn-side-toolbar,#dmp_ad_58,#footerRightAds,.csdn-shop-window-common,.login-mark,.blog-footer-bottom,.template-box,.leftPop,#toolBarBox,.comment-edit-box.d-flex,#passportbox,.opt-box.text-center,.hide-article-box.hide-article-pos.text-center,#rightAside,.hljs-button.signin{display:none !important;color:transparent;visibility:hidden}.toolbar-search.onlySearch{transition:all 0.3s ease;}body #csdn-toolbar{box-shadow:0 2px 10px 0 rgba(0,0,0,.15);position:fixed !important;top:0px;left:0px;width:100%;z-index:1993;}.toolbar-search.onlySearch:focus-within{max-width:var(--finn-width) !important;width:var(--finn-width) !important}.d-flex{display:block !important}.main_father{height:auto !important;}main{cursor: auto;width:100% !important;box-shadow:0 0 30px #959fa378;margin-bottom:0 !important;}#mainBox{position:relative;margin:50px auto;width:var(--finn-width) !important;padding: 0 20px;box-sizing: content-box;cursor: e-resize;}.comment-list-box{max-height:none !important}#commentPage,.toolbar-container-middle{display:block !important}#article_content{height:auto !important}.comment-list-container{padding:4px 0 !important}.article-header-box{padding-top:18px !important}main .comment-box{padding:0;box-shadow:0 0 10px rgba(0,0,0,0.05);margin:8px 0;}#FinnTop{width:36px;height:36px;color:#ff4d4d;font:600 14px/44px arial;text-align:center;position:fixed;left:50%;margin-left:520px;bottom:80px;z-index:999;cursor:pointer;background:#fff;border-radius:50%;box-shadow:0 0 20px #75757545;}#FinnTop:before{content:"";position:absolute;left:28%;top:16%;color:#ff4d4d;width:14px;height:14px;border-top:2px solid #ff4d4d;border-left:2px solid #ff4d4d;transform:rotate(45deg)}.blog_container_aside{height:calc(100% - 100px);overflow-y:auto;overflow-x:hidden;border:solid #fff;border-width:20px 4px 0 4px;background:#fff;box-sizing:content-box;position:fixed;top:initial !important;left:-307.8px !important;;transition:all 0.35s;box-shadow:2px 0 10px 0 rgba(0,0,0,.15);z-index:99;}.blog_container_aside::-webkit-scrollbar-track{-webkit-box-shadow:inset 0 0 15px rgba(0,0,0,0.13);background-color:#fefefe;}.blog_container_aside::-webkit-scrollbar{width:6px;height:6px;background-color:#eee;}.blog_container_aside::-webkit-scrollbar-thumb{border-radius:6px;background-color:#cecece;}.blog_container_aside:hover{left:0px !important;}.recommend-box.insert-baidu-box{height:79%;overflow:scroll;position:fixed;background:#fff;box-sizing:content-box;transition:all 0.38s;box-shadow:0 -3px 10px 0 rgba(0,0,0,.25);border:10px solid #fff;z-index:1995;top:calc(100% - 7px);left:0;right:0;margin:auto;width:var(--finn-width);}.recommend-box.insert-baidu-box:hover{top:29%}.recommend-box.insert-baidu-box::-webkit-scrollbar-thumb{background-color:rgba(153,154,170,0.3);}.recommend-box.insert-baidu-box::-webkit-scrollbar{width:5px;height:100px;}.recommend-item-box{display:none !important;}.recommend-item-box.type_blog{display:block !important;}aside.blog_container_aside:before{width:14px;animation:_l 1s ease-in forwards;position:fixed;top:58px;left:0;z-index:999;padding:5px 1px;background:#ff4d4d;text-align:center;color:#fff;content:" "attr(username) " ";writing-mode:tb-rl;font-size:12px;line-height:1.4;transition:all 0.35s ease;}@keyframes _l{from{left:-20px;}to{left:0;}}aside.blog_container_aside:hover::before{width:308px;height:18px;padding:4px 0;writing-mode:rl-tb;font-size:14px;}.recommend-box.insert-baidu-box:before{position:fixed;bottom:40px;left:50%;margin-left:510px;padding:4px;background:#ff4d4d;color:#fff;content:"推荐阅读";font-size:13px}</style><div id="darkBtn"></div><div id="FinnTop">TOP</div>`;
    const jb51 = `<style> #main .main-right,#topbar,#footer,.pt10,.lbd,.xgcomm,#header,.lbd_bot,#ewm,.subnav,.art_xg,.tags,#comments{display:none !important;}body #main .main-left{padding:0;width:unset;float:none}body #article{padding:15px 20px 20px;box-shadow:0 0 30px rgb(0 0 0 / 25%)}#ewm+p{font-weight:bold;text-align:center;margin:20px;font-size:24px;}body .syntaxhighlighter .line.alt1,body .syntaxhighlighter .line.alt2{background:#d4dbdc !important}body .syntaxhighlighter div{padding:10px 0px !important}.jb51code{width:960px !important}.jb51code .syntaxhighlighter table{background:#d4dbdc !important}</style>`;
    let h = document.documentElement, _Ds;
    let FinnData = new Proxy(GM_getValue('FinnData', {}), {
        set(target, key, val) {
            key === "dark" && val ? h.setAttribute("darkMode", true) : h.removeAttribute("darkMode");
            const B = Reflect.set(target, key, val);
            GM_setValue('FinnData', FinnData);
            return B;
        }
    })
    if (location.host === "www.jb51.net") { _Ds = jb51; } else {
        _Ds = csdn;
        window.addEventListener("DOMContentLoaded", () => {
            document.querySelector(".blog_container_aside").setAttribute("username", username);
            mainBox.addEventListener('click', e => {
                let ev = e.target;
                if (ev.nodeName.toLocaleLowerCase() === 'a') {
                    if (ev.host.indexOf("csdn") === -1) {
                        e.stopImmediatePropagation();
                        window.open(ev.href);
                        e.preventDefault();
                    }
                }
            }, true);
            $("#darkBtn").click(() => { FinnData.dark = !FinnData.dark })
            $("#FinnTop").click(() => { $("body,html").animate({ scrollTop: 0 }, 300) });

            const varWidth = getComputedStyle(document.documentElement).getPropertyValue("--finn-width");
            console.log(varWidth);

            let resize = mainBox;
            resize.addEventListener("mousedown", e => {
                if (e.target !== mainBox) return;

                var startX = e.clientX;
                e.stopPropagation();
                
                document.onmousemove = function (e) {
                    // console.log("拖动", e);

                    var endX = e.clientX;
                    var moveLen = endX - startX;
                    // var maxT = box.clientWidth - resize.offsetWidth;
                    // if (moveLen < 59) moveLen = 59;
                    // if (moveLen > maxT - 500) moveLen = maxT - 500;

                    console.log(moveLen, resize.offsetWidth, resize.style.width);

                    resize.setAttribute("style", "width:" + (resize.offsetWidth + moveLen) + "px !important");
                }

                document.onmouseup = function (evt) {
                    evt.stopPropagation()
                    document.onmousemove = null;
                    document.onmouseup = null;
                    resize.releaseCapture && resize.releaseCapture();
                }
                resize.setCapture && resize.setCapture();
                return false;
                //blog.csdn.net/qq_42497250/article/details/96017804
            }, true)
        })
    }
    function ins() {
        h = document.documentElement;
        h.insertAdjacentHTML('afterbegin', _Ds);
        FinnData.dark && h.setAttribute("darkMode", true);
    }
    if (!h) {
        let OB = new MutationObserver(ins);
        OB.observe(document, { childList: true })
    } else {
        ins()
    }
})();
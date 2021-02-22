// ==UserScript==
// @name         bilibili plus
// @version      0.4.1
// @description  提供新版B站截图、获取封面、逐帧等功能,以及默认宽屏、默认无弹幕等模式
// @namespace    https://greasyfork.org/zh-CN/users/215623-christian-chen
// @author       化猫之宿
// @encoding     utf-8
//
// @match        *://www.bilibili.com/video/*
// @match        *://www.bilibili.com/bangumi/play/*
//
// @compatible   chrome 54+
// @compatible   firefox 49+
//
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

!function(modules) {
    var installedModules = {};
    function __webpack_require__(moduleId) {
        if (installedModules[moduleId]) return installedModules[moduleId].exports;
        var module = installedModules[moduleId] = {
            i: moduleId,
            l: !1,
            exports: {}
        };
        return modules[moduleId].call(module.exports, module, module.exports, __webpack_require__), 
        module.l = !0, module.exports;
    }
    __webpack_require__.m = modules, __webpack_require__.c = installedModules, __webpack_require__.d = function(exports, name, getter) {
        __webpack_require__.o(exports, name) || Object.defineProperty(exports, name, {
            enumerable: !0,
            get: getter
        });
    }, __webpack_require__.r = function(exports) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(exports, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(exports, "__esModule", {
            value: !0
        });
    }, __webpack_require__.t = function(value, mode) {
        if (1 & mode && (value = __webpack_require__(value)), 8 & mode) return value;
        if (4 & mode && "object" == typeof value && value && value.__esModule) return value;
        var ns = Object.create(null);
        if (__webpack_require__.r(ns), Object.defineProperty(ns, "default", {
            enumerable: !0,
            value: value
        }), 2 & mode && "string" != typeof value) for (var key in value) __webpack_require__.d(ns, key, function(key) {
            return value[key];
        }.bind(null, key));
        return ns;
    }, __webpack_require__.n = function(module) {
        var getter = module && module.__esModule ? function() {
            return module.default;
        } : function() {
            return module;
        };
        return __webpack_require__.d(getter, "a", getter), getter;
    }, __webpack_require__.o = function(object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
    }, __webpack_require__.p = "", __webpack_require__(__webpack_require__.s = 0);
}([ function(module, exports) {
    ({
        inject: function(is_userscript) {
            let user_settings, fps, side_bar, root, player_area, counter;
            fps = 29.97, counter = 0, user_settings = JSON.parse(document.documentElement.dataset.localsettings);
            const set = (setting, new_value) => {
                "user_settings" !== setting ? user_settings[setting] = new_value : user_settings = setting, 
                document.documentElement.dataset.localsettings = JSON.stringify(user_settings);
            }, key = {
                fullscreenEnabled: 0,
                fullscreenchange: 1
            }, webkit = [ "webkitFullscreenEnabled", "webkitfullscreenchange" ], moz = [ "mozFullScreenEnabled", "mozfullscreenchange" ], vendor = "fullscreenEnabled" in document && Object.keys(key) || webkit[0] in document && webkit || moz[0] in document && moz || [], fscreen = {
                addEventListener: (type, handler, options) => document.addEventListener(vendor[key[type]], handler, options),
                removeEventListener: (type, handler, options) => document.removeEventListener(vendor[key[type]], handler, options),
                get onfullscreenchange() {
                    return document[`on${vendor[key.fullscreenchange]}`.toLowerCase()];
                },
                set onfullscreenchange(handler) {
                    return document[`on${vendor[key.fullscreenchange]}`.toLowerCase()] = handler;
                }
            }, eventButtons = e => {
                for (let el = e.target; el !== e.currentTarget; el = el.parentElement) el.classList.contains("button-pic") && getThumb(), 
                el.classList.contains("button-screen") && getScreenshot(), el.classList.contains("button-next") && seekFrame("forward", 29.97), 
                el.classList.contains("button-pre") && seekFrame("backward", 29.97), el.classList.contains("button-mode-wide") && modeWide(el), 
                el.classList.contains("button-mode-nodanmu") && modeNoDanmaku(el), el.classList.contains("button-mode-dropdown") && modeDown(el);
            }, eventKeys = e => {
                switch (e.code.toLowerCase()) {
                  case "period":
                    root.querySelector(".button-next").click();
                    break;

                  case "comma":
                    root.querySelector(".button-pre").click();
                }
            };
            function modeWide(e, flag = !0) {
                let player, btn_wide;
                (player = document.querySelector("#bilibiliPlayer")) && !player.classList.contains("mode-widescreen") && (btn_wide = player.querySelector(".bilibili-player-video-btn-widescreen")) && !btn_wide.classList.contains("closed") && btn_wide.click(), 
                e.querySelectorAll(".button-mode-svg").forEach(element => {
                    element.classList.toggle("svg-display");
                }), flag && (user_settings.MODE_WIDE ? user_settings.MODE_WIDE = !1 : user_settings.MODE_WIDE = !0, 
                user_settings.MODE_WIDE && user_settings.MODE_DOWN && modeDown(e.parentNode.querySelector(".button-mode-dropdown")), 
                set("MODE_WIDE", user_settings.MODE_WIDE));
            }
            function modeDown(e, flag = !0) {
                let side_column, expand;
                (side_column = document.querySelector(".bui-collapse-wrap")) && side_column.classList.contains("bui-collapse-wrap-folded") && (expand = side_column.querySelector(".bui-collapse-arrow")).click(), 
                e.querySelectorAll(".button-mode-svg").forEach(element => {
                    element.classList.toggle("svg-display");
                }), flag && (user_settings.MODE_DOWN ? user_settings.MODE_DOWN = !1 : user_settings.MODE_DOWN = !0, 
                user_settings.MODE_DOWN && user_settings.MODE_WIDE && modeWide(e.parentNode.querySelector(".button-mode-wide")), 
                set("MODE_DOWN", user_settings.MODE_DOWN));
            }
            const modeNoDanmaku = (e, flag = !0) => {
                let button_danmaku;
                (button_danmaku = document.querySelector(".bui-switch-input")) && button_danmaku.checked && button_danmaku.click(), 
                e.querySelectorAll(".button-mode-svg").forEach(element => {
                    element.classList.toggle("svg-display");
                }), flag && (user_settings.MODE_DANMU_CLOSE ? user_settings.MODE_DANMU_CLOSE = !1 : user_settings.MODE_DANMU_CLOSE = !0, 
                set("MODE_DANMU_CLOSE", user_settings.MODE_DANMU_CLOSE));
            }, pauseVideo = video => {
                let btnStart;
                btnStart = document.querySelector(".bilibili-player-video-btn-start"), player_area && !player_area.classList.contains("video-state-pause") ? btnStart.click() : video.pause();
            }, popPage = (obj, x, y) => {
                let popOut, width, height, pop_url;
                return width = x, height = y, "string" == typeof obj ? (pop_url = obj, popOut = window.open(pop_url, "popOut", "width=" + width + ",height=" + height)) : "object" == typeof obj && (popOut = window.open("", "_blank", "width=" + width + ",height=" + height)).document.body.appendChild(obj), 
                popOut.focus(), popOut;
            }, getScreenshot = () => {
                let video, canvas, context, width, height, pop, style;
                video = document.querySelector("video"), context = (canvas = document.createElement("canvas")).getContext("2d"), 
                width = video.videoWidth, height = video.videoHeight, canvas.width = width, canvas.height = height, 
                context.drawImage(video, 0, 0, width, height), pauseVideo(video), pop = popPage(canvas, width, height), 
                (style = document.createElement("style")).type = "text/css", style.innerHTML = "body {\n              margin: 0;\n              width: 100%;\n              height: 100%;\n              display: flex;\n              justify-content: center;\n              align-items: center;\n              background-color: #ccc;\n             }\n             canvas {\n              max-width: 100%;\n              max-height: 100%;\n             }", 
                pop.document.head.appendChild(style);
            }, getThumb = () => {
                let thumbnail_url;
                (thumbnail_url = (thumbnail_url = document.querySelector('[itemprop="thumbnailUrl"]')) && thumbnail_url.getAttribute("content")) ? popPage(thumbnail_url, 881, 551) : alert("未找到缩略图！");
            }, seekFrame = (direction, fps) => {
                let video;
                video = document.querySelector("video"), pauseVideo(video), "forward" === direction ? video.currentTime = video.currentTime + 1 / fps : "backward" === direction && (video.currentTime = video.currentTime - 1 / fps);
            }, handleEvents = root_el => {
                root_el.addEventListener("click", eventButtons), root_el.querySelector(".button-mode").addEventListener("mouseenter", function(e) {
                    this.querySelector(".show-mode").style.display = "block", e.stopPropagation();
                }), root_el.querySelector(".button-mode").addEventListener("mouseleave", function(e) {
                    this.querySelector(".show-mode").style.display = "none", e.stopPropagation();
                });
                const eventClick = () => {
                    window.removeEventListener("keydown", eventKeys);
                };
                player_area.addEventListener("click", e => {
                    window.addEventListener("keydown", eventKeys), document.addEventListener("click", eventClick, {
                        once: !0
                    }), e.stopPropagation();
                }), fscreen.addEventListener("fullscreenchange", function() {
                    player_area.parentNode.classList.contains("mode-fullscreen") || (settings => {
                        let player, btn_wide;
                        settings.MODE_WIDE && (player = document.querySelector("#bilibiliPlayer")) && !player.classList.contains("mode-widescreen") && (btn_wide = player.querySelector(".bilibili-player-video-btn-widescreen")) && !btn_wide.classList.contains("closed") && btn_wide.click();
                    })(user_settings);
                });
            }, main = () => {
                if (root = document.querySelector(".bilibili-player-video-danmaku-root"), player_area = document.querySelector(".bilibili-player-area"), 
                side_bar = document.querySelector(".bui-collapse-wrap"), root && side_bar && player_area) (() => {
                    let button_next, button_pre, button_pic, button_screen, button_mode;
                    document.querySelector(".button-next") || ((button_next = document.createElement("div")).className = "bilibili-player-video-danmaku-setting bilibili-player-video-danmaku-switch button-pre", 
                    button_next.innerHTML = '<span class="bp-svgicon">\n                <svg viewBox="0 0 1024 1024"  xmlns="http://www.w3.org/2000/svg">\n                  <path d="M780.288 767.082667c40.405333 40.725333 40.512 106.645333 0.192 147.264l-36.096 36.373333a103.36 103.36 0 0 1-146.944-0.085333L249.685333 600.213333a125.290667 125.290667 0 0 1 0-176.490666L597.44 73.322667a103.466667 103.466667 0 0 1 146.944-0.085334l36.096 36.352c40.362667 40.682667 40.192 106.56-0.192 147.264L527.104 511.978667l253.184 255.104zM436.693333 542.016a42.666667 42.666667 0 0 1 0-60.096L719.722667 196.736a19.328 19.328 0 0 0 0.192-27.029333l-36.096-36.352a18.154667 18.154667 0 0 0-25.813334 0.064L310.250667 483.84a39.957333 39.957333 0 0 0 0 56.256l347.754666 350.421333a18.026667 18.026667 0 0 0 25.813334 0.085334l36.096-36.373334a19.349333 19.349333 0 0 0-0.192-27.029333L436.693333 542.037333z">\n                  </path>\n                </svg>\n              </span>\n              <span class="choose_danmaku">逐帧后退 &lt;</span>', 
                    (button_pre = document.createElement("div")).className = "bilibili-player-video-danmaku-setting bilibili-player-video-danmaku-switch button-next", 
                    button_pre.innerHTML = '<span class="bp-svgicon">\n                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">\n                  <path d="M304.085333 854.229333l36.096 36.373334a18.026667 18.026667 0 0 0 25.813334-0.085334l347.754666-350.421333a39.957333 39.957333 0 0 0 0-56.256L365.994667 133.418667a18.154667 18.154667 0 0 0-25.813334-0.064l-36.096 36.352a19.328 19.328 0 0 0 0.192 27.029333L587.306667 481.92a42.666667 42.666667 0 0 1 0 60.117333L304.277333 827.2a19.349333 19.349333 0 0 0-0.192 27.029333zM496.896 512L243.712 256.853333c-40.384-40.682667-40.533333-106.56-0.192-147.242666l36.096-36.352a103.466667 103.466667 0 0 1 146.944 0.085333l347.754667 350.4a125.290667 125.290667 0 0 1 0 176.490667L426.56 950.634667a103.36 103.36 0 0 1-146.944 0.085333l-36.096-36.373333c-40.32-40.618667-40.213333-106.538667 0.192-147.264L496.896 512z">\n                  </path>\n                </svg>\n              </span>\n              <span class="choose_danmaku">逐帧前进 &gt;</span>', 
                    (button_pic = document.createElement("div")).className = "bilibili-player-video-danmaku-setting bilibili-player-video-danmaku-switch button-pic", 
                    button_pic.innerHTML = '<span class="bp-svgicon">\n                <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">\n                  <path d="M42.666667 149.482667A106.752 106.752 0 0 1 149.482667 42.666667h725.034666A106.752 106.752 0 0 1 981.333333 149.482667v725.034666A106.752 106.752 0 0 1 874.517333 981.333333H149.482667A106.752 106.752 0 0 1 42.666667 874.517333V149.482667z m853.333333 430.186666V149.482667C896 137.578667 886.421333 128 874.517333 128H149.482667C137.578667 128 128 137.578667 128 149.482667v515.52l97.834667-97.834667A42.666667 42.666667 0 0 1 281.6 563.2l138.666667 104.021333 229.994666-268.330666a42.666667 42.666667 0 0 1 62.570667-2.389334L896 579.669333zM128 874.624C128 886.485333 137.557333 896 149.482667 896h725.034666A21.333333 21.333333 0 0 0 896 874.730667v-174.4l-210.922667-210.922667-226.005333 263.68a42.666667 42.666667 0 0 1-58.005333 6.378667l-141.056-105.813334L128 785.685333v88.96zM341.333333 426.666667a85.333333 85.333333 0 1 1 0-170.666667 85.333333 85.333333 0 0 1 0 170.666667z">\n                  </path>\n                </svg>\n              </span>\n              <span class="choose_danmaku">缩略图</span>', 
                    (button_screen = document.createElement("div")).className = "bilibili-player-video-danmaku-setting bilibili-player-video-danmaku-switch button-screen", 
                    button_screen.innerHTML = '<span class="bp-svgicon">\n                <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">\n                  <path d="M329.344 165.333333A42.666667 42.666667 0 0 1 362.666667 149.333333h298.666666a42.666667 42.666667 0 0 1 33.322667 16l72.533333 90.666667H874.666667a106.666667 106.666667 0 0 1 106.666666 106.474667V768.213333A106.56 106.56 0 0 1 874.752 874.666667H149.205333A106.538667 106.538667 0 0 1 42.666667 768.192V362.453333A106.666667 106.666667 0 0 1 149.333333 256h107.498667l72.533333-90.666667zM383.168 234.666667l-72.533333 90.666666A42.666667 42.666667 0 0 1 277.333333 341.333333H149.333333a21.333333 21.333333 0 0 0-21.333333 21.141334V768.213333c0 11.626667 9.514667 21.141333 21.205333 21.141334h725.546667c11.733333 0 21.248-9.514667 21.248-21.141334V362.453333A21.333333 21.333333 0 0 0 874.666667 341.333333h-128a42.666667 42.666667 0 0 1-33.322667-16l-72.533333-90.666666H383.189333zM512 725.333333a192 192 0 1 1 0-384 192 192 0 0 1 0 384z m0-85.333333a106.666667 106.666667 0 1 0 0-213.333333 106.666667 106.666667 0 0 0 0 213.333333z">\n                  </path>\n                </svg>\n              </span>\n              <span class="choose_danmaku">截图</span>', 
                    (button_mode = document.createElement("div")).className = "bilibili-player-video-danmaku-setting bilibili-player-video-danmaku-switch button-mode", 
                    button_mode.innerHTML = '<span class="bp-svgicon">\n                <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">\n                  <path d="M42.666667 149.376A106.645333 106.645333 0 0 1 149.376 42.666667h42.581333A106.645333 106.645333 0 0 1 298.666667 149.376v42.581333A106.645333 106.645333 0 0 1 191.957333 298.666667H149.376A106.645333 106.645333 0 0 1 42.666667 191.957333V149.376z m85.333333 0v42.581333A21.312 21.312 0 0 0 149.376 213.333333h42.581333A21.312 21.312 0 0 0 213.333333 191.957333V149.376A21.312 21.312 0 0 0 191.957333 128H149.376A21.312 21.312 0 0 0 128 149.376z m-85.333333 341.333333A106.645333 106.645333 0 0 1 149.376 384h42.581333A106.645333 106.645333 0 0 1 298.666667 490.709333v42.581334A106.645333 106.645333 0 0 1 191.957333 640H149.376A106.645333 106.645333 0 0 1 42.666667 533.290667v-42.581334z m85.333333 0v42.581334A21.312 21.312 0 0 0 149.376 554.666667h42.581333A21.312 21.312 0 0 0 213.333333 533.290667v-42.581334A21.312 21.312 0 0 0 191.957333 469.333333H149.376A21.312 21.312 0 0 0 128 490.709333z m-85.333333 341.333334A106.645333 106.645333 0 0 1 149.376 725.333333h42.581333A106.645333 106.645333 0 0 1 298.666667 832.042667v42.581333A106.645333 106.645333 0 0 1 191.957333 981.333333H149.376A106.645333 106.645333 0 0 1 42.666667 874.624v-42.581333z m85.333333 0v42.581333A21.312 21.312 0 0 0 149.376 896h42.581333A21.312 21.312 0 0 0 213.333333 874.624v-42.581333A21.312 21.312 0 0 0 191.957333 810.666667H149.376A21.312 21.312 0 0 0 128 832.042667z m256-682.666667A106.624 106.624 0 0 1 490.474667 42.666667H874.88A106.517333 106.517333 0 0 1 981.333333 149.376v42.581333A106.624 106.624 0 0 1 874.858667 298.666667H490.453333A106.517333 106.517333 0 0 1 384 191.957333V149.376z m85.333333 0v42.581333A21.184 21.184 0 0 0 490.474667 213.333333H874.88A21.290667 21.290667 0 0 0 896 191.957333V149.376A21.184 21.184 0 0 0 874.858667 128H490.453333A21.290667 21.290667 0 0 0 469.333333 149.376z m-85.333333 341.333333A106.624 106.624 0 0 1 490.474667 384H874.88A106.517333 106.517333 0 0 1 981.333333 490.709333v42.581334A106.624 106.624 0 0 1 874.858667 640H490.453333A106.517333 106.517333 0 0 1 384 533.290667v-42.581334z m85.333333 0v42.581334A21.184 21.184 0 0 0 490.474667 554.666667H874.88A21.290667 21.290667 0 0 0 896 533.290667v-42.581334A21.184 21.184 0 0 0 874.858667 469.333333H490.453333A21.290667 21.290667 0 0 0 469.333333 490.709333z m-85.333333 341.333334A106.624 106.624 0 0 1 490.474667 725.333333H874.88A106.517333 106.517333 0 0 1 981.333333 832.042667v42.581333A106.624 106.624 0 0 1 874.858667 981.333333H490.453333A106.517333 106.517333 0 0 1 384 874.624v-42.581333z m85.333333 0v42.581333A21.184 21.184 0 0 0 490.474667 896H874.88A21.290667 21.290667 0 0 0 896 874.624v-42.581333A21.184 21.184 0 0 0 874.858667 810.666667H490.453333A21.290667 21.290667 0 0 0 469.333333 832.042667z">\n                  </path>\n                </svg>\n              </span>\n              <div class="show-mode" style="display: none;">\n                <div class="show-mode-wrap">\n                  <div style="text-align: center">模式选择</div>\n                  <div class="button-mode-selects button-mode-wide"> \n                      <span class="button-mode-svg"> \n                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 896.2">\n                          <path d="M903.5,552.2c-73.2,0-121.4,60.4-120.5,120.5c-1.2,66.4,54.1,120.5,120.5,120.5s120.5-54,120.5-120.5\n                            S969.9,552.2,903.5,552.2z M903.5,766.5c-51.7,0-93.7-42-93.7-93.7c0-20.9,7-40.4,18.7-56L959.7,748\n                            C944,759.5,924.7,766.5,903.5,766.5z M978.5,728.7L847.3,597.5c15.5-11.8,35.1-18.7,56-18.7c51.7,0,93.7,42,93.7,93.7\n                            C997.3,693.9,990.3,713.2,978.5,728.7z"/>\n                          <path d="M832,87H192C86.7,87,0,149.8,0,226.2v371.3C0,674,86.7,736.8,192,736.8h572.1c-16.8-63.5,6.8-139.8,27.6-165.4\n                            c59.6-73.6,199.3-50.7,232.3,23.1V226.2C1024,149.8,937.3,87,832,87z M933.6,226.9l-2.9,262.9c-83.4-5.4-125,4-158.6,34.9\n                            c-34.8,32-53.7,80.6-57.7,148.1L192,673.1c-37.7,3.5-106.3-46.8-103.9-75.6l0.5-370.4c-5.6-46.6,70.3-78.1,104.9-76.9l0,0l637.8,0.5\n                            C870.9,148.8,938.2,199.5,933.6,226.9z"/>\n                          <path d="M817.3,409.6L672,312.2c-8.8-5.9-20.2-9.2-32-9.2c-26.5,0-48.3,16.6-48.3,36.8c0,10.5,5.9,20.6,16.3,27.5l105,70.2\n                            l-105,70.2c-10.2,6.9-16.1,16.9-16.1,27.3c0,20,21.7,36.5,48,36.5h0.1c11.8,0.1,23.2-3.2,32-9.3l145.3-97.4\n                            c10.4-6.9,16.4-17,16.4-27.5C833.7,426.6,827.7,416.6,817.3,409.6z"/>\n                          <path d="M449.6,339.7c0-20.2-21.8-36.8-48.3-36.8c-11.8,0-23.2,3.3-32,9.2L224,409.6c-10.4,6.9-16.4,17-16.4,27.5\n                            c0,10.5,6,20.6,16.4,27.5l145.3,97.4c8.8,6,20.2,9.3,32,9.3h0h0.1c26.3,0,48-16.5,48-36.5c0-10.4-5.9-20.4-16.1-27.3l-105-70.2\n                            l105-70.2C443.6,360.3,449.6,350.3,449.6,339.7z"/>\n                        </svg>\n                      </span>\n                      <span class="button-mode-svg svg-display" style="fill: #00a1d6;"> \n                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 896.2">\n                          <path d="M832,87H192C86.7,87,0,149.8,0,226.2v371.3C0,674,86.7,736.8,192,736.8h640c105.3,0,192-62.9,192-139.3V226.2\n                            C1024,149.8,937.3,87,832,87z M830.7,673.4L192,673.1c-37.7,3.5-106.3-46.8-103.9-75.6l0.5-370.4c-5.6-46.6,70.3-78.1,104.9-76.9\n                            l0,0l637.8,0.5c39.7-1.9,106.9,48.8,102.4,76.2l0,370.5C937.8,627.8,869.1,677.3,830.7,673.4z"/>\n                          <path d="M449.6,339.7c0-20.2-21.8-36.8-48.3-36.8c-11.8,0-23.2,3.3-32,9.2L224,409.6c-10.4,6.9-16.4,17-16.4,27.5\n                            c0,10.5,6,20.6,16.4,27.5l145.3,97.4c8.8,6,20.2,9.3,32,9.3h0h0.1c26.3,0,48-16.5,48-36.5c0-10.4-5.9-20.4-16.1-27.3l-105-70.2\n                            l105-70.2C443.6,360.3,449.6,350.3,449.6,339.7z"/>\n                          <path d="M817.3,409.6L672,312.2c-8.8-5.9-20.2-9.2-32-9.2c-26.5,0-48.3,16.6-48.3,36.8c0,10.5,5.9,20.6,16.3,27.5l105,70.2\n                            l-105,70.2c-10.2,6.9-16.1,16.9-16.1,27.3c0,20,21.7,36.5,48,36.5h0.1c11.8,0.1,23.2-3.2,32-9.3l145.3-97.4\n                            c10.4-6.9,16.4-17,16.4-27.5C833.7,426.6,827.7,416.6,817.3,409.6z"/>\n                        </svg>\n                      </span>\n                      <span class="button-mode-text">宽屏</span>\n                  </div>\n                  <div class="button-mode-selects button-mode-nodanmu"> \n                      <span class="button-mode-svg"> \n                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">\n                            <path d="M712.8,803.7H311.2C139.4,803.7,0,664.4,0,492.5c0-171.9,139.3-311.2,311.2-311.2h401.6c171.8,0,311.2,139.3,311.2,311.2\n                              c0,36.3,1,125.1-21.4,137.7c0,0-19.9-33.8-53-53.2c-46.2-21.8-121.1-36.2-184.1,44.1c-49.3,73.9-11.2,166.2,15.3,181.1 M330,773.5\n                              c148.3-4.5,267.7-123.9,272.2-272.2c4.9-161.5-128.2-294.6-289.7-289.7C164.2,216.1,44.8,335.5,40.3,483.8\n                              C35.4,645.2,168.5,778.4,330,773.5z"/>\n                            <path d="M289.8,571.9l49.6-7.4V550h25.4v37.6h-88.6l7,34.4h81.6v87.8l52.7-6V622h77.7l16.8-19.5l-29.7-37.6l-18,22.8h-46.9V550h25.4\n                              v13.5l48.8-7V417.2l13.7-16.7L462,361l-22.3,20h-7c21.9-22,41.4-45.4,58.6-70.2l-61.3-26c-14.8,39-30.8,71.1-48,96.2h-41.8\n                              l44.1-40.4c-28.1-28.8-48.4-46.8-60.9-53.9l-29.3,26c13.8,15.2,26.8,34.4,39,57.6l-43.3-6.1L289.8,571.9L289.8,571.9z M417.5,516.6\n                              v-36.2h25.4v36.2H417.5z M417.5,447.8V413h25.4v34.8H417.5z M364.8,447.8h-25.4V413h25.4V447.8z M339.4,516.6v-36.2h25.4v36.2H339.4\n                              z M208.2,420l0.4-1.9l-52.7-10.2c-4.7,38.4-10,84.6-16,138.4h54.7v-0.5h18.4l-1.6,78.5c-0.3,19.8-2.6,29.7-7,29.7\n                              c-15.4,0-28.6-1.9-39.8-5.6l-2,28.8c16.1,5.9,24.5,19.5,25,40.9h26.2c36.7,0,55.1-56.1,55.1-168.2l16.4-18.1l-46.9-45.5l-26.2,26\n                              h-13.7l6.2-58.5H218v19l54.3-8.4v-118l12.1-16.3L241,289.9l-23.8,23.7h-70.3l7.4,33.4H218V420L208.2,420L208.2,420z"/>\n                            <path d="M880.8,580.3c-73.2,0-121.4,60.4-120.5,120.5c-1.2,66.4,54.1,120.5,120.5,120.5s120.5-54.1,120.5-120.5\n                              S947.2,580.3,880.8,580.3L880.8,580.3z M880.8,794.5c-51.7,0-93.7-42-93.7-93.7c0-20.9,7-40.4,18.7-56L937,776\n                              C921.2,787.5,901.9,794.5,880.8,794.5z M955.8,756.7L824.5,625.5c15.5-11.8,35.1-18.7,56-18.7c51.7,0,93.7,42,93.7,93.7\n                              C974.5,721.9,967.5,741.2,955.8,756.7z"/>\n                          </svg>\n                      </span>\n                      <span class="button-mode-svg svg-display" style="fill: #00a1d6;"> \n                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">\n                          <path d="M311.2,803.7C139.4,803.7,0,664.4,0,492.5s139.3-311.2,311.2-311.2h401.6c171.8,0,311.2,139.3,311.2,311.2\n                            c0,111.5-137,311.2-305,311.2 M330,773.5c148.3-4.5,267.7-123.9,272.2-272.2c4.9-161.5-128.2-294.6-289.7-289.7\n                            C164.2,216.1,44.8,335.5,40.3,483.8C35.4,645.2,168.5,778.4,330,773.5z"/>\n                          <path d="M289.8,571.9l49.6-7.4V550h25.4v37.6h-88.6l7,34.4h81.6v87.8l52.7-6V622h77.7l16.8-19.5l-29.7-37.6l-18,22.8h-46.9V550h25.4\n                            v13.5l48.8-7V417.2l13.7-16.7L462,361l-22.3,20h-7c21.9-22,41.4-45.4,58.6-70.2l-61.3-26c-14.8,39-30.8,71.1-48,96.2h-41.8\n                            l44.1-40.4c-28.1-28.8-48.4-46.8-60.9-53.9l-29.3,26c13.8,15.2,26.8,34.4,39,57.6l-43.3-6.1L289.8,571.9L289.8,571.9z M417.5,516.6\n                            v-36.2h25.4v36.2H417.5z M417.5,447.8V413h25.4v34.8H417.5z M364.8,447.8h-25.4V413h25.4V447.8z M339.4,516.6v-36.2h25.4v36.2H339.4\n                            z M208.2,420l0.4-1.9l-52.7-10.2c-4.7,38.4-10,84.6-16,138.4h54.7v-0.5H213l-1.6,78.5c-0.3,19.8-2.6,29.7-7,29.7\n                            c-15.4,0-28.6-1.9-39.8-5.6l-2,28.8c16.1,5.9,24.5,19.5,25,40.9h26.2c36.7,0,55.1-56.1,55.1-168.2l16.4-18.1l-46.9-45.5l-26.2,26\n                            h-13.7l6.2-58.5H218v19l54.3-8.4v-118l12.1-16.3L241,289.9l-23.8,23.7h-70.3l7.4,33.4H218v73H208.2L208.2,420z"/>\n                          </svg>\n                      </span>\n                      <span class="button-mode-text">关弹幕</span>\n                  </div>\n                  <div class="button-mode-selects button-mode-dropdown"> \n                      <span class="button-mode-svg"> \n                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">\n                          <path d="M722.2,762.5c-73.2,0-121.4,60.4-120.5,120.5c-1.2,66.4,54.1,120.5,120.5,120.5s120.5-54,120.5-120.5\n                            S788.6,762.5,722.2,762.5z M722.2,976.8c-51.7,0-93.7-42-93.7-93.7c0-20.9,7-40.4,18.7-56l131.2,131.2\n                            C762.7,969.8,743.4,976.8,722.2,976.8z M797.2,939L666,807.8c15.5-11.8,35.1-18.7,56-18.7c51.7,0,93.7,42,93.7,93.7\n                            C816,904.2,809,923.5,797.2,939z"/>\n                          <path d="M442.4,376.3l16.4-18.1l-46.9-45.5l-26.2,26H372l6.2-58.5h13.3v19l54.3-8.4v-118l12.1-16.3l-43.3-40.4l-23.8,23.7h-70.3\n                            l7.4,33.4h63.6v73.2h-9.7l0.4-1.9l-52.7-10.2c-4.7,38.4-10,84.6-16,138.4h54.7v-0.5h18.3l-1.6,78.5c-0.3,19.8-2.6,29.7-7,29.7\n                            c-15.4,0-28.6-1.9-39.8-5.6l-2,28.8c16.1,5.9,24.5,19.5,25,40.9h26.2C424,544.5,442.4,488.4,442.4,376.3z"/>\n                          <path d="M513,376.4h25.4V414h-88.6l7,34.4h81.6v87.8l52.7-6v-81.8h77.7l16.8-19.5l-29.7-37.6l-18,22.8H591v-37.7h25.4v13.5l48.8-7\n                            V243.6l13.7-16.7l-43.3-39.5l-22.3,20h-7c21.9-22,41.4-45.4,58.6-70.2l-61.3-26c-14.8,39-30.8,71.1-48,96.2h-41.8l44.1-40.4\n                            c-28.1-28.8-48.4-46.8-60.9-53.9l-29.3,26c13.8,15.2,26.8,34.4,39,57.6l-43.3-6.1v207.7l49.6-7.4V376.4z M591.1,239.4h25.4v34.8\n                            h-25.4V239.4z M591.1,306.8h25.4V343h-25.4V306.8z M513,239.4h25.4v34.8H513V239.4z M513,306.8h25.4V343H513V306.8z"/>\n                          <polygon points="362.1,612.5 499.5,750.5 641.1,612.5 "/>\n                          <path d="M622.6,780c44.5-51.1,150.1-63.7,212.3,6l8.1-433.9c0-131.8-73.6-250.7-186.8-301.6l-42.1-18.9\n                            C542.4-0.7,462.1-2.3,389.4,27l-35.9,14.5C234.9,89.4,156.3,211.4,156.3,347.6l0,340.5c0,156,102.5,290.2,244.9,320.7l41.5,8.9\n                            c38.8,8.3,79.1,2.5,117.5,0.3l90.5-9.3C552.4,958.9,573.5,836.3,622.6,780z M563.1,989.4c-41.5,9.4-84.3,9.3-125.7-0.2l-3.2-0.7\n                            C293.6,956.4,193,823,193,668.6V367.1c0-134.2,76.3-254.8,192.5-304.1l0,0c72.9-30.9,154-30.5,226.6,1.2l9.2,4\n                            c114.7,50.1,189.7,169.9,189.7,302.9l0.8,351c-82.7-29.4-174.7-18-220.5,40.5c-42.7,54.5-55.6,131-22.1,225.5L563.1,989.4z"/>\n                        </svg>\n                      </span>\n                      <span class="button-mode-svg svg-display" style="fill: #00a1d6;"> \n                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">\n                          <path d="M681.6,44.3l-42.1-18.9c-71.6-32.2-152-33.8-224.7-4.5L379,35.4C260.3,83.3,181.8,205.3,181.8,341.5l0,340.5\n                              c0,156,102.5,290.2,244.9,320.7l41.5,8.9c38.8,8.3,78.7,8.4,117.5,0.3l36.5-7.6c143-29.9,246.3-164.5,246.3-321V346\n                              C868.4,214.2,794.8,95.3,681.6,44.3z M836.4,661.8c0,154.7-100.9,288.2-241.8,320l-6,1.4c-41.5,9.4-84.3,9.3-125.7-0.2l-3.2-0.7\n                              c-140.6-32.1-241.1-165.5-241.1-319.9V360.9c0-134.2,76.3-254.8,192.5-304.1l0,0c72.9-30.9,154-30.5,226.6,1.2l9.2,4\n                              c114.7,50.1,189.7,169.9,189.7,302.9V661.8z"/>\n                          <polygon points="525,750.5 666.6,612.5 387.6,612.5 "/>\n                          <path d="M663.4,414.1h-46.9v-37.7h25.4v13.5l48.8-7V243.6l13.7-16.7l-43.3-39.5l-22.3,20h-7c21.9-22,41.4-45.4,58.6-70.2l-61.3-26\n                              c-14.8,39-30.8,71.1-48,96.2h-41.8l44.1-40.4c-28.1-28.8-48.4-46.8-60.9-53.9l-29.3,26c13.8,15.2,26.8,34.4,39,57.6l-43.3-6.1v207.7\n                              l49.6-7.4v-14.5h25.4V414h-88.6l7,34.4h81.6v87.8l52.7-6v-81.8h77.7l16.8-19.5l-29.7-37.6L663.4,414.1z M616.6,239.4H642v34.8h-25.4\n                              V239.4z M616.6,306.8H642V343h-25.4V306.8z M563.9,343h-25.4v-36.2h25.4V343z M563.9,274.2h-25.4v-34.8h25.4V274.2z"/>\n                          <path d="M467.9,376.3l16.4-18.1l-46.9-45.5l-26.2,26h-13.7l6.2-58.5H417v19l54.3-8.4v-118l12.1-16.3l-43.3-40.4l-23.8,23.7H346\n                              l7.4,33.4H417v73.2h-9.7l0.4-1.9L355,234.3c-4.7,38.4-10,84.6-16,138.4h54.7v-0.5H412l-1.6,78.5c-0.3,19.8-2.6,29.7-7,29.7\n                              c-15.4,0-28.6-1.9-39.8-5.6l-2,28.8c16.1,5.9,24.5,19.5,25,40.9h26.2C449.5,544.5,467.9,488.4,467.9,376.3z"/>\n                      </svg>\n                      </span>\n                      <span class="button-mode-text">下拉</span>\n                  </div>\n                </div>  \n                <div class="show-mode-bridge"></div>\n              </div>', 
                    root.prepend(button_mode, button_pic, button_screen, button_next, button_pre));
                })(), handleEvents(root), (settings => {
                    let button_mode;
                    button_mode = root.querySelector(".button-mode"), settings.MODE_WIDE && modeWide(button_mode.querySelector(".button-mode-wide"), !1), 
                    settings.MODE_DANMU_CLOSE && modeNoDanmaku(button_mode.querySelector(".button-mode-nodanmu"), !1), 
                    settings.MODE_DOWN && modeDown(button_mode.querySelector(".button-mode-dropdown"), !1);
                })(user_settings), new MutationObserver(() => {
                    counter = 0, setTimeout(main, 100);
                }).observe(document.querySelector(".bilibili-player-video"), {
                    childList: !0
                }); else {
                    if (++counter > 30) return;
                    setTimeout(main, 300);
                }
            };
            main();
        },
        setup: function() {
            let css_holder, holder;
            (css_holder = document.createElement("style")).type = "text/css", css_holder.innerHTML = ".show-mode {\n            display: flex;\n            flex-direction: column;\n            align-items: center;\n            position: absolute;\n            z-index: 71;\n            bottom: 46px;\n            left: -40px;\n            background-color: rgba(0, 0, 0, 0.8);\n            font-size: 12px;\n            padding: 5px 15px;\n            color: hsla(0,0%,100%,.8);\n            fill: hsla(0,0%,100%,.8);\n            cursor: auto;\n          }\n          \n          .mode-fullscreen .show-mode {\n            left: -30px;\n          }\n          .mode-fullscreen .show-mode .show-mode-bridge {\n            position: absolute;\n            left: 0;\n            height: 25px;\n            width: 110px;\n          }\n         \n          .button-mode-selects {\n            width: 100%;\n            height: 46px;\n            cursor: pointer;\n            text-align: left;\n          }\n          \n          .button-mode-selects.opened {\n            fill:#00a1d6; \n          }\n          \n          .button-mode-selects:hover {\n            color: hsla(0,0%,100%,1);\n            fill: hsla(0,0%,100%,1);\n          }\n          .button-mode-selects.opened:hover {\n            color: hsla(0,0%,100%,1);\n            fill:#00a1d6; \n          }\n          \n          .button-mode-svg {\n            display: inline-block;\n            font-size: 0;\n            vertical-align: middle;\n            height: 32px;\n            width: 32px;\n          }\n          \n          .bp-svgicon svg {\n            width: 100%;\n            height: 100%;\n          }\n          \n          .button-mode-text {\n            display: inline-block;\n            height: 16px;\n            line-height: 16px;\n            padding-left: 10px;\n          }\n          \n          .svg-display {\n            display: none;\n          }", 
            (holder = document.createElement("script")).textContent = `(${this.inject}(${this.is_userscript}))`, 
            document.head.appendChild(css_holder), document.documentElement.appendChild(holder);
        },
        conveyMeassge: function() {
            let data_key, gate, sets, observe, default_settings;
            data_key = "localsettings", gate = document.documentElement, default_settings = {
                MODE_WIDE: !1,
                MODE_DANMU_CLOSE: !1,
                MODE_DOWN: !1
            }, (sets = JSON.parse(gate.dataset.localsettings || null)) || (gate.dataset.localsettings = JSON.stringify(this.GM_getValue(this.data, default_settings))), 
            (observe = new MutationObserver(() => {
                this.GM_setValue(this.data, JSON.parse(gate.dataset.localsettings || null));
            })).observe(gate, {
                attributes: !0,
                attributeFilter: [ "data-localsettings" ]
            });
        },
        ini: function() {
            this.is_userscript = "object" == typeof GM_info, this.data = "userSettings", this.GM_setValue = GM_setValue, 
            this.GM_getValue = GM_getValue, this.conveyMeassge(), this.setup();
        }
    }).ini();
} ]);
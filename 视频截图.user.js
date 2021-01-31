// ==UserScript==
// @name:cn-ZH       视频截图
// @name:en         videoCapture

// @namespace    http://tampermonkey.net/
// @version       0.1
// @description  视频原始尺寸截图, 支持各大视频站, 支持快捷键 (Alt+K) 连续截屏和按钮动效截屏.
// @author       Finn
// @run-at       document-start
// @match        https://www.bilibili.com/video/BV*
// @grant        GM_openInTab
// ==/UserScript==

(function () {
    'use strict';
    // Your code here...
    //外链直达, 新页面打开
    document.addEventListener("DOMContentLoaded", function () {

        const v = document.querySelector("video");
        //v.offset.left
        console.log("视频截图", v)
        console.log("视频截图", v.offsetLeft, v.offsetHeight, v.offsetWidth);

        document.onkeydown = function (e) {
            console.log(334, e)
            if (e.altKey && (e.key == "k")) {
                console.log("ALT+K 快捷键")
                makeCapture()
            }
        }

        function makeCapture() {
            //视频截图
            let canvas = document.createElement("canvas");
            //canvas.imageSmoothingEnabled = false;
            canvas.width = v.videoWidth;
            canvas.height = v.videoHeight;
            canvas.getContext("2d").drawImage(v, 0, 0, v.videoWidth, v.videoHeight);

            const img = document.createElement("img");
            img.setAttribute("id", "downloadImg");
            img.setAttribute("src", canvas.toDataURL("image/png", 1));

            console.log(img);

            console.log(document.styleSheets[0].cssRules);
            GM_openInTab(canvas.toDataURL("image/png", 1))

        }

    })

})();
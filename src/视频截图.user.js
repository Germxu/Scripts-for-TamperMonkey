// ==UserScript==
// @name:cn-ZH   视频截图
// @name:en      videoCapture
// @author       Finn
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  视频原始尺寸截图, 支持各大视频站, 支持快捷键 (Alt+K) 连续截屏和按钮动效截屏.
// @run-at       document-start
// @match        https://*/*
// @grant        GM_openInTab
// ==/UserScript==

(function () {
    'use strict';

    document.addEventListener("DOMContentLoaded", function () {

        const v = document.querySelector("video");
        //v.offset.left
        let vs = document.querySelectorAll("video").length;
        console.log("dom完成", vs);
        if (vs === 0) {     //沒有video存在, 开启监听Observe

            let observer = new MutationObserver(function (mutations) {
                //console.log("mutations",mutations);
                let v = document.querySelector("video");
                if(v){
                    observer.disconnect()
                    console.log('Observe Video', v);
                   console.log("视频截图", v.offsetLeft, v.offsetHeight, v.offsetWidth);

                }

            })

            let obTarget = document.querySelector("body");
            let obConfig = {
                childList: true,
                subtree: true
            }
            observer.observe(obTarget, obConfig);
        } else if (vs === 1) {  //一个video
            console.log("视频截图", vs.offsetLeft, vs.offsetHeight, vs.offsetWidth);

        } else { //video不只有一个, 另行考虑

        }









        document.onkeydown = function (e) {  //快捷键
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
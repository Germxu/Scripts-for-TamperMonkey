// ==UserScript==
// @name:cn-ZH   视频截图
// @name:en      videoCapture
// @author       Finn
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  视频原始尺寸截图, 支持各大视频站, 支持快捷键 (Alt+K) 连续截屏和按钮动效截屏.
// @run-at       document-end
// @match        https://*/*
// @grant        GM_openInTab
// ==/UserScript==

(function () {
    'use strict';

    const vi = document.querySelector("video");
    if (!vi) {
        console.log('初始化无video');

        let obConfig = {
            childList: true,
            subtree: true
        }
        let obTarget = document.querySelector("body");
        observer.observe(obTarget, obConfig);

        let observer = new MutationObserver(function (mutations) {
            console.log("mutations", mutations);
            let v = document.querySelector("video");
            if (v) {
                observer.disconnect()
                console.log('Observe Video', v);
                console.log("视频observer成功", v.offsetLeft, v.offsetHeight, v.offsetWidth);
                setBtn(v)
            }
        })
    } else {
        console.log('初始化有video');
        setBtn(vi)
    }


    function setBtn(v) {
        const vRect = v.parentNode.getBoundingClientRect();
        const p = v.parentNode;
        console.log("dom完成", p);
        const pstyle = window.getComputedStyle(p); //获取容器真实占领区域. margin填充
        const pTop = + pstyle.marginTop.replace("px", "");
        const pRight = + pstyle.marginRight.replace("px", "");
        console.log('p', vRect, pTop);

        const b = `<style>#FinnTop{width:32px;height:32px;background:#64b5f6;position:absolute;z-index:999;top:${vRect.top - pTop + 40}px;left:${vRect.right + pRight - 70}px}</style><div id="FinnTop"><svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8563" width="32" height="32"><path d="M901.12 227.328h-96.256c-12.288 0-23.552-7.168-27.648-19.456l-20.48-49.152c-10.24-26.624-36.864-45.056-66.56-45.056H333.824c-28.672 0-54.272 17.408-66.56 44.032l-20.48 50.176c-5.12 12.288-15.36 19.456-28.672 19.456H122.88c-39.936 0-71.68 31.744-71.68 71.68V839.68c0 39.936 31.744 71.68 71.68 71.68h778.24c39.936 0 71.68-31.744 71.68-71.68V299.008c0-39.936-31.744-71.68-71.68-71.68zM931.84 839.68c0 17.408-13.312 30.72-30.72 30.72H122.88c-17.408 0-30.72-13.312-30.72-30.72V299.008c0-17.408 13.312-30.72 30.72-30.72h96.256c28.672 0 54.272-17.408 65.536-44.032l20.48-50.176c5.12-12.288 15.36-19.456 28.672-19.456h356.352c12.288 0 23.552 7.168 27.648 19.456l20.48 50.176c11.264 26.624 36.864 44.032 65.536 44.032H901.12c17.408 0 30.72 13.312 30.72 30.72V839.68zM512 337.92c-123.904 0-225.28 101.376-225.28 225.28s101.376 225.28 225.28 225.28 225.28-101.376 225.28-225.28-101.376-225.28-225.28-225.28z m0 409.6c-101.376 0-184.32-82.944-184.32-184.32s82.944-184.32 184.32-184.32 184.32 82.944 184.32 184.32-82.944 184.32-184.32 184.32zM245.76 384c0 25.6-20.48 46.08-46.08 46.08S153.6 409.6 153.6 384s20.48-46.08 46.08-46.08 46.08 20.48 46.08 46.08z" p-id="8564"></path></svg></div>`;
        p.insertAdjacentHTML('afterbegin', b);

        document.getElementById("FinnTop").onclick = function () {
            console.log("cap")
            makeCapture()
        }

        document.onkeydown = function (e) {  //快捷键
            console.log(334, e)
            if (e.altKey && (e.key == "k")) {
                console.log("ALT+K 快捷键")
                makeCapture()
            }
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

        img.style.left = vleft + "px";
        img.style.top = vtop + "px";
        img.style.width = playarea.offsetWidth + "px";
        img.style.height = playarea.offsetHeight + "px";

        // console.log(img);

        //console.log(document.styleSheets[0].cssRules);
        GM_openInTab(img, 1)

    }


})();

// >#FinnTop{width:32px;height:32px;background:#64b5f6;position:absolute;z-index:999;top:${ vRect.top - pTop + 40}px;left:${vRect.right + pRight - 70}px}


/*   if (vs === 0) {     //沒有video存在, 开启监听Observe

      let observer = new MutationObserver(function (mutations) {
          //console.log("mutations",mutations);
          let v = document.querySelector("video");
          if (v) {
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

  } */


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




    const v = document.querySelector("video");
    if (v) {
        const vRect = v.parentNode.getBoundingClientRect();
        const p = v.parentNode;
        //console.log("dom完成", p);
        const pstyle=window.getComputedStyle(p); //获取容器真实占领区域. margin填充
        const pTop = + pstyle.marginTop.replace("px","");
        const pRight =+ pstyle.marginRight.replace("px","");
        console.log('p',vRect, pTop);

        const b = `<style id="finStyle">#FinnTop{width:32px;height:32px;position:absolute;z-index:999999;top:${ 30 }px;right:${ 40}px;cursor:pointer;}#downloadImg{position: fixed;
            z-index: 999;
            box-shadow: 0 0 50px rgba(39, 38, 38, 0.561);
            transform: scale(0.95);
            box-sizing: border-box;
            border: #fff 20px ridge;}
img.fly {
/* transition: all 0.3s 0.4s; */
/* animation: fly 0.7s cubic-bezier(0.6, -0.28, 0.735, 0.045) 0.2s forwards; */
animation: fly 0.7s cubic-bezier(0.02, 0.34, 1, 0.74) 0.7s forwards;
}
</style><div id="FinnTop"><svg viewBox="0 0 1024 1024" fill="#fff" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8563" width="32" height="32"><path d="M901.12 227.328h-96.256c-12.288 0-23.552-7.168-27.648-19.456l-20.48-49.152c-10.24-26.624-36.864-45.056-66.56-45.056H333.824c-28.672 0-54.272 17.408-66.56 44.032l-20.48 50.176c-5.12 12.288-15.36 19.456-28.672 19.456H122.88c-39.936 0-71.68 31.744-71.68 71.68V839.68c0 39.936 31.744 71.68 71.68 71.68h778.24c39.936 0 71.68-31.744 71.68-71.68V299.008c0-39.936-31.744-71.68-71.68-71.68zM931.84 839.68c0 17.408-13.312 30.72-30.72 30.72H122.88c-17.408 0-30.72-13.312-30.72-30.72V299.008c0-17.408 13.312-30.72 30.72-30.72h96.256c28.672 0 54.272-17.408 65.536-44.032l20.48-50.176c5.12-12.288 15.36-19.456 28.672-19.456h356.352c12.288 0 23.552 7.168 27.648 19.456l20.48 50.176c11.264 26.624 36.864 44.032 65.536 44.032H901.12c17.408 0 30.72 13.312 30.72 30.72V839.68zM512 337.92c-123.904 0-225.28 101.376-225.28 225.28s101.376 225.28 225.28 225.28 225.28-101.376 225.28-225.28-101.376-225.28-225.28-225.28z m0 409.6c-101.376 0-184.32-82.944-184.32-184.32s82.944-184.32 184.32-184.32 184.32 82.944 184.32 184.32-82.944 184.32-184.32 184.32zM245.76 384c0 25.6-20.48 46.08-46.08 46.08S153.6 409.6 153.6 384s20.48-46.08 46.08-46.08 46.08 20.48 46.08 46.08z" p-id="8564"></path></svg></div>`;

         const fullwrap = document.querySelector("#bilibiliPlayer");
        fullwrap.insertAdjacentHTML('afterbegin', b);

        document.getElementById("FinnTop").onclick=function(e){
            console.log("cap")
            makeCapture();
           // e.preventDefault();
          // e.stopPropagation();
        }

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
        let playarea = document.querySelector("video");//点击播放区域
        const videoArea = playarea.getBoundingClientRect();
        canvas.width = playarea.videoWidth;
        canvas.height = playarea.videoHeight;
        canvas.getContext("2d").drawImage(v, 0, 0, playarea.videoWidth, playarea.videoHeight);
        const imgData = canvas.toDataURL("image/png", 1);

        const img = document.createElement("img");
        img.setAttribute("id", "downloadImg");
        img.setAttribute("src", imgData);
        img.style.left = videoArea.x + "px";
        img.style.top = videoArea.y + "px";
        img.style.width = playarea.offsetWidth + "px";
        img.style.height = playarea.offsetHeight + "px";
        document.body.insertAdjacentElement("beforeend", img);


        const flyKeyFrameR =

            `@keyframes fly {
            from{
                left: ${videoArea.x}px;
                top: ${videoArea.y}px;
                width:${playarea.offsetWidth}px;
                height:${playarea.offsetHeight}px;
            }
            to{
                width:150px;
                height: ${150 * playarea.offsetHeight / playarea.offsetWidth}px;
                left: calc(100% - 180px);
                top: calc(100% - ${150 * playarea.offsetHeight / playarea.offsetWidth}px - 30px);
                border-width:0;
            }
        }`;
        const flyKeyFrameL =
            `@keyframes fly {
            from{
                left: ${videoArea.x}px;
                top: ${videoArea.y}px;
                width:${playarea.offsetWidth}px;
                height:${playarea.offsetHeight}px;
            }
            to{
                width:150px;
                height: ${150 * playarea.offsetHeight / playarea.offsetWidth}px;
                left: 30px;
                top: calc(100% - ${150 * playarea.offsetHeight / playarea.offsetWidth}px - 30px);
                border-width:0;
            }
        }`;
        document.querySelector("#finStyle").insertAdjacentHTML('beforeend', flyKeyFrameL);

         img.classList.add("fly");



         const aimg = document.createElement("a");
        const  imgName = document.querySelector("h1 .tit").textContent||"视频截屏";
        aimg.setAttribute("id", "downloadCapture");
        aimg.setAttribute("download", imgName+".png");
        // aimg.appendChild(document.createTextNode("点击下载"))
        aimg.setAttribute("href", imgData);
        // playarea.parentNode.appendChild(aimg);
        document.body.insertAdjacentElement("beforeend", aimg);
       // console.log(imgData);
setTimeout(function () {
            const nodea = document.getElementById("downloadCapture");
            const nodeimg = document.getElementById("downloadImg");
            nodea.click();
            document.body.removeChild(nodeimg);
            document.body.removeChild(nodea);
           // nodea.parentNode.removeChild(nodea);
            // nodea.insertAdjacentElement("afterend", aimg);

           // canCapture = !canCapture;
        }, 2500)



      // GM_openInTab(imgData,1)

    }


})();




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


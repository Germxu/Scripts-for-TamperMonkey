// ==UserScript==
// @name         Bilibili FullScreen Progressbar
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  B站 活动标签页自动播放, 更大全屏按钮, 视频进度条等增强功能
// @author       Finn
// @match        https://www.bilibili.com/video/*
// @grant        none
// @license      MIT
// ==/UserScript==

(function () {

    'use strict';
    var set = localStorage.getItem("bilibili_player_settings");
    console.log("数据查看", set)

    const initStyle = `<style id="FinnStyle">
                        /*全屏控制区域*/
                        #finnDrag{position:absolute;left:50%;top:30%;
                        margin-left:calc(-15%);z-index:1000;
                        background:#ffffff5e;width:30%;height:30%;
                        transition:all 0.2s;cursor:se-resize;opacity:1;}
                        #finnDrag:hover{opacity:1}
                        #finnDrag svg{position:absolute;inset:0;margin:auto;width:100%;height:88%;}
                        /*添加进度条*/
                        #finnProgress{--rule: 1.7vmax; position:absolute;left:var(--rule);top:var(--rule);z-index:1000;
                        background:conic-gradient(transparent 100%,#cccccc57 0%);
                        width:calc(var(--rule) + 3%); height:0;padding-bottom:calc(var(--rule) + 3%); border-radius:50%;
                        text-align:center;color:#eeeeeea8;font-size:15px;line-height:100px;
                        box-shadow:0 0 20px #bfbfbf21;}</style>
                      `;
    document.documentElement.insertAdjacentHTML("afterbegin", initStyle);

    window.addEventListener("DOMContentLoaded", function () {

        //get Button
        const player = document.querySelector("#playerWrap");



        let observer = new MutationObserver(function (mutations) {
            console.log("mutations", mutations);
            //let btn = player.querySelector(".bilibili-player-iconfont-fullscreen-off");//全屏按钮🔘
            let btn = player.querySelector(".bilibili-player-iconfont-web-fullscreen-off");//网页全屏按钮🔘
            const fullwrap = document.querySelector("#bilibiliPlayer");
            const totalTime = document.querySelector(".bilibili-player-video-time-total");
            console.log(totalTime);

            if (btn) {
                btn.setAttribute("id", "finnFor");
                //btn.click();//原生click()事件只支持有默认点击行为的元素;
                observer.disconnect();
            }

            //如果当前标签页active, 自动播放
            /*let tabhidden = document.hidden;
            // if (!tabhidden) {
                let playarea = document.querySelector("#playerWrap video");//点击播放区域
                // playarea.click();*/
            setTimeout(function () {
                /* var e = document.createEvent("MouseEvents");
                e.initEvent("click", true, true);
                playarea.dispatchEvent(e); */

                //添加全屏按钮

                const fullBtn = `<label for="finnFor" id="finnDrag"></label>`
                //fullBtn.addEventListener("click", function (e) { console.log("fullBtn click 点击"), e.stopPropagation() })
                fullwrap.insertAdjacentHTML("afterbegin", fullBtn);

                //添加进度条
                let progress = `<div id="finnProgress">${totalTime.textContent}</div>`;
                fullwrap.insertAdjacentHTML("afterbegin", progress);
                //进度条
                progressBar();
            }, 500)
        })
        let obConfig = {
            childList: true,
            subtree: true
        }
        observer.observe(player, obConfig);

        function progressBar() {
            let bar = document.querySelector("#finnProgress");
            console.log(bar)
            let barStatus = setInterval(function () {
                if (!bar) {
                    console.log("不存在进度条")
                } else {
                    console.log("存在进度条");
                    //progress.onmouseenter=function(){}
                    let p = +document.querySelector(".bilibili-player-drag-mask-progress-tempo").style.transform.replace(/[^.0-9]/ig, "");//获取当前进度值
                    bar.style.background = `conic-gradient(transparent ${p * 100}%,#ffffff47 0% )`;

                    if (p == 1) { clearInterval(barStatus) };
                }
            }, 500);

        }
    })

})();
// ==UserScript==
// @name         Bilibili autoPlay and Easy FullScreen
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  B站 活动标签页自动播放, 更大全屏按钮, 视频进度条等增强功能
// @author       Finn
// @match        https://www.bilibili.com/video/*
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    
// @require      https://s3.pstatp.com/cdn/expire-1-M/jquery/3.1.0/jquery.slim.min.js
// @require      http://www.tmk.com/Bilibili20autoPlay%20and%20Easy%20FullScreen.user.js
    'use strict';
    //console.log($().jquery)
    var set = localStorage.getItem("bilibili_player_settings");
    console.log("数据查看",set)
    //get Button
    const player = document.querySelector("#playerWrap");

     let observer = new MutationObserver(function(mutations){
        //console.log("mutations",mutations);
        //let btn = player.querySelector(".bilibili-player-iconfont-fullscreen-off");//全屏按钮🔘
        let btn = player.querySelector(".bilibili-player-iconfont-web-fullscreen-off");//网页全屏按钮🔘

         if(btn){
             btn.setAttribute("id","finnFor");
             //btn.click();//原生click()事件只支持有默认点击行为的元素;
             observer.disconnect();
         }

         //如果当前标签页active, 自动播放
        let tabhidden=document.hidden;
        if(!tabhidden){
          let playarea = document.querySelector("#playerWrap video");//点击播放区域
             // playarea.click();
            setTimeout(function(){
                var e = document.createEvent("MouseEvents");
                e.initEvent("click", true, true);
                playarea.dispatchEvent(e);

                //添加全屏按钮
                const fullBtnStyle = `position:absolute;left:50%;top:30%;
                                      margin-left:calc(-15%);z-index:1000;
                                      background:#ffffff5e;width:30%;height:30%;
                                      transition:all 0.2s;border:2px dotted gold;
                                      opacity:0;cursor:se-resize;`;
                var fullBtn = document.createElement("label");
                //var textnode=document.createTextNode("点击全屏");
                var fullwrap=document.querySelector("#bilibiliPlayer");
                fullBtn.setAttribute("style",fullBtnStyle);
                fullBtn.setAttribute("for","finnFor");
                fullBtn.setAttribute("id","finnDrag");
                fullBtn.onmouseenter=function(){this.style.opacity="1"}
                fullBtn.onmouseleave=function(){this.style.opacity="0"}
                //fullBtn.addEventListener("click",function(e){e.stopPropagation()})
                //fullBtn.appendChild(textnode);
                fullwrap.appendChild(fullBtn);
                //dragFunc("finnDrag");


                //添加进度条
                const progressStyle = `position:absolute;left:50px;top:50px;z-index:1000;
                                        background:conic-gradient(transparent 100%,#cccccc57 0%);
                                        width:80px;height:80px;border-radius:50%;
                                        text-align:center;color:#eeeeeea8;font-size:15px;line-height:100px;
                                        box-shadow:0 0 20px #bfbfbf21`;
                let progress = document.createElement("div");
                let totalTime = document.querySelector(".bilibili-player-video-time-total").innerHTML;
                let timeText = document.createTextNode(totalTime);
                progress.setAttribute("style",progressStyle);
                progress.setAttribute("id", "finnProgress");
                progress.appendChild(timeText);
                fullwrap.appendChild(progress);
                //进度条
                progressBar();
            },1000)
        }

    })
    let obConfig ={
        childList:true,
        subtree:true
    }
    observer.observe(player,obConfig);

    //url动态监测
    window.addEventListener('popstate', function (event) {
        //(event.state);
        console.log("url变化",event);
        observer.observe(player,obConfig);
    });
window.addEventListener('hashchange',function(event){
   console.log("hash",event);
})
    document.addEventListener("click",function(e){
        let url = document.URL;
        console.log('click,url',url);

    })

    function progressBar(){
        let bar = document.querySelector("#finnProgress");
        console.log(bar)
        let barStatus = setInterval(function(){
            if(!bar){
                console.log("不存在进度条")

            }else{
                console.log("存在进度条");
                //progress.onmouseenter=function(){}
                let p = +document.querySelector(".bilibili-player-drag-mask-progress-tempo").style.transform.replace(/[^.0-9]/ig,"");//获取当前进度值
                bar.style.background=`conic-gradient(transparent ${ p*100 }%,#ffffff47 0% )`;

                if(p==1){clearInterval(barStatus)};
            }
         },500);

    }


})();
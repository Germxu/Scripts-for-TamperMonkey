// ==UserScript==
// @name         360 tableIns
// @description  360流量平台 CPC数据, 显示广告ID和昵称
// @version      0.6
// @author       Finn
// @namespace    http://tampermonkey.net/
// @match        https://ssp.360.cn/webmaster/adspace
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license      MIT
// ==/UserScript==

(function () {
    'use strict';

    const initStyle = `#wrap{min-width:1280px!important;}
                        .Finn{color:red!important;width:6%}
                        .mvgrid table tr:hover {background-color: #81d4fa;!important}
                        .mvgrid table tr th:nth-child(n+2),.mvgrid table tr td:nth-child(n+2)
                        {text-align:center!important}`;
    GM_addStyle(initStyle);

    let userData;
    getData();//get updated matches

    let table = document.querySelector(".mvgrid table");
    let trs = table.querySelectorAll("tr");
    table.querySelector("colgroup").remove();//delete colgroup

    const cpcth_nickth = `<th class="Finn">CPC</th><th class="Finn">广告位</th><th class="Finn">Showid</th>`;
    trs[0].childNodes[10].insertAdjacentHTML("beforebegin", cpcth_nickth);

    function render() {
        let trs = table.querySelectorAll("tr");
        let c = trs[1].querySelectorAll(".perIncomes").length;
        if (c > 0) return;

        for (let i = 1; i < trs.length; i++) {
            const a = trs[i].querySelectorAll("td")[9].textContent;
            const b = trs[i].querySelectorAll("td")[6].textContent;
            const c = trs[i].querySelectorAll("td")[0].textContent;
            let d;

            for (const t of userData) {
                if (c == t.adv_name) {
                    //console.log(t);
                    d = t;
                    break;
                }
            }

            let val = (a.slice(1).replace(",", "") / (b.replace(",", ""))).toFixed(3);
            val = isNaN(val) ? "- " : "¥ " + val;
            //昵称与showid
            const cpctd = `<td class="perIncomes">${val}</td><td title="${d && d.nick || ''}">${d && d.nick || '-'}</td><td title="${d && d.showid || ''}">${d && d.showid || '-'}</td>`;
            trs[i].childNodes[10].insertAdjacentHTML("beforebegin", cpctd);
        }
    }

    let observer = new MutationObserver(function (mutations) {
        //console.log("mutations",mutations);
        render();
    })
    let obTarget = document.querySelector("#adspaceList");
    let obConfig = {
        childList: true
    }
    observer.observe(obTarget, obConfig);

    function getData() {
        if (!sessionStorage.FinnData) {
            GM_xmlhttpRequest({
                method: "get",
                url: 'http://1.mini.eastday.com/json/data/adv_display.json',
                responseType: "json",
                onload: function (res) {
                    if (res.status === 200) {
                        // console.log("成功", res.response)
                        userData = res.response;
                        sessionStorage.FinnData = JSON.stringify(res.response);
                    } else {
                        console.log('失败', res)
                    }
                },
                onerror: function (err) {
                    console.log('error')
                    console.log(err)
                }
            });
        } else {
            userData = JSON.parse(sessionStorage.FinnData);
        }
    }

})();

/*
*
    var insertedNode = parentNode.insertBefore(newNode, referenceNode);
    insertedNode 被插入节点(newNode)
    parentNode 新插入节点的父节点
    newNode 用于插入的节点
    referenceNode newNode 将要插在这个节点之前
    如果 referenceNode 为 null 则 newNode 将被插入到子节点的末尾。
    ⚠️ referenceNode 引用节点不是可选参数——你必须显式传入一个 Node 或者 null。
*
*/
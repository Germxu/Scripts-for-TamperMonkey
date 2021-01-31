// ==UserScript==
// @name         360 tableIns
// @version      0.3
// @description  360流量平台 CPC数据, 显示广告ID和昵称
// @author       Finn
// @namespace    https://github.com/Germxu
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
                        .mvgrid table th:nth-child(1){width:8%}
                        .mvgrid table th:nth-child(7){width:6%}
                        .mvgrid table tr:hover {background-color: #81d4fa;!important}
                        .mvgrid table tr th:nth-child(n+2),.mvgrid table tr td:nth-child(n+2)
                        {text-align:center!important}`;
    GM_addStyle(initStyle);

    let userData;
    getData();//get updated matches

    let table = document.querySelector(".mvgrid table");
    let trs = table.querySelectorAll("tr");
    table.querySelector("colgroup").remove();//delete colgroup

    const cpcth = `<th class="Finn">CPC</th>`;
    const nickth = `<th class="Finn">昵称</th><th class="Finn">Showid</th>`;
    trs[0].childNodes[10].insertAdjacentHTML("beforebegin", cpcth);
    trs[0].childNodes[0].insertAdjacentHTML("afterend", nickth);

    function render() {
        let trs = table.querySelectorAll("tr");
        let c = trs[1].querySelectorAll(".perIncomes").length;
        if (c > 0) return;

        for (let i = 1; i < trs.length; i++) {
            const a = trs[i].querySelectorAll("td")[9].textContent;
            const b = trs[i].querySelectorAll("td")[6].textContent;
            const c = trs[i].querySelectorAll("td")[0].textContent;
            let d;

            for (const t of userData) {//match id
                if (c == t.adv_name) {
                    //console.log(t);
                    d = t;
                    break;
                }
            }

            let val = (a.slice(1).replace(",", "") / (b.replace(",", ""))).toFixed(2);
            val = isNaN(val) ? "- " : "¥ " + val;
            const cpctd = `<td class="perIncomes">${val}</td>`;
            trs[i].childNodes[10].insertAdjacentHTML("beforebegin", cpctd);

            //昵称与showid
            const nickDom = `<td title="${d && d.nick || ''}">${d && d.nick || '-'}</td>
                             <td title="${d && d.showid || ''}">${d && d.showid || '-'}</td>`;
            trs[i].childNodes[0].insertAdjacentHTML("afterend", nickDom);
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
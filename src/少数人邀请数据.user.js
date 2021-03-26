// ==UserScript==
// @name         少数人
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://xn--gmqz83awjh.me/user/invite
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const color=['#1e88e5','#00695c','#e91e63','#26a69a','#607d8b','##afb42b','#ec407a','#cddc39','#ff8a65','#283593'];
    let arr =[], total=0;
    const td = document.querySelectorAll(".table.table-md td:nth-child(2)")
    document.querySelector("table.table-striped.table-md").style.cssText ="text-align:center;color:#fff;";
    document.querySelector("table.table-striped.table-md tr").style.background ="#333";
   // console.log(td)
    td.forEach((item,i)=>{
         item.style.color= '#fff';
        const x =arr.indexOf (item.textContent);
       // console.log(i,item.textContent, x)
       if(x===-1){
           arr.push(item.textContent);
           total+=1;
            item.parentNode.style.backgroundColor= color[i];
       }else{
           item.parentNode.style.backgroundColor= color[x]
       }
    })
   // console.log(arr,total)
    setTimeout(()=>{alert(`共邀请了${total}人`)},1300)

})();
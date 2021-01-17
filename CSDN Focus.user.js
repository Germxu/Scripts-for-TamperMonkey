// ==UserScript==
// @name         CSDN Focus
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Finn
// @match       https://blog.csdn.net/*/article/*
// @grant       GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    const hideFucks =`
#csdn-toolbar,#blogColumnPayAdvert, .csdn-side-toolbar, aside, #dmp_ad_58, .recommend-box, .login-mark, #passportbox{
display:none!important;}
.d-flex{display:block!important}
main{width:100%!important; box-shadow: 0 0 50px #69808b78;}
#mainBox{margin:30px auto;width:1000px!important}
`
       GM_addStyle(hideFucks)
   // document.querySelector("body").insertAdjacentHTML("beforebegin",hideFucks);
    //document.querySelector(".d-flex").setAttribute("style","display:block!important");
})();
// ==UserScript==
// @name         B站评论区开盒
// @namespace    mscststs
// @version      1.02
// @description  B站评论区直接展示 ip 属地
// @author       mscststs
// @match        *://*.bilibili.com/*
// @exclude      *://member.bilibili.com*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @require https://greasyfork.org/scripts/38220-mscststs-tools/code/MSCSTSTS-TOOLS.js?version=713767
// @run-at       document-start
// @license      ISC
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448434/B%E7%AB%99%E8%AF%84%E8%AE%BA%E5%8C%BA%E5%BC%80%E7%9B%92.user.js
// @updateURL https://update.greasyfork.org/scripts/448434/B%E7%AB%99%E8%AF%84%E8%AE%BA%E5%8C%BA%E5%BC%80%E7%9B%92.meta.js
// ==/UserScript==



var utils = {
  uncurryThis: function uncurryThis(f) {
    return function () {
      return f.call.apply(f, arguments);
    };
  },
  curryThis: function curryThis(f) {
    return function () {
      var a = Array.prototype.slice.call(arguments);
      a.unshift(this);
      return f.apply(null, a);
    };
  },
  bindFn: function bindFn(fn, context) {
    var _args = Array.prototype.slice.call(arguments, 2);

    return function () {
      return fn.apply(context, _args.concat(Array.prototype.slice.call(arguments)));
    };
  },
  extend: function extend(child, parent) {
    for (var key in parent) {
      if (parent.hasOwnProperty(key)) child[key] = parent[key];
    }

    function ctor() {}

    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
    child.prototype.constructor = child;
    child.__super__ = parent.prototype;
    return child;
  },
  mixin: function mixin(dest) {
    var sources = Array.prototype.slice.call(arguments, 1);

    for (var i = 0; i < sources.length; i++) {
      var src = sources[i];

      for (var key in src) {
        if (!dest[key]) {
          dest[key] = src[key];
        }
      }
    }
  },
  distinctArray: function distinctArray(arr) {
    var newArray = [],
        dict = {},
        i = 0,
        item;

    for (; i < arr.length; i++) {
      item = arr[i];

      var key = item + ':' + _typeof(item);

      if (!dict[key]) {
        newArray.push(item);
        dict[key] = true;
      }
    }

    return newArray;
  },

  /*
   * 访问终端信息判断
   */
  browser: {
    version: function () {
      var u = navigator.userAgent,
          app = navigator.appVersion;
      return {
        //移动终端浏览器版本信息
        trident: /Trident/i.test(u),
        //IE内核
        presto: /Presto/i.test(u),
        //opera内核
        webKit: /AppleWebKit/i.test(u),
        //苹果、谷歌内核
        gecko: /Gecko/i.test(u) && !/KHTML/i.test(u),
        //火狐内核
        mobile: /AppleWebKit.*Mobile.*/i.test(u),
        //是否为移动终端
        ios: /\(i[^;]+;( U;)? CPU.+Mac OS X/i.test(u),
        //ios终端
        android: /Android/i.test(u) || /Linux/i.test(u),
        //android终端或者uc浏览器
        windowsphone: /Windows Phone/i.test(u),
        //Windows Phone
        iPhone: /iPhone/i.test(u),
        //是否为iPhone或者QQHD浏览器
        iPad: /iPad/i.test(u),
        //是否iPad
        MicroMessenger: /MicroMessenger/i.test(u),
        //是否为微信
        webApp: !/Safari/i.test(u),
        //是否web应该程序，没有头部与底部
        edge: /edge/i.test(u),
        weibo: /Weibo/i.test(u),
        uc: /UCBrowser/i.test(u),
        qq: /MQQBrowser/i.test(u),
        baidu: /Baidu/i.test(u),
        comicApp: /BiliComic|ComicWebView/i.test(u) //是否在漫画的app，或者漫画自己封装的webview

      };
    }(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase(),
    lteIE: function lteIE(ver) {
      return $.browser.msie && parseInt($.browser.version) <= ver;
    }
  },
  cookie: {
    get: function get(cookieName) {
      var theCookie = "" + document.cookie;
      var ind = theCookie.indexOf(cookieName + "=");
      if (ind == -1 || cookieName == "") return "";
      var ind1 = theCookie.indexOf(';', ind);
      if (ind1 == -1) ind1 = theCookie.length;
      return unescape(theCookie.substring(ind + cookieName.length + 1, ind1));
    },
    set: function set(name, value, days) {
      days = days !== undefined ? days : 365;
      var exp = new Date();
      exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
      document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + "; path=/; domain=.bilibili.com";
    },
    'delete': function _delete(name) {
      this.set(name, '', -1);
    }
  },
  readFromLocal: function readFromLocal(key) {
    if (this.localStorage._support) {
      return localStorage.getItem(key);
    } else {
      return this.cookie.get(key);
    }
  },
  saveToLocal: function saveToLocal(key, val, days) {
    if (this.localStorage._support) {
      return localStorage.setItem(key, val);
    } else {
      return this.cookie.set(key, val, days);
    }
  },
  localStorage: {
    _support: window.localStorage && typeof (window.localStorage) == 'object' ? true : false,
    getItem: function getItem(key) {
      if (this._support) {
        return window.localStorage.getItem(key);
      } else {
        return null;
      }
    },
    setItem: function setItem(key, value) {
      if (this._support) {
        window.localStorage.setItem(key, value);
      }
    },
    removeItem: function removeItem(key) {
      if (this.getItem(key)) {
        window.localStorage.removeItem(key);
      }
    }
  },
  unhtml: function unhtml(str, reg) {
    return str ? str.replace(reg || /[&<">'](?:(amp|lt|quot|gt|#39|nbsp|#\d+);)?/g, function (a, b) {
      if (b) {
        return a;
      } else {
        return {
          '<': '&lt;',
          '&': '&amp;',
          '"': '&quot;',
          '>': '&gt;',
          "'": '&apos;'
        }[a];
      }
    }) : '';
  },
  html: function html(str) {
    return str ? str.replace(/&((g|l|quo)t|amp|#39|nbsp);/g, function (m) {
      return {
        '&lt;': '<',
        '&amp;': '&',
        '&quot;': '"',
        '&gt;': '>',
        '&#39;': "'",
        '&nbsp;': ' '
      }[m];
    }) : '';
  },
  hashManage: {
    prependHash: '!',
    _change: function _change(key, value) {
      var hash = location.hash,
          hashArray,
          hashMap = {},
          hashString = '',
          index = 0;

      if (hash) {
        hash = hash.substring(1);

        if (this.prependHash) {
          hash = hash.replace(new RegExp('^' + this.prependHash.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&")), '');
        }
      }

      hashArray = hash.split('&');

      for (var i = 0; i < hashArray.length; i++) {
        var _k = hashArray[i].split('=')[0],
            _v = hashArray[i].split('=')[1];

        if (_k) {
          hashMap[_k] = decodeURIComponent(_v);
        }
      }

      if (_typeof(key) == 'object') {
        for (var j in key) {
          var _val = key[j];

          if (_val) {
            hashMap[j] = encodeURIComponent(_val);
          } else if (_val === false) {
            delete hashMap[j];
          }
        }
      } else {
        if (value) {
          hashMap[key] = encodeURIComponent(value);
        } else if (value === false) {
          delete hashMap[key];
        } else if (typeof key == 'undefined') {
          return hashMap;
        } else {
          return hashMap[key] || null;
        }
      }

      for (var k in hashMap) {
        if (index != 0) {
          hashString += '&';
        } else {
          hashString += this.prependHash;
        }

        hashString += k + '=' + hashMap[k];
        index++;
      }

      location.hash = hashString;
      return hashMap;
    },
    get: function get(key) {
      return this._change(key, null);
    },
    set: function set(key, value) {
      return this._change(key, value);
    },
    clear: function clear() {
      location.hash = '';
    }
  },
  getColor16: function getColor16(rgb) {
    function _to16(d) {
      var color = parseInt(d).toString(16);
      return color.length == 1 ? "0" + color : color;
    }

    function _parse(array) {
      var value = "#";

      for (var i = 0; i < 3; i++) {
        value += _to16(array[i]);
      }

      return value;
    }

    var result = "";
    var rgbArray = [];

    if (rgb.match(/\((.*)\)/) != null) {
      rgbArray = rgb.match(/\((.*)\)/)[1].split(",");
      result = _parse(rgbArray);
    } else if (rgb.match(/,+/g) != null) {
      rgbArray = rgb.split(",");
      result = _parse(rgbArray);
    } else {
      result = _to16(rgb);
    }

    return result;
  },
  serializeParam: function serializeParam(json) {
    var strArr = [];

    for (var i in json) {
      if (!(_typeof(json[i]).toLowerCase() == "function" || _typeof(json[i]).toLowerCase() == "object")) {
        strArr.push(encodeURIComponent(i) + "=" + encodeURIComponent(json[i]));
      } else if ($.isArray(json[i])) {
        //支持传数组内容
        for (var j = 0; j < json[i].length; j++) {
          strArr.push(encodeURIComponent(i) + "[]=" + encodeURIComponent(json[i][j]));
        }
      }
    }

    return strArr.join("&");
  },
  query2json: function query2json(query) {
    if ($.isPlainObject(query)) {
      return query;
    }

    if (query === undefined) {
      return {};
    }

    var q = query.split("&"),
        j = {};

    for (var i = 0; i < q.length; i++) {
      var arr = q[i].split('=');
      j[arr[0]] = arr[1];
    }

    return j;
  },
  hash2json: function hash2json() {
    if (window.location.href.split('#').length > 1) {
      return this.query2json(window.location.href.split('#')[1].split('?')[0].replace(/#/, ""));
    } else {
      return {};
    }
  },
  query: {
    get: function get(key) {
      var queryJson = utils.query2json(this._getQuery());

      if (key) {
        return queryJson[key];
      } else {
        return queryJson;
      }
    },
    set: function set(key, value) {
      var queryJson = utils.query2json(this._getQuery());
      var hashJson = utils.hash2json();

      if (_typeof(key) == 'object') {
        for (var k in key) {
          this._set(queryJson, k, key[k]);
        }
      } else {
        this._set(queryJson, key, value);
      }

      return utils.makeUrl('', queryJson, hashJson);
    },
    _set: function _set(json, key, value) {
      if (value === null) {
        delete json[key];
      } else {
        json[key] = value;
      }

      return json;
    },
    _getQuery: function _getQuery() {
      if (window.location.search !== undefined) {
        return window.location.search.substring(1);
      } else {
        return window.location.href.split('?')[1] ? window.location.href.split('?')[1].split('#')[0] : '';
      }
    }
  },
  makeUrl: function makeUrl(url, queryJson, hashJson) {
    var query = this.serializeParam(queryJson),
        hash = this.serializeParam(hashJson),
        _url;

    if (query) {
      _url = (url || location.pathname) + '?' + query;
    } else {
      _url = url || location.pathname;
    }

    if (hash) {
      _url = _url + '#' + hash;
    }

    return _url;
  },
  formatNum: function formatNum(num, unit) {
    if (num === undefined || typeof num == 'string' && isNaN(parseInt(num))) return '--';
    var unitMap = {
      '万': 10000
    },
        defaultUnit = '万';
    unit = typeof unit == 'string' ? unit : defaultUnit;
    var factor = unitMap[unit] || unitMap[defaultUnit];
    if (typeof num == 'string' && num.indexOf(unit) >= 0) return;

    if (typeof num == 'string' && num.indexOf(",") >= 0) {
      var nums = num.split(",");
      var total = "";

      for (var i = 0; i < nums.length; i++) {
        total += nums[i];
      }

      num = total;
    }

    num = parseInt(num);

    if (num >= factor) {
      num = (num / factor).toFixed(1) + unit;
    }

    return num;
  },
  parseCardProps: function parseCardProps(dataItem, type) {
    var props = {
      'data-gk': dataItem.play,
      'data-sc': dataItem.favorites,
      'data-pl': dataItem.review,
      'data-dm': dataItem.video_review,
      'data-up': dataItem.author,
      'data-subtitle': dataItem.subtitle,
      'data-lm': dataItem.typename || '',
      'data-tg': dataItem.created ? new Date(dataItem.created * 1000).format('yyyy-MM-dd hh:mm') : dataItem.create || dataItem.created_at,
      'data-txt': dataItem.description,
      'data-yb': dataItem.coins
    },
        str = "";

    if (type == 'string') {
      for (var k in props) {
        if (str != "") {
          str += " ";
        }

        str += k + '="' + props[k] + '"';
      }

      return str;
    } else {
      return props;
    }
  },
  newParseCardProps: function newParseCardProps(dataItem, type) {
    var props = {
      'data-gk': dataItem.stat.view,
      'data-sc': dataItem.stat.favorite,
      'data-pl': dataItem.stat.reply,
      'data-dm': dataItem.stat.danmaku,
      'data-up': dataItem.owner.name,
      'data-lm': dataItem.tname || '',
      'data-tg': new Date(dataItem.pubdate * 1000).format('yyyy-MM-dd hh:mm'),
      'data-txt': dataItem.desc,
      'data-yb': dataItem.stat.coin
    };
    return props;
  },
  // protocol-relative 为了兼容ie8以下
  protocolRelative: function protocolRelative(url) {
    if (/http:|https:/.test(url)) {
      return url.replace(/http:|https:/, window.location.protocol);
    } else if ($.browser.msie && parseInt($.browser.version) <= 8) {
      return window.location.protocol + url;
    } else {
      return url;
    }
  },
  formatDuration: function formatDuration(duration, isToHour, minHeadBits) {
    if (typeof duration !== 'number') {
      return duration;
    }

    minHeadBits = minHeadBits || -1;
    var second = this.toFixed(duration % 60, 2);
    var minute = isToHour ? this.toFixed(Math.floor(duration % 3600 / 60), 2) : this.toFixed(Math.floor(duration / 60), minHeadBits);
    var hour = isToHour ? this.toFixed(Math.floor(duration / 3600), minHeadBits) : null;
    return hour === null ? [minute, second].join(':') : [hour, minute, second].join(':');
  },
  isObject: function isObject(obj) {
    return _typeof(obj) === 'object' && obj !== null;
  },
  isNothing: function isNothing(obj) {
    return obj == null; // Only deal with null/undefined values
  },
  isUndefined: function isUndefined(obj) {
    return typeof obj === 'undefined';
  },
  join: function join() {
    return Array.prototype.join.call(arguments, '');
  },
  random: function random(start, end) {
    if (this.isNothing(end)) {
      end = start;
      start = 0;
    }

    return Math.floor(Math.random() * (end - start + 1)) + start;
  },
  debounce: function debounce(func, delay, isImmediate) {
    var timeout;

    function debounced() {
      clearTimeout(timeout);

      if (isImmediate && utils.isNothing(timeout)) {
        func();
      }

      timeout = setTimeout(func, delay || 100);
    }

    debounced.clearNext = function () {
      clearTimeout(timeout);
    };

    return debounced;
  },
  throttle: function throttle(func, delay, options) {
    var timeout,
        prev = 0;
    delay = delay || 200;
    options = options || {};

    function later() {
      prev = options.head ? 0 : new Date().getTime();
      timeout = null;
      func();
    }

    function throttled() {
      var remain,
          now = new Date().getTime();

      if (!prev && options.head) {
        prev = now;
      }

      remain = delay - (now - prev);

      if (remain <= 0 || remain > delay) {
        clearTimeout(timeout);
        timeout = null;
        prev = now;
        func();
      } else if (!timeout && !options.tail) {
        timeout = setTimeout(later, remain);
      }
    }

    throttled.clearNext = function () {
      clearTimeout(timeout);
      timeout = null;
      prev = 0;
    };

    return throttled;
  },
  toFixed: function toFixed(data, bits) {
    if (typeof data !== 'number' && typeof data !== 'string') {
      return data;
    }

    data = String(data);
    bits = Number(bits) || 2;

    while (data.length < bits) {
      data = '0' + data;
    }

    return data.length > bits ? data : data.slice(-bits);
  },
  thumbnail: function thumbnail(src, width, height) {
    if (typeof src !== 'string') {
      return src;
    }

    if (typeof width === 'undefined') {
      return src;
    }

    var urls = src.split('?');
    var sizes, rules, feature, matches;
    height = height || width;
    sizes = {
      midfix: '/' + width + '_' + height,
      suffix: '_' + width + 'x' + height
    };
    rules = {
      cdn: /^http.+i[0-2]\.hdslb\.com\//,
      bfs: /^http.+i\d\.hdslb\.com\/bfs\//,
      group1: /^http.+i\d\.hdslb\.com\/group1\//,
      other: /(^http.+i\d\.hdslb\.com)(\/.+)/
    };
    feature = {
      bfs: /_\d+x\d+\./,
      other: /\/\d+_\d+\//
    };

    if (!rules.cdn.test(urls[0])) {
      return src;
    }

    if (feature.bfs.test(urls[0]) || feature.other.test(urls[0])) {
      return src;
    }

    if (rules.bfs.test(urls[0]) || rules.group1.test(urls[0])) {
      urls[0] += sizes.suffix + urls[0].slice(urls[0].lastIndexOf('.'));
      src = urls.join('?');
    } else {
      matches = rules.other.exec(urls[0]);

      if (matches) {
        urls[0] = matches[1] + sizes.midfix + matches[2];
        src = urls.join('?');
      }
    }

    return src;
  },
  //检查是否支持webp
  isWebp: function () {
    try {
      return document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') == 0;
    } catch (err) {
      return false;
    }
  }(),
  webp: function webp(url, args) {
    if (!url) {
      return url;
    }

    var suffix = url.match(/(.*\.(jpg|jpeg|gif|png|bmp))(\?.*)?/); //路径是否包含/bfs/

    var isBfs = url.indexOf('/bfs/') != -1 ? true : false; //是否是GIF图片

    if (!suffix || suffix[2] === 'bmp' || !isBfs) {
      return url;
    }

    var w = args.w,
        h = args.h; //裁剪规则

    var filter = [];

    if (w && h) {
      filter.push(w + 'w');
      filter.push(h + 'h');
    }

    if (args.freeze) {
      filter.push('1s');
    } // var cut = (w && h) ? '@' + w + 'w_' + h + 'h' : '@'
    //图片后参数 比如视频动态图


    var args = suffix[3] ? suffix[3] : '';

    if (this.isWebp) {
      return suffix[1] + '@' + filter.join('_') + '.webp' + args;
    } else {
      return suffix[1] + '@' + filter.join('_') + '.' + suffix[2] + args;
    }
  },
  isAlpha: function isAlpha(items, rate) {
    var machineDna;

    if (localStorage.getItem('machineDna')) {
      machineDna = localStorage.getItem('machineDna');
    } else {
      machineDna = parseInt(Math.random() * 10 + 1);
      localStorage.setItem('machineDna', machineDna);
    }

    if (this.isBeta(items) || rate < machineDna) {
      return true;
    } else {
      return false;
    }
  },
  isBeta: function isBeta(items) {
    var isOpen = false;
    var mantissa = utils.cookie.get('DedeUserID').slice(-1);

    if (mantissa && $.isArray(items)) {
      isOpen = $.inArray(+mantissa, items) > -1;
    }

    return isOpen;
  },
  trimHttp: function trimHttp(url) {
    return url ? url.replace(/^http:/, '') : '';
  },
  getByteLen: function getByteLen(val) {
    var len = 0;

    for (var i = 0; i < val.length; i++) {
      var a = val.charAt(i);

      if (a.match(/[^\x00-\xff]/ig) != null) {
        len += 1;
      } else {
        len += .5;
      }
    }

    return len;
  },
  // to do mreporter
  //评论在播放页日志上报
  videoReport: function videoReport(name) {
    // MReporter logic
    if (window.MReporter) {
      window.MReporter.click && window.MReporter.click({
        evt: "selfDef.".concat(name),
        msg: {
          event: name,
          value: name
        }
      });
      return;
    } // log-reporter logic


    if (window.spmReportData) {
      window.spmReportData[name] = name;
    }
  },
  //埋点上报
  customReport: function customReport(name, ops) {
    if (window.MReporter) {
      window.MReporter.click && window.MReporter.click({
        evt: "selfDef.".concat(name),
        msg: {
          event: name,
          value: ops || name
        }
      });
    }

    if (window.reportConfig && window[reportConfig['msgObjects']]) {
      var reportObj = window[reportConfig['msgObjects']];
      var obj = ops ? ops : name;
      reportObj[name] = obj;
    }
  },
  formatLotteryTime: function formatLotteryTime(time) {
    time = time * 1000;
    var date = new Date(time);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    return year + '年' + month + '月' + day + '日 ' + hour + ':' + minute;
  },
  hexToRgbA: function hexToRgbA(hex) {
    var localHex = hex.toString();

    if (hex.length === 6) {
      localHex = 'ff' + localHex;
    }

    var r = parseInt(localHex.slice(2, 4), 16),
        g = parseInt(localHex.slice(4, 6), 16),
        b = parseInt(localHex.slice(6, 8), 16),
        alpha = parseInt(localHex.slice(0, 2), 16);
    return "rgba(" + r + ", " + g + ", " + b + ", " + alpha / 255 + ")";
  },
  asyncScript: function asyncScript(url) {
    return new Promise(function (resolve) {
      var script = document.createElement('script');
      script.setAttribute('src', url);
      document.body.appendChild(script);
      script.onload = resolve;
    });
  },
  cmGetUrl: function cmGetUrl(cmData, id) {
    if (!window.BiliCm) return '';
    return window.BiliCm.Base.getSyncUrl(cmData, Number(id));
  },
  cmSendData: function cmSendData(cmData, id) {
    if (!window.BiliCm) return;
    window.BiliCm.Base.sendShowData(cmData, Number(id));
  },
  cmSendStrictData: function cmSendStrictData(cmData, id) {
    if (!window.BiliCm) return;
    window.BiliCm.Base.sendStrictShowData(cmData, Number(id));
  },
  cmSendCloseData: function cmSendCloseData(cmData, id) {
    if (!window.BiliCm) return;
    window.BiliCm.Base.sendCloseData(cmData, Number(id));
  },
  checkInView: function checkInView(el, padding) {
    if (!el) return;
    var rect = el.getBoundingClientRect();
    var p = padding || 0; // 只判断了纵向

    return rect.top < window.innerHeight + p && rect.bottom >= 0;
  },
  // to do mreporter

  /**
   * 完全自定义上报 可自定义上报通道和公共参数
   * @param {*} options
   *  spm_id : spmid 非必传 取meta中spmid
   *  c : C段  非必传 默认 0
   *  d : D段 非必传  默认 0
   *  e : E段 非必传  默认 0
   *  type : pv, click, appear 上报类型通道
   * @param {*} info
   */
  allCustomReport: function allCustomReport() {
    var _document$getElements;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var info = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var spm_idAB = options.spm_id || ((_document$getElements = document.getElementsByTagName('meta').spm_prefix) === null || _document$getElements === void 0 ? void 0 : _document$getElements.content) || '0.0';
    var spmidC = options.c || '0';
    var spmidD = options.d || '0';
    var spmidE = options.e || '0';
    var spm_id = spmidE ? "".concat(spm_idAB, ".").concat(spmidC, ".").concat(spmidD, ".").concat(spmidE) : "".concat(spm_idAB, ".").concat(spmidC, ".").concat(spmidD);

    if (!options.type) {
      throw new Error('report need type');
    }

    info.spm_id = spm_id; // MReporter logic

    if (window.MReporter) {
      var input = {
        msg: info,
        spm: {
          id: options.spm_id,
          mol: spmidC,
          pos: spmidD,
          ext: spmidE
        }
      };
      window.MReporter[options.type] && window.MReporter[options.type](input);
      return;
    } // log-reporter logic


    if (window.reportObserver && window.reportObserver.reportCustomData) {
      window.reportObserver.reportCustomData(options.type, info);
    }
  },
  getImgSrc: function getImgSrc(file) {
    var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return utils.trimHttp(utils.webp(file, option));
  },
  // MReporter mr-show attribute 组装
  mrShowAttr: function mrShowAttr(msg, evtName, index) {
    var payload = {
      msg: msg,
      evt: "".concat(evtName, ".show.").concat(index)
    };
    return JSON.stringify(payload);
  }
};



(function() {
    'use strict';

    function getLocationSpanByReply(reply, attrs=""){
        if(reply && reply.reply_control && reply.reply_control.location){
            return `<span class="reply-location" ${attrs}>${reply.reply_control.location || ''}</span>`;
        }else{
            return "";
        }

    }

    hackEle(HTMLBodyElement.prototype, "insertBefore", hack);
    hackEle(HTMLHeadElement.prototype, "insertBefore", hack);

    hackEle(HTMLBodyElement.prototype, "appendChild", hack);
    hackEle(HTMLHeadElement.prototype, "appendChild", hack);

    StartObserveNewPage(); // 对新版视频页的进行inject ，just Test

    async function StartObserveNewPage(){
        await mscststs.wait(".browser-pc")
        // 本来相对 Vue-next 的 render 做注入的，想了想感觉太麻烦了，还是简单点，做成 MutationObserver 算了
        const targetNode = document.querySelector("body");
        function setCode(){
            const nodes = [
                ...document.querySelectorAll(".browser-pc .reply-item .reply-time"),
                ...document.querySelectorAll(".browser-pc .sub-reply-item .sub-reply-time")
                          ];
            nodes.forEach(node=>{
                if(!node.__vueParentComponent){
                    return;
                }
                if(node.settled){
                    return;
                }
                node.settled = true;
                const item = node.__vueParentComponent.props.reply || node.__vueParentComponent.props.subReply
                let locationSpan = getLocationSpanByReply(item,`style="margin-right:20px;"`);

                node.outerHTML = node.outerHTML + locationSpan ;
                //console.log(node)
            })
        }
        const config = { childList: true, subtree: true };
        const callback = function(mutationsList, observer) {
            setCode()
        };
        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
        setCode()
    }


    function hackEle(ele, func, callback){
        const ori = ele[func];
        ele[func] = function(...args){
            // console.log(this, ...args)
            return callback(ori.bind(this), ...args)
        }
    };


    function injectbbComment(){
        const bbComment = window.bbComment;
        if( !bbComment.prototype._createSubReplyUserFace ){
            //console.log("inject Old ")
            injectOldbbComment();
        }else{
            //console.log("inject New ")
            injectNewbbComment();
        }
    };

    // 旧版评论，为啥会有旧版评论呢，因为有人在用 403348 ～
    function injectOldbbComment(){
        const g = window.bbComment;
        const f = utils;
        g.prototype._createListCon = function(e, n, t) {
            var locationSpan = getLocationSpanByReply(e);
            var r = this._parentBlacklistDom(e, n, t)
            , i = ['<div class="con ' + (t == n ? "no-border" : "") + '">', '<div class="user">' + this._identity(e.mid, e.assist, e.member.fans_detail), '<a data-usercard-mid="' + e.mid + '" href="//space.bilibili.com/' + e.mid + '" target="_blank" class="name ' + this._createVipClass(e.member.vip.vipType, e.member.vip.vipStatus, e.member.vip.themeType) + '">' + f.unhtml(e.member.uname) + '</a><a class="level-link" href="//www.bilibili.com/blackboard/help.html#%E4%BC%9A%E5%91%98%E7%AD%89%E7%BA%A7%E7%9B%B8%E5%85%B3" target="_blank"><i class="level l' + e.member.level_info.current_level + '"></i></a>' + this._createNameplate(e.member.nameplate) + this._createUserSailing(e.member && e.member.user_sailing || {}) + "</div>", this._createMsgContent(e), '<div class="info">', e.floor ? '<span class="floor">#' + e.floor + "</span>" : "", this._createPlatformDom(e.content.plat), '<span class="time">' + this._formateTime(e.ctime) + "</span>",locationSpan, e.lottery_id ? "" : '<span class="like ' + (1 == e.action ? "liked" : "") + '"><i></i><span>' + (e.like || "") + "</span></span>", e.lottery_id ? "" : '<span class="hate ' + (2 == e.action ? "hated" : "") + '"><i></i></span>', e.lottery_id ? "" : this._createReplyBtn(e.rcount), e.lottery_id && e.mid !== this.userStatus.mid ? "" : '<div class="operation more-operation"><div class="spot"></div><div class="opera-list"><ul>' + (this._canSetTop(e) ? '<li class="set-top">' + (e.isUpTop ? "取消置顶" : "设为置顶") + "</li>" : "") + (this._canBlackList(e.mid) ? '<li class="blacklist">加入黑名单</li>' : "") + (this._canReport(e.mid) ? '<li class="report">举报</li>' : "") + (this._canDel(e.mid) && !e.isTop ? '<li class="del" data-mid="' + e.mid + '">删除</li>' : "") + "</ul></div></div>", this._createLotteryContent(e.content), this._createVoteContent(e.content), this._createTags(e), "</div>", '<div class="reply-box">', this._createSubReplyList(e.replies, e.rcount, !1, e.rpid, e.folder && e.folder.has_folded), "</div>", '<div class="paging-box">', "</div>", "</div>"].join("");
            return f.browser.version.mobile && (i = ['<div class="con ' + (t == n ? "no-border" : "") + '">', '<div class="user">' + this._identity(e.mid, e.assist, e.member.fans_detail), '<a data-usercard-mid="' + e.mid + '" href="//space.bilibili.com/' + e.mid + '" target="_blank" class="name ' + this._createVipClass(e.member.vip.vipType, e.member.vip.vipStatus, e.member.vip.themeType) + '">' + f.unhtml(e.member.uname) + '</a><a class="level-link" href="//www.bilibili.com/blackboard/help.html#%E4%BC%9A%E5%91%98%E7%AD%89%E7%BA%A7%E7%9B%B8%E5%85%B3" target="_blank"><i class="level l' + e.member.level_info.current_level + '"></i></a>' + this._createNameplate(e.member.nameplate) + '<div class="right">', e.floor ? '<span class="floor">#' + e.floor + "</span>" : "", '<span class="time">' + this._formateMobileTime(e.ctime) + "</span></div>", "</div>", this._createMsgContent(e), this._createVoteContent(e.content), '<div class="info">', this._createPlatformDom(e.content.plat), '<span class="like ' + (1 == e.action ? "liked" : "") + '"><i></i><span>' + (e.like || "") + "</span></span>", '<span class="hate ' + (2 == e.action ? "hated" : "") + '"><i></i></span>', this._createReplyBtn(e.rcount), '<div class="operation more-operation"><div class="spot"></div><div class="opera-list"><ul>' + (this._canSetTop(e) ? '<li class="set-top">' + (e.isUpTop ? "取消置顶" : "设为置顶") + "</li>" : "") + (this._canBlackList(e.mid) ? '<li class="blacklist">加入黑名单</li>' : "") + (this._canReport(e.mid) ? '<li class="report">举报</li>' : "") + (this._canDel(e.mid) && !e.isTop ? '<li class="del" data-mid="' + e.mid + '">删除</li>' : "") + "</ul></div></div>", "</div>", this._createTags(e), '<div class="reply-box">', this._createSubReplyList(e.replies, e.rcount, !1, e.rpid, e.folder && e.folder.has_folded), "</div>", '<div class="paging-box">', "</div>", "</div>"].join("")),
                e.state === this.blacklistCode ? r : i
        }
        g.prototype._createSubFoldedListCon = function(e) {
            var locationSpan = getLocationSpanByReply(e);
            var n = this._parentBlacklistDom(e, 0)
            , t = ['<div class="con">', '<div class="user">' + this._identity(e.mid, e.assist, e.member.fans_detail), '<a data-usercard-mid="' + e.mid + '" href="//space.bilibili.com/' + e.mid + '" target="_blank" class="name ' + this._createVipClass(e.member.vip.vipType, e.member.vip.vipStatus, e.member.vip.themeType) + '">' + f.unhtml(e.member.uname) + '</a><a class="level-link" href="//www.bilibili.com/blackboard/help.html#%E4%BC%9A%E5%91%98%E7%AD%89%E7%BA%A7%E7%9B%B8%E5%85%B3" target="_blank"><i class="level l' + e.member.level_info.current_level + '"></i></a>' + this._createNameplate(e.member.nameplate), "</div>", this._createMsgContent(e), '<div class="info">', '<span class="time">' + this._formateTime(e.ctime) + "</span>",locationSpan, '<span class="like ' + (1 == e.action ? "liked" : "") + '"><i></i><span>' + (e.like || "") + "</span></span>", this._createReplyBtn(e.rcount), '<div class="operation more-operation"><div class="spot"></div><div class="opera-list"><ul>' + (this._canSetTop(e) ? '<li class="set-top">' + (e.isUpTop ? "取消置顶" : "设为置顶") + "</li>" : "") + (this._canBlackList(e.mid) ? '<li class="blacklist">加入黑名单</li>' : "") + (this._canReport(e.mid) ? '<li class="report">举报</li>' : "") + (this._canDel(e.mid) && !e.isTop ? '<li class="del" data-mid="' + e.mid + '">删除</li>' : "") + "</ul></div></div>", "</div>", "</div>"].join("");
            return f.browser.version.mobile && (t = ['<div class="con">', '<div class="user">' + this._identity(e.mid, e.assist, e.member.fans_detail), '<a data-usercard-mid="' + e.mid + '" href="//space.bilibili.com/' + e.mid + '" target="_blank" class="name ' + this._createVipClass(e.member.vip.vipType, e.member.vip.vipStatus, e.member.vip.themeType) + '">' + f.unhtml(e.member.uname) + '</a><a class="level-link" href="//www.bilibili.com/blackboard/help.html#%E4%BC%9A%E5%91%98%E7%AD%89%E7%BA%A7%E7%9B%B8%E5%85%B3" target="_blank"><i class="level l' + e.member.level_info.current_level + '"></i></a>' + this._createNameplate(e.member.nameplate), '<div class="right">', '<span class="time">' + this._formateMobileTime(e.ctime) + "</span></div>", "</div>", this._createMsgContent(e), '<div class="info">', this._createPlatformDom(e.content.plat), '<span class="like ' + (1 == e.action ? "liked" : "") + '"><i></i><span>' + (e.like || "") + "</span></span>", this._createReplyBtn(e.rcount), '<div class="operation more-operation"><div class="spot"></div><div class="opera-list"><ul>' + (this._canSetTop(e) ? '<li class="set-top">' + (e.isUpTop ? "取消置顶" : "设为置顶") + "</li>" : "") + (this._canBlackList(e.mid) ? '<li class="blacklist">加入黑名单</li>' : "") + (this._canReport(e.mid) ? '<li class="report">举报</li>' : "") + (this._canDel(e.mid) && !e.isTop ? '<li class="del" data-mid="' + e.mid + '">删除</li>' : "") + "</ul></div></div>", "</div>", "</div>"].join("")),
                e.state === this.blacklistCode ? n : t
        }
        g.prototype._createTopFoldedListCon = function(e) {
            var locationSpan = getLocationSpanByReply(e);
            var n = this._parentBlacklistDom(e, 0)
            , t = ['<div class="con">', '<div class="user">' + this._identity(e.mid, e.assist, e.member.fans_detail), '<a data-usercard-mid="' + e.mid + '" href="//space.bilibili.com/' + e.mid + '" target="_blank" class="name ' + this._createVipClass(e.member.vip.vipType, e.member.vip.vipStatus, e.member.vip.themeType) + '">' + f.unhtml(e.member.uname) + '</a><a class="level-link" href="//www.bilibili.com/blackboard/help.html#%E4%BC%9A%E5%91%98%E7%AD%89%E7%BA%A7%E7%9B%B8%E5%85%B3" target="_blank"><i class="level l' + e.member.level_info.current_level + '"></i></a>' + this._createNameplate(e.member.nameplate), "</div>", this._createMsgContent(e), '<div class="info">', e.floor ? '<span class="floor">#' + e.floor + "</span>" : "", this._createPlatformDom(e.content.plat), '<span class="time">' + this._formateTime(e.ctime) + "</span>",locationSpan, '<span class="like ' + (1 == e.action ? "liked" : "") + '"><i></i><span>' + (e.like || "") + "</span></span>", '<span class="hate ' + (2 == e.action ? "hated" : "") + '"><i></i></span>', this._createReplyBtn(e.rcount), '<div class="operation more-operation"><div class="spot"></div><div class="opera-list"><ul>' + (this._canSetTop(e) ? '<li class="set-top">' + (e.isUpTop ? "取消置顶" : "设为置顶") + "</li>" : "") + (this._canBlackList(e.mid) ? '<li class="blacklist">加入黑名单</li>' : "") + (this._canReport(e.mid) ? '<li class="report">举报</li>' : "") + (this._canDel(e.mid) && !e.isTop ? '<li class="del" data-mid="' + e.mid + '">删除</li>' : "") + "</ul></div></div>", "</div>", "</div>"].join("");
            return f.browser.version.mobile && (t = ['<div class="con">', '<div class="user">' + this._identity(e.mid, e.assist, e.member.fans_detail), '<a data-usercard-mid="' + e.mid + '" href="//space.bilibili.com/' + e.mid + '" target="_blank" class="name ' + this._createVipClass(e.member.vip.vipType, e.member.vip.vipStatus, e.member.vip.themeType) + '">' + f.unhtml(e.member.uname) + '</a><a class="level-link" href="//www.bilibili.com/blackboard/help.html#%E4%BC%9A%E5%91%98%E7%AD%89%E7%BA%A7%E7%9B%B8%E5%85%B3" target="_blank"><i class="level l' + e.member.level_info.current_level + '"></i></a>' + this._createNameplate(e.member.nameplate), '<div class="right">', e.floor ? '<span class="floor">#' + e.floor + "</span>" : "", '<span class="time">' + this._formateMobileTime(e.ctime) + "</span></div>", "</div>", this._createMsgContent(e), '<div class="info">', this._createPlatformDom(e.content.plat), '<span class="like ' + (1 == e.action ? "liked" : "") + '"><i></i><span>' + (e.like || "") + "</span></span>", '<span class="hate ' + (2 == e.action ? "hated" : "") + '"><i></i></span>', this._createReplyBtn(e.rcount), '<div class="operation more-operation"><div class="spot"></div><div class="opera-list"><ul>' + (this._canSetTop(e) ? '<li class="set-top">' + (e.isUpTop ? "取消置顶" : "设为置顶") + "</li>" : "") + (this._canBlackList(e.mid) ? '<li class="blacklist">加入黑名单</li>' : "") + (this._canReport(e.mid) ? '<li class="report">举报</li>' : "") + (this._canDel(e.mid) && !e.isTop ? '<li class="del" data-mid="' + e.mid + '">删除</li>' : "") + "</ul></div></div>", "</div>", "</div>"].join("")),
                e.state === this.blacklistCode ? n : t
        }

        g.prototype._parentBlacklistDom = function(e, n, t) {
            var locationSpan = getLocationSpanByReply(e);
            return ['<div class="con ' + (t == n ? "no-border" : "") + '">', '<div class="user blacklist-font-color">黑名单用户</div>', '<p class="text">由于黑名单设置，该评论已被隐藏。</p>', '<div class="info">', e.floor ? '<span class="floor">#' + e.floor + "</span>" : "", this._createPlatformDom(e.content.plat), '<span class="time">' + this._formateTime(e.ctime) + "</span>", locationSpan, this._canDel(e.mid) ? '<div class="operation btn-hover"><div class="spot"></div><div class="opera-list"><ul><li class="del" data-mid="' + e.mid + '">删除</li></ul></div></div>' : "", "</div>", "</div>"].join("")
        }
        g.prototype._subBlacklistDom = function(e) {
            var locationSpan = getLocationSpanByReply(e);
            return ['<div class="reply-item reply-wrap" data-id="' + e.rpid + '">', '<a class="reply-face"><img src="' + this.noface + '"></a>', '<div class="reply-con">', '<div class="user">', '<span class="blacklist-font-color name">黑名单用户 </span> <span class="text-con">由于黑名单设置，该回复已被隐藏。</span>', "</div>", "</div>", '<div class="info">', '<span class="time">' + this._formateTime(e.ctime) + "</span>", locationSpan, this._canDel(e.mid) ? '<div class="operation btn-hover btn-hide-re"><div class="spot"></div><div class="opera-list"><ul><li class="del" data-mid="' + e.mid + '">删除</li></ul></div></div>' : "", "</div>", "</div>"].join("")
        }
        g.prototype._createSubReplyItem = function(e, n) {
            var locationSpan = getLocationSpanByReply(e);
            var t = ['<div class="reply-item reply-wrap" data-id="' + e.rpid + '" data-index="' + n + '">', '<a href="//space.bilibili.com/' + e.mid + '" data-usercard-mid="' + e.mid + '" target="_blank" class="reply-face">', '<img src="' + f.trimHttp(f.webp(e.member.avatar, {
                w: 52,
                h: 52
            })) + '" alt="">', "</a>", '<div class="reply-con">', '<div class="user">', '<a href="//space.bilibili.com/' + e.mid + '" target="_blank" data-usercard-mid="' + e.mid + '" class="name ' + this._createVipClass(e.member.vip.vipType, e.member.vip.vipStatus, e.member.vip.themeType) + '">' + f.unhtml(e.member.uname) + "</a>", '<a class="level-link" href="//www.bilibili.com/blackboard/help.html#%E4%BC%9A%E5%91%98%E7%AD%89%E7%BA%A7%E7%9B%B8%E5%85%B3" target="_blank"><i class="level l' + e.member.level_info.current_level + '"></i></a>', this._createSubMsgContent(e), "</div>", "</div>", '<div class="info">', '<span class="time">' + this._formateTime(e.ctime) + "</span>", locationSpan, '<span class="like ' + (1 == e.action ? "liked" : "") + '"><i></i><span>' + (e.like || "") + "</span></span>", '<span class="hate ' + (2 == e.action ? "hated" : "") + '"><i></i></span>', '<span class="reply btn-hover">回复</span>', '<div class="operation btn-hover btn-hide-re"><div class="spot"></div><div class="opera-list"><ul>' + (this._canBlackList(e.mid) ? '<li class="blacklist">加入黑名单</li>' : "") + (this._canReport(e.mid) ? '<li class="report">举报</li>' : "") + (this._canDel(e.mid) ? '<li class="del" data-mid="' + e.mid + '">删除</li>' : "") + "</ul></div></div>", "</div>", "</div>"].join("");
            return f.browser.version.mobile && (t = ['<div class="reply-item reply-wrap" data-id="' + e.rpid + '" data-index="' + n + '">', '<div class="reply-con">', '<div class="user">', '<a href="//space.bilibili.com/' + e.mid + '" target="_blank" data-usercard-mid="' + e.mid + '" class="name ' + this._createVipClass(e.member.vip.vipType, e.member.vip.vipStatus, e.member.vip.themeType) + '">' + f.unhtml(e.member.uname) + "</a>", '<a class="level-link" href="//www.bilibili.com/blackboard/help.html#%E4%BC%9A%E5%91%98%E7%AD%89%E7%BA%A7%E7%9B%B8%E5%85%B3" target="_blank"><i class="level l' + e.member.level_info.current_level + '"></i>', '<div class="right"><span class="time">' + this._formateMobileTime(e.ctime) + "</span></div>", "</a>", this._createSubMsgContent(e), "</div>", '<div class="info">', '<span class="like ' + (1 == e.action ? "liked" : "") + '"><i></i><span>' + (e.like || "") + "</span></span>", '<span class="reply btn-hover">回复</span>', '<div class="operation btn-hover btn-hide-re"><div class="spot"></div><div class="opera-list"><ul>' + (this._canBlackList(e.mid) ? '<li class="blacklist">加入黑名单</li>' : "") + (this._canReport(e.mid) ? '<li class="report">举报</li>' : "") + (this._canDel(e.mid) ? '<li class="del" data-mid="' + e.mid + '">删除</li>' : "") + "</ul></div></div>", "</div>", "</div>", "</div>"].join("")),
                t
        }
    }

    function injectNewbbComment(){
        const bbComment = window.bbComment;
        // console.log("inject New ")
        bbComment.prototype._createListCon = function (item, i, pos) {
            //黑名单结构
            var blCon = this._parentBlacklistDom(item, i, pos); //正常结构


            var con = ['<div class="con ' + (pos == i ? 'no-border' : '') + '">', '<div class="user">' + this._createNickNameDom(item), this._createLevelLink(item), this._identity(item.mid, item.assist, item.member.fans_detail), this._createNameplate(item.member.nameplate) + this._createUserSailing(item) + '</div>', this._createMsgContent(item), this._createPerfectReply(item), '<div class="info">', this._createPlatformDom(item.content.plat), "<span class=\"time-location\">", "<span class=\"reply-time\">".concat(this._formateTime(item.ctime), "</span>"), getLocationSpanByReply(item),
                       "</span>", item.lottery_id ? '' : '<span class="like ' + (item.action == 1 ? 'liked' : '') + '"><i></i><span>' + (item.like ? item.like : '') + '</span></span>', item.lottery_id ? '' : '<span class="hate ' + (item.action == 2 ? 'hated' : '') + '"><i></i></span>', item.lottery_id ? '' : this._createReplyBtn(item.rcount), item.lottery_id && item.mid !== this.userStatus.mid ? '' : '<div class="operation more-operation"><div class="spot"></div><div class="opera-list"><ul>' + (this._canSetTop(item) ? '<li class="set-top">' + (item.isUpTop ? '取消置顶' : '设为置顶') + '</li>' : '') + (this._canBlackList(item.mid) ? '<li class="blacklist">加入黑名单</li>' : '') + (this._canReport(item.mid) ? '<li class="report">举报</li>' : '') + (this._canDel(item.mid) && !item.isTop ? '<li class="del" data-mid="' + item.mid + '">删除</li>' : '') + '</ul></div></div>', this._createLotteryContent(item.content), this._createVoteContent(item.content), this._createTags(item), '</div>', '<div class="reply-box">', this._createSubReplyList(item.replies, item.rcount, false, item.rpid, item.folder && item.folder.has_folded, item.reply_control), '</div>', '<div class="paging-box">', '</div>', '</div>'].join('');

            if (utils.browser.version.mobile) {
                con = ['<div class="con ' + (pos == i ? 'no-border' : '') + '">', '<div class="user">' + this._identity(item.mid, item.assist, item.member.fans_detail), this._createNickNameDom(item), this._createLevelLink(item), this._createNameplate(item.member.nameplate) + '<div class="right">', '<span class="time">' + this._formateMobileTime(item.ctime) + '</span></div>', '</div>', this._createMsgContent(item), this._createVoteContent(item.content), '<div class="info">', this._createPlatformDom(item.content.plat), '<span class="like ' + (item.action == 1 ? 'liked' : '') + '"><i></i><span>' + (item.like ? item.like : '') + '</span></span>', '<span class="hate ' + (item.action == 2 ? 'hated' : '') + '"><i></i></span>', this._createReplyBtn(item.rcount), '<div class="operation more-operation"><div class="spot"></div><div class="opera-list"><ul>' + (this._canSetTop(item) ? '<li class="set-top">' + (item.isUpTop ? '取消置顶' : '设为置顶') + '</li>' : '') + (this._canBlackList(item.mid) ? '<li class="blacklist">加入黑名单</li>' : '') + (this._canReport(item.mid) ? '<li class="report">举报</li>' : '') + (this._canDel(item.mid) && !item.isTop ? '<li class="del" data-mid="' + item.mid + '">删除</li>' : '') + '</ul></div></div>', '</div>', this._createTags(item), '<div class="reply-box">', this._createSubReplyList(item.replies, item.rcount, false, item.rpid, item.folder && item.folder.has_folded, item.reply_control), '</div>', '<div class="paging-box">', '</div>', '</div>'].join('');
            }

            return item.state === this.blacklistCode ? blCon : con;
        };
        bbComment.prototype._createSubReplyItem = function (item, i) {
            if (item.invisible) {
                return '';
            }

            var dom = ['<div class="reply-item reply-wrap" data-id="' + item.rpid + '" data-index="' + i + '">', this._createSubReplyUserFace(item), // '<a href="//space.bilibili.com/' + item.mid + '" data-usercard-mid="' + item.mid + '" target="_blank" class="reply-face">',
                       // '<img src="' + utils.trimHttp(utils.webp(item.member.avatar, { w: 52, h: 52, freeze: true })) + '" alt="">',
                       // '</a>',
                       '<div class="reply-con">', '<div class="user">', this._createNickNameDom(item), this._createLevelLink(item), this._identity(item.mid), this._createSubMsgContent(item), '</div>', '</div>', '<div class="info">', "<span class=\"time-location\">", "<span class=\"reply-time\">".concat(this._formateTime(item.ctime), "</span>"), getLocationSpanByReply(item),
                       "</span>", '<span class="like ' + (item.action == 1 ? 'liked' : '') + '"><i></i><span>' + (item.like ? item.like : '') + '</span></span>', '<span class="hate ' + (item.action == 2 ? 'hated' : '') + '"><i></i></span>', '<span class="reply btn-hover">回复</span>', '<div class="operation btn-hover btn-hide-re"><div class="spot"></div><div class="opera-list"><ul>' + (this._canBlackList(item.mid) ? '<li class="blacklist">加入黑名单</li>' : '') + (this._canReport(item.mid) ? '<li class="report">举报</li>' : '') + (this._canDel(item.mid) ? '<li class="del" data-mid="' + item.mid + '">删除</li>' : '') + '</ul></div></div>', '</div>', '</div>'].join('');

            if (utils.browser.version.mobile) {
                dom = ['<div class="reply-item reply-wrap" data-id="' + item.rpid + '" data-index="' + i + '">', // '<a href="//space.bilibili.com/' + item.mid + '" data-usercard-mid="' + item.mid + '" target="_blank" class="reply-face">',
                           // '<img src="' + utils.trimHttp(utils.webp(item.member.avatar, {w: 52, h: 52})) +'" alt="">',
                           // '</a>',
                           '<div class="reply-con">', '<div class="user">', this._createNickNameDom(item), this._createLevelLink(item), this._identity(item.mid), '<div class="right"><span class="time">' + this._formateMobileTime(item.ctime) + '</span></div>', '</a>', this._createSubMsgContent(item), '</div>', '<div class="info">', '<span class="like ' + (item.action == 1 ? 'liked' : '') + '"><i></i><span>' + (item.like ? item.like : '') + '</span></span>', '<span class="reply btn-hover">回复</span>', '<div class="operation btn-hover btn-hide-re"><div class="spot"></div><div class="opera-list"><ul>' + (this._canBlackList(item.mid) ? '<li class="blacklist">加入黑名单</li>' : '') + (this._canReport(item.mid) ? '<li class="report">举报</li>' : '') + (this._canDel(item.mid) ? '<li class="del" data-mid="' + item.mid + '">删除</li>' : '') + '</ul></div></div>', '</div>', '</div>', '</div>'].join('');
            }

            return dom;
    }




    }




    // 使用 setter 监听 comment 脚本的注册
    let f = undefined;
    Object.defineProperty(window,'bbComment',{
        get: function(){
            return f;
        },

        set: function(val){
            f = val;
            injectbbComment();
        },
        configurable: true,
    });



    function hack(origin, ...args){
        const [ele, target] = [...args];
        if( ele.src && ~ele.src.indexOf("/x/v2/reply")){
            // 确定是评论类型，执行额外流程
            injectbbComment()
        }

        // 监听 comment 组件的注入
        if(ele.src && ele.src.endsWith("comment.min.js")){
            const ori = ele.onload;
            ele.onload = function(...args){
                injectbbComment();
                ori && ori(...args);
            }
        };


        // 监听 comment_vue_next 组件的注入，直接在dynamic import 时修改源码，也是一种权宜之计，该版本针对Vue3架构
        if(ele.src && ele.src.endsWith("comment-pc-vue.next.js")){

            // console.log("新版评论，启用源码注入");
            !(async function(){
                let code = await (await fetch(ele.src)).text();

                const Ref1Index = code.indexOf("getReplyFloorInfo=");
                const Ref2Index = code.indexOf("getReplyBoxStatus=");
                if( Ref2Index > Ref1Index && Ref1Index > -1){

                    code = code.replace(`getReplyFloorInfo=`,`_RAWgetReplyFloorInfo=`);
                    code = code.replace(`getReplyBoxStatus=`,`getReplyFloorInfo=Q=>{return {
                        ..._RAWgetReplyFloorInfo(Q),
                        replyLocation: computed(()=>{ return Q.value.reply_control.location || ""})
                      }
                    },getReplyBoxStatus=`);
                }else{
                    console.error("【评论区开盒】Patch 失败【Vue3 版本】，无法找到正确的 Patch 位置，请反馈后等待开发者修复");
                }

                eval(code);

                ele.dispatchEvent(new Event("load",{
                    bubbles:true,
                }));
                ele.onload && ele.onload();

            })();

            return;
        };
        // 针对 lit 架构的
        if(ele.src && (ele.src.endsWith("comment-pc-elements.next.js") || (ele.src.indexOf("commentpc/bili-comments.") > -1))){

            //console.log("新版评论，启用源码注入");
            !(async function(){
                let code = await (await fetch(ele.src)).text();

                const Ref1Index = code.indexOf(`<div id="pubdate">','</div>`);

                const Ref2Index = code.indexOf("this.pubDate,this.handleLike,");
                if( Ref2Index > Ref1Index  && Ref1Index >-1){

                    //ref 1
                    code = code.replace(`<div id="pubdate">','</div>`, `<div id="pubdate">','</div><div id="location" style="margin-left:var(--kaihe-ml, 20px)">','</div>`);

                    //ref 2
                    code = code.replace(`this.pubDate,this.handleLike,`,`this.pubDate,(this.data && this.data.reply_control)? this.data.reply_control.location : null,this.handleLike,`);
                }else{
                    console.error("【评论区开盒】Patch 失败【Elements-lit版本】，无法找到正确的 Patch 位置，请反馈后等待开发者修复");
                }

                eval(code);

                ele.dispatchEvent(new Event("load",{
                    bubbles:true,
                }));
                ele.onload && ele.onload();

            })();

            return;
        };


        //console.log(ele,ele.src,origin)
        let res = origin(...args);
        //console.log(res)
        return res;
        //return ele;
    }


})();
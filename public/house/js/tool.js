Function.prototype.method = function (name, fn) {
  this.prototype[name] = fn;
  return this;
}

if (!String.prototype.trim) {
  String.method("trim", function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
  })
}
var isType = function (type) {
  return function (obj) {
    return Object.prototype.toString.call(obj) == '[object ' + type + ']';
  };
};
var isArray = isType("Array");
var isStr = isType("String");
var isObject = isType("Object");
var isFun = isType("Function");
var isRegExp = isType("RegExp");
const TOOL = {
  isArray: isArray,
  isStr: isStr,
  isObject: isObject,
  isFun: isFun,
  isRegExp: isRegExp,
  extend: function () {
    var options, copyIsArray,
      target = arguments[0] || {},
      i = 1,
      length = arguments.length,
      deep = false;

    if (typeof target === "boolean") {
      deep = target;
      target = arguments[i] || {};
      i++;
    }
    if (i === length) {
      target = this;
      i--;
    }
    for (; i < length; i++) {
      if ((options = arguments[i]) != null) {
        for (let name in options) {
          let clone,
            src = target[name],
            copy = options[name];
          if (target === copy) continue;
          if (deep && copy && (isObject(copy) ||
              (copyIsArray = isArray(copy)))) {
            if (copyIsArray) {
              copyIsArray = false;
              clone = src && isArray(src) ? src : [];
            } else {
              clone = src && isObject(src) ? src : {};
            }
            target[name] = this.extend(deep, clone, copy);
          } else if (copy !== undefined) {
            target[name] = copy;
          }
        }
      }
    }
    return target;
  },
  getStorage(item) {
     var value  = window.localStorage.getItem(item)
    if(value){
      value = this.decrypt(value);
      if(value.indexOf("time")>-1)value = JSON.parse(value)
      if(value.time && value.expires){//设置了过期时间
        let newTime = new Date().valueOf(),oldTime =value.time;
        if(newTime - oldTime>value.expires){window.localStorage.removeItem(item); value =""}
          else {value = value.value?value.value:value}
    }
  }
    return value;
  },
  setStorage(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        window.localStorage.setItem(key, this.encrypt(String(obj[key])));
      }
    }
  },
  clearStorage() {
    function clearCookie() {
      var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
      if (keys) {
        for (var i = keys.length; i--;)
          document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
      }
    }
    if (window.localStorage) {
      window.localStorage.clear();
    } else {
      clearCookie();
    }
  },
  getSession(item) {
    var value;
    value = window.sessionStorage.getItem(item)
    return (value ? this.decrypt(value) : '')
  },
  setSession(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        window.sessionStorage.setItem(key, this.encrypt(String(obj[key])));
      }
    }
  },
  clearSession() {
    function clearCookie() {
      var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
      if (keys) {
        for (var i = keys.length; i--;)
          document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
      }
    }

    if (window.sessionStorage) {
      window.sessionStorage.clear();
    } else {
      clearCookie();
    }
    // return this;
  },
  encrypt(value) {
    var encryptValue = ''
    var mask
    var maskValue
    for (var i = 0, len = value.length; i < len; i++) {
      mask = Math.round(Math.random() * 111) + 77
      maskValue = value.charCodeAt(i) + mask
      mask += i
      encryptValue += String.fromCharCode(maskValue, mask)
    }
    return encryptValue
  },
  decrypt(value) {
    var decryptValue = ''
    var k = 0
    var v
    var m
    var decrypt = function (v, m, i) {
      v = v.charCodeAt(0)
      m = m.charCodeAt(0)
      m -= i
      v -= m
      return String.fromCharCode(v)
    }
    for (var i = 0, len = value.length; i < len; i++) {
      if (!(i % 2)) {
        v = value[i]
      } else {
        m = value[i]
        decryptValue += decrypt(v, m, k)
        k++
      }
    }
    return decryptValue
  },
  getToken() {
    return this.getStorage("M-token") || ''
  },
  getCookie: function (name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
      return unescape(arr[2]);
    else
      return null;
  },
  setCookie: function (name, value, day) {
    if (day !== 0) { //当设置的时间等于0时，不设置expires属性，cookie在浏览器关闭后删除
      var expires = day * 24 * 60 * 60 * 1000;
      var date = new Date(+new Date() + expires);
      document.cookie = name + "=" + escape(value) + ";expires=" + date.toUTCString();
    } else {
      document.cookie = name + "=" + escape(value);
    }
  },
  delCookie: function (name) {
    this.setCookie(name, ' ', -1);
  },
  copy: function (source) {
    let result = Array.isArray(source) ? [] : {};
    for (var key in source) {
      result[key] = source[key] != null && typeof source[key] === 'object' ? this.copy(source[key]) : source[key];
    }
    return result;
  },
  getTime: function (t) {
    if (!t) return new Date().getTime();
    return new Date(String(t).replace(/-/g, "/")).getTime();
  },
  dateFtt: function (fmt, date) {
    if (typeof date === "string" || typeof date === "number") {
      date = new Date(date);
    }
    var o = {
      "M+": date.getMonth() + 1, //月份
      "d+": date.getDate(), //日
      "h+": date.getHours(), //小时
      "m+": date.getMinutes(), //分
      "s+": date.getSeconds(), //秒
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度
      "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  },
  //数组对象深拷贝
  deepClone: function (obj) {
    let objClone = Array.isArray(obj) ? [] : {};
    if (obj && typeof obj === "object") {
      for (key in obj) {
        if (obj.hasOwnProperty(key)) {
          //判断ojb子元素是否为对象，如果是，递归复制
          if (obj[key] && typeof obj[key] === "object") {
            objClone[key] = deepClone(obj[key]);
          } else {
            //如果不是，简单复制
            objClone[key] = obj[key];
          }
        }
      }
    }
    return objClone;
  },
  //propertyType物业类型转换
  propertyTypeFlag(value) {
    let set = {
      1: "住宅",
      2: "别墅",
      3: "商铺",
      4: "写字楼",
      5: "酒店式公寓",
      6: "车位",
      7: "动迁房",
      8: "其他",
      9: "洋房",
      10: "公寓"
    };
    return set.hasOwnProperty(value) ? set[value] : value;
  },
  //朝向转换
  orientedFlag(value) {
    let set = {
      1: "正南",
      2: "正北",
      3: "正东",
      4: "正西",
      5: "东南",
      6: "西南",
      7: "东北",
      8: "西北"
    };
    return set.hasOwnProperty(value) ? set[value] : value;
  },
  //销售类型转换
  salesStatusFlag(value) {
    let set = { 1: "待售", 2: "在售", 3: "售罄" };
    return set.hasOwnProperty(value) ? set[value] : value;
  },
  getUrlParams(name) { 
    var url = window.location.search;
    if (url.indexOf('?') == 1) { return false; }
    url = url.substr(1);
    url = url.split('&');
    var name = name || '';
    var nameres;
    for(var i=0;i<url.length;i++) {
        var info = url[i].split('=');
        var obj = {};
        obj[info[0]] = decodeURI(info[1]);
        url[i] = obj;
    }
    if (name) {
        for(var i=0;i<url.length;i++) {
            for (const key in url[i]) {
                if (key == name) {
                    nameres = url[i][key];
                }
            }
        }
    } else {
        nameres = url;
    }
    return nameres;
}
}
//百度追踪
if(TOOL.getUrlParams("hmsr")){
  TOOL.setStorage({"hmsr":JSON.stringify({
     value:TOOL.getUrlParams("hmsr"),
     time:new Date().getTime(),
     expires:24*60*60*1000
  })});
  TOOL.setStorage({"hmpl":JSON.stringify({
    value:TOOL.getUrlParams("hmpl"),
    time:new Date().getTime(),
    expires:24*60*60*1000
  })})
}
function isDef (v) {
  return v !== undefined && v !== null;
}
function apiPostPlaintext (url) {
    return apiPost(url, paramsObj,'').then((res) => {
      console.log(333333,res)
      const { status, data } = res.data;
      if (parseInt(status.code) === parseInt(ERR_OK)) {
        let jsonStr = data
        return jsonStr;
      } else if (parseInt(status.code) === parseInt(ERR_NOLOGIN)) {
        errToast(status.msg);
        // return data;
        // goLogin()
      } else {
        if (paramsShowErr) {
          errToast(status.msg);
        }
      }
    },(res) => {
      console.log(res)
     // apiLoader.hide();
    });
  };
// 校验是否登录:successFun成功回调，failFun失败回调
function checkLogin(successFun,failFun,flag) {
  apiPost('/tospurWeb/pclogin/checkLogin',{
      token:flag?getStorage(flag):getStorage("M-token")
  },flag).done(function(res) {
    successFun()
  }).fail(function(err) {
      failFun();
  })
}
function formatArea(min,max){ //建面格式化
  if(min==null && max==null){
    return '建面待定'
  }else{
      if(min==null){
          return `建面约${max}㎡`
      }else if(max==null){
          return `建面约${min}㎡`
      }else{
          return `建面${min}-${max}㎡`
      }
  }
};
function AveragePrice(type,min){ //均价格式化
  if(min==null){
    return '均价待定'
  }else{
      if(type==1){
          return `${min}元/㎡`
      }else {
          return `${min}元/㎡起`
      }
  }
};
//下载/打开APP
function downloadIfWeixin(){
  let timeout1,timeout2
  var ua = window.navigator.userAgent.toLowerCase();
  var u = navigator.userAgent;
  let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
  let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  var micromessenger = ua.match(/MicroMessenger/i);
  var weixin = micromessenger == 'micromessenger'?true:false;

  // 判断是否是微信内置浏览器
  if (weixin) {
    let agreement = window.location.protocol
      let domain = window.location.host;
      window.location.href = `${agreement}//${domain}/download/capp.html`
    // window.location.href= 'https://tcstag.tospur.com/download/client/tchf_download_app.html?hmsr=&hmpl='
    // document.querySelector(".unload").style.display = 'block'
  }
  if(!weixin){
     // android端
      var domain = document.domain;
    if (isAndroid) {
         // 安卓app的scheme协议
        window.location.href = 'tongcehf://';
        timeout1 = setTimeout(function () {
          if(domain != document.domain)return;
          let hidden = window.document.hidden || window.document.mozHidden || window.document.msHidden || window.document.webkitHidden
           // eslint-disable-next-line eqeqeq
          if (typeof hidden === 'undefined' || hidden == false) {
             // App store
            window.location.href = 'http://tchf-prod.oss-cn-hangzhou.aliyuncs.com/houseclient_prod.apk';
          }
        }, 3000);
    }
    // ios端
    if (isIOS) {
       // ios的scheme协议
      window.location.href = 'tchouse://'
      timeout2 = setTimeout(function () {
        if(domain != document.domain)return;
        let hidden = window.document.hidden || window.document.mozHidden || window.document.msHidden || window.document.webkitHidden
        // eslint-disable-next-line eqeqeq
        if (typeof hidden === 'undefined' || hidden == false) {
          // App store下载地址
          window.location.href = 'https://apps.apple.com/us/app/%E5%90%8C%E7%AD%96%E5%A5%BD%E6%88%BF/id1489550214?l=zh&ls=1';
        }
      }, 3000);
    }
    window.onblur = function() {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    }
  }
}
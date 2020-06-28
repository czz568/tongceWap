/**
 * 全局配置
 */

var globalConstant = {
    // baseUrl: 'http://172.16.9.58:9501',
   // baseUrl: 'https://tcwgwdev.tospur.com',
     baseUrl: 'https://tcwgwtest.tospur.com',
    //  baseUrl: 'https://tcwgwstag.tospur.com', // uat
  //  baseUrl: 'https://tcwgwprod.tospurhf.com',
  commonParams: {
    appName: 'Web',
    appVersion: '1.0'
  },
  key: 'y2W89L6BkRAFljhN',
  iv: 'dMitHORyqbeYVE0o'
}

/**
 * ajax Post请求业务逻辑处理
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
function apiPost(url, params,tokenName,ifPassword){
   return ajaxPost(url, params,tokenName,ifPassword)
}
function apiGet(url, params,tokenName){
  return ajaxGet(url, params,tokenName)
}
/**
 * post请求
 * @param {Object} url
 * @param {Object} params
 */
function ajaxPost(url, params,tokenName,ifPassword) {
  var options = setOptions('POST', url, params);
  var defer = $.Deferred();
  $.ajax(options);
  // console.log(defer.promise().then(res=>{
  //   console.log(res)
  // }))
  function setOptions(type, url, params) {
    if(!params) params = {};
     $.extend(params, globalConstant.commonParams)
    // console.log('打印明文参数：' + JSON.stringify(params))
    var dataJSON = {
      param: ifPassword?JSON.stringify(params):Encrypt(JSON.stringify(params))
    }
    var options = {
      url: globalConstant.baseUrl + url,
      type: type,
      data: JSON.stringify(dataJSON),
      contentType: 'application/json',
      dataType: 'json',
      timeout: 30000,
      crossDomain: true,
      xhrFields: {
          withCredentials: true //支持跨域
      },
      success: function (callback) {
        console.log("callback",callback)
        if (callback.status.code == 0) {
          ifPassword?defer.resolve(callback.data):defer.resolve(JSON.parse(Decrypt(callback.data)))
        } else {
          defer.reject(callback.status)
        }
      },
      error: function (err) {
        defer.reject(err)
      }
    }
    if(tokenName){
      console.log(getStorage(tokenName))
      if(getStorage(tokenName) && getStorage(tokenName) !== 'null'){
        if (!options['headers']) options['headers'] = {}
        options['headers']['X-Token'] = getStorage(tokenName)
      }
    }else if(getStorage('M-token') && getStorage('M-token') !== 'null'){
      if (!options['headers']) options['headers'] = {}
      options['headers']['X-Token'] = getStorage('M-token')
    }
    return options
  };
  return defer.promise()
}

/**
 * options 设置
 * @param {String} type
 */


/**
 * AES 加解密
 */
var key = CryptoJS.enc.Utf8.parse(globalConstant.key); //十六位十六进制数作为秘钥
var iv = CryptoJS.enc.Utf8.parse(globalConstant.iv); //十六位十六进制数作为秘钥偏移量

//解密方法
function Decrypt(word) {
  // 特殊字符处理
  word = word.replace(/\n/g,'');
  var encryptedHexStr = CryptoJS.enc.Base64.parse(word);
  var srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  var decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}
//加密方法
function Encrypt(word) {
  var srcs = CryptoJS.enc.Utf8.parse(word);
  var encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
}

/* 获取浏览器存储里key为item的值
     @param item 要获取的数据的索引值
     Usage:
     helper.get('token')
     */
    function getStorage(item) {
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
    }

    /* 将数据存储在浏览器存储里
     @param obj 要存储的数据对象
     Usage:
     j.set({ token: 'as23q1sdf212swsxx', uname: 'jacket' })
     */
    function setStorage(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                window.localStorage.setItem(key, encrypt(String(obj[key])));
            }
        }
        // return this
    }
    //清空缓存
    function clearStorage() {
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
        // return this;
    }

  /* 获取浏览器sessionStorage存储里key为item的值
      @param item 要获取的数据的索引值
      Usage:
      helper.get('token')
      */
      function getSession(item) {
        var value;
        value = window.sessionStorage.getItem(item)
        return (value ? decrypt(value) : '')
    }

    /* 将数据存储在浏览器session存储里
     @param obj 要存储的数据对象
     Usage:
     j.set({ token: 'as23q1sdf212swsxx', uname: 'jacket' })
     */
    function setSession(obj) {
      for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
              window.sessionStorage.setItem(key, encrypt(String(obj[key])));
          }
      }
    }
    //清空缓存
      function clearStorage() {
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
    }
    // 加密
    function encrypt(value) {
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
    }

    // 解密
    function decrypt(value) {
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
    }

 source = getUrlParams("from");
 actId = getUrlParams("actId");
 let hmsr=getUrlParams("hmsr") || getStorage("hmsr") || "",hmpl=getUrlParams("hmpl")|| getStorage("hmpl") || '';
function changeSource(newSource){
    source =newSource;
}
if(getUrlParams("from") == "pc"){//如果是pc  需要
   $("html").css({
       width:"750px",
        margin:"auto"

   });
   $("body").addClass("pc");
}
function clickBuilding(){
    $(".main_messList_img").click(function(){
        let id = $(this).attr("buildingId");
        if(source == "app"){//来源于APP
            if (window.android != null) {
                window.android.goBuildingDetial(id)
              } else {
                window.webkit.messageHandlers.goBuildingDetial.postMessage(id);
              }
         }else if(source == "pc"){
             let url = window.location.host;
            if(url.indexOf("mtest")>-1){
              window.location.href = "https://tongcehaofangtest.tospur.com/dynamicPages/buildings/"+id+".html"
            }else if(url.indexOf("mstag")>-1){
                window.location.href = "https://tongcehaofangstag.tospur.com/dynamicPages/buildings/"+id+".html" 
            }else{
                window.location.href = "https://tongcehaofang.com/dynamicPages/buildings/"+id+".html"
            }
         }else{
            window.location.href = "/dynamicPages/mstation/"+id+".html"
         }
    })
}


//APP 告诉要分享
function appShare(){
    if (window.android != null) {
          window.android.canShare('1');
    } else {
      window.webkit.messageHandlers.canShare.postMessage('1');
    }
}
//APP 分享到朋友圈  
window['getShareInfo'] = () => {
  let share = getSession("share")?JSON.parse(getSession("share")):{};
  let href = location.href.split("&from")[0];

  href = href + "&share=share";
    var params = {
      actTitle: share.shareTitle,
      sharePicture:share.sharePicture,
      actContent: share.shareDescription,
      shareLink: href
     
    }
    params = JSON.stringify(params);
    if (window.android != null) {
      window.android.getShareInfo(params);
    } else {
      window.webkit.messageHandlers.getShareInfo.postMessage(params);
    }
}
function receiveCard(e){
  if($(e).hasClass("disabled")){
    return;
  }
  let id = $(e).attr("couponDetailId");
  if(source == "app"){//来源于APP
     if(getStorage("appToken")){
        getCoupon(id)
     }else{
        window.android != null?window.android.goLogin(): window.webkit.messageHandlers.goLogin.postMessage('');
    }
  }else if(source == "pc"){//来源pc
    console.log(getStorage("pcToken"))
    if(getStorage("pcToken")){
       //校验token
       checkLogin(function(){
         getCoupon(id)
       },function(){
        $("#login").load("../../house/html/login.html")
       },"pcToken")
    }else{
        $("#login").load("../../house/html/login.html")
    }
  }else{//来源M站
    let url = location
    if(getStorage("M-token")){
       //校验token
       checkLogin(function(){
        getCoupon(id)
       },function(){
         window.location.href="/#/login?topath="+encodeURIComponent(location.href)+'&backfrom='+window.location.href;
       },"M-token")
    }else{
        window.location.href="/#/login?topath="+encodeURIComponent(location.href)+'&backfrom='+window.location.href;
    }
  }
  
}
let currentId = '';
function getCoupon(couponDetailId){
    console.log(source,couponDetailId)
    currentId = couponDetailId;
    let share = getSession("share")?JSON.parse(getSession("share")):{};
    let couponSource = source == "app"?1:source == "pc"?2:3;
    let tokenName = source == "app"?"appToken":source == "pc"?"pcToken":'M-token';
    let params = {
        couponSource,
        receiveCityCode:cityCode,
        couponDetailId,
        code:share.actId,
        title:share.title,
        hmsr,
        hmpl,

    }
    if(source == "pc")params.customerPhone = getStorage("pcUsername") || '';
    apiPost("/base/preferential/coupon/gain",params,tokenName).then(function(){
         $(".modelCity.right").show();
    },function(err){
        console.log(err.msg)
        if(err.code == 1000){
            showToast('优惠券已存在，请勿重复领取')    
        }else if(err.code == 1001 || err.code == 1006){
            showToast('很遗憾，您不满足参与条件') 
        }else if(err.code == 1002){
            showToast('很遗憾，您来晚了活动已经结束') 
        }else if(err.code == 1003){
            showToast('优惠活动还未开始') 
        }else if(err.code == 1005){
            showToast('领取中，请勿重复领取') 
        }else if(err.code == 1007){
            showToast('很遗憾该优惠券仅注册用户可领取') 
        }else if(err.code == 1008){
            showToast('很遗憾优惠券已领完') 
        }else{
            showToast(err.msg || "领取失败") 
        }
        
    })
}
function lookCrad(){
    $(".modelCity.right").show();
    if(source == 'app'){
     if (window.webkit != null) {
           window.webkit.messageHandlers.goCouponList.postMessage('')
         } else if (window.android != null) {
           window.android.goCouponList()
         }
    }else if(source == 'pc'){
        let url = window.location.host;
        let data = "pcToken="+encodeURIComponent(getStorage("pcToken"))+"&pcUsername="+getStorage("pcUsername");
        if(url.indexOf("mtest")>-1){
          window.open("https://tongcehaofangtest.tospur.com/pages/personal/cardRoll.html?"+data)
        }else if(url.indexOf("mstag")>-1){
            window.open("https://tongcehaofangstag.tospur.com/pages/personal/cardRoll.html?"+data)
        }else{
            window.open("https://tongcehaofang.tospur.com/pages/personal/cardRoll.html?"+data)
        }
    }else{
     window.location.href="/#/myCard?code="+currentId+'&backfrom='+window.location.href;
    }
 }
 //显示提示框
function showToast(text){
    $(".toast").show();
    $(".toast span").text(text);
    setTimeout(function(){
        $(".toast").hide();
    },1500)
}
// 分享
function houseShareConfig() {
  var that = this
  // console.log(window.location)
  var params = {
    url: encodeURIComponent(location.href)
  }
  apiPost('/tospurWeb/wx/serviceNumber/config',params,'',true).then((res) => {
    console.log(9999,res)
    // let res = {
    //   appId: "wxc676238a4a8c47f9",
    //   jsapiTicket: "LIKLckvwlJT9cWIhEQTwfB4YskA-hWVEqnGFMRMV89-2tLknznc6jR3ygQhoC9iaM2uaZp3KhvO8mNFpfKPDHQ",
    //   nonceStr: "JvwBuagyPn",
    //   signature: "03a021e7e14d97b2122dcb6a8640d24fc9dd8a9e",
    //   timeStamp: "1590483239",
    //   url: "https://tcprod.tospurhf.com/h5mc//index.html?appc.html?buildingId=10174&from=singlemessage",
    // }
    let share = getSession("share")?JSON.parse(getSession("share")):{};
    let href = location.href.split("&from")[0];
    href = href + "&share=share";
    console.log()
    wx.config({
      // debug: true, // 开启调试模式
      appId: res.appId, // 必填，公众号的唯一标识
      timestamp: res.timeStamp, // 必填，生成签名的时间戳
      nonceStr: res.nonceStr, // 必填，生成签名的随机串
      signature: res.signature, // 必填，签名
      // jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage"] 
      jsApiList:['updateTimelineShareData', 'updateAppMessageShareData']
    })

		wx.ready(function () {
			var imgurl = share.sharePicture;
			var title = share.shareTitle;
      var desc = share.shareDescription;
      var url = href;
      console.log( share.sharePicture,share.shareTitle,share.shareDescription,href)
			wx.updateTimelineShareData({
				title: title, // 分享标题
				desc: desc, // 分享描述
				link: url, // 分享链接
				imgUrl: imgurl, // 分享图标
				success: function () {
				
				},
				cancel: function () {
					
				}
			});
			wx.updateAppMessageShareData({
        title: title, // 分享标题
				desc: desc, // 分享描述
				link: url, // 分享链接
				imgUrl: imgurl, // 分享图标
				success: function () {
				
				},
				cancel: function () {
				
				}
			})
		});
   });
};
function getUrlParams(name) { 
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


let shareLinkManual = '',actListId = '',sDownPageMark='0',cityCode='', userInfo={}, platform=''
let actStartTime = '',actEndTime='',couponStartTime='',couponEndTime='',couponWenzi = false, btnColor = false,share={},
hmsr=getUrlParams("hmsr") || getStorage("hmsr") || "",
hmpl=getUrlParams("hmpl")|| getStorage("hmpl") ||'';
$(function(){
    // 获取对应参数
    // eslint-disable-next-line no-unused-vars
    var lsParm = '&sDownPageMark=1';
    shareLinkManual = window.location.href.split('?')[0]+ '?actListId='+urlParse().actListId + '&sDownPageMark=1'
    actListId = urlParse().actListId ? urlParse().actListId : 1;
    sDownPageMark = urlParse().sDownPageMark ? urlParse().sDownPageMark.toString() : '0';
    console.log(getUrlParams('Mtoken'),'token-token')
    if(getUrlParams('Mtoken')){setStorage({'M-token': getUrlParams('Mtoken')})}
    console.log(getStorage('M-token'))
    $(".activityMian").click(function(event){
        event.stopPropagation();
    });
    //获取App端的token
    window['appPushToken'] = (userInfo) => {
        appShare();
            setStorage({
                appUserInfo:JSON.stringify(userInfo),
            })
            if (userInfo.token) {
                setStorage({
                    appToken: userInfo.token
                })
            } else {
                setStorage({
                    appToken: ""
                })
            }
    }

    readyCity();
    setTimeout(() => {
    // 获取优惠券信息
    couponData(actListId)
        
        if(getStorage('appUserInfo')){
            userInfo = JSON.parse(getStorage('appUserInfo')) 
        }else{
            userInfo = {}
        }
        
        if (userInfo && userInfo.platform) {
            platform = true
        // 埋点数据 进入页面
            apiPost('/base/bg/preferential/act/burying/point/saveOrUpdate',{actListId: actListId, actPage1: '1', type: '1'}).then((res) => {})
        } else {
            platform = false
        if (sDownPageMark === '0') {
            apiPost('/base/bg/preferential/act/burying/point/saveOrUpdate',{actListId: actListId, actPage1: '1', type: '2'}).then((res) => {})
        }
        }
        // 埋点数据 返回按钮
        window['getMobileBack'] = () => {
            apiPost('/base/bg/preferential/act/burying/point/saveOrUpdate',{actListId: actListId, actPage2: '1', type: '1'}).then((res) => {})
        }
    }, 1000)
})
//获取citycode
function readyCity() {
    let that = this
    let url = 'https://api.map.baidu.com/location/ip?ak=onBnxFbt0v7s9fmhaEpgUktrhyK7duY0&coor=bd09ll';
    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'JSONP',
        success: function (data) {
        apiPost('/building/capp/building/global/onlineCity').then(function(res){
            if (res) {
                for (let key in res) {
                if (res[key].length > 0) {
                    for (let i = 0; i < res[key].length; i++) {
                        if (res[key][i].title === data.content.address) {
                            cityCode = res[key][i].code
                        }
                    }
                }
                }
            }
        })
        },
        error: function (data) {}
    });
};
//获取活动详情数据
function couponData(actListId) {
    console.log(123,actListId)
    var params = {
        actId: actListId
    }
    var u = navigator.userAgent;
    apiPost('/base/preferential/act/index/detailInfo',params).then((res) => {
        console.log(res,123123)
        if (JSON.stringify(res) != "{}") {
            if(res.h5Picture){
                $('.activityPage').css('background-image','url(' + res.h5Picture + ')')
            }
            let actRule = res.rule?res.rule.replace('<br/>', '<br>').split('<br>'):'';
            share = {
                actTitle : res.title,
                shareTitle : res.shareTitle,
                sharePicture : res.sharePicture,
                actContent : res.shareDescription,
                couponDetailId : res.couponDetailId,
                code : res.code,
                title : res.title,
                actRule : res.rule?res.rule.replace('<br/>', '<br>').split('<br>'):''
            }
            setSession({share:JSON.stringify(share)});
            let ruleStr = ''
            if(actRule){
                actRule.forEach(item=>{
                    ruleStr+='<li>'+ item +'</li>' 
                })
            }
            $('.activityMian ul').html(ruleStr)
        if (u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
            actStartTime = res.beginTime.replace(/-/g, '/')
            actEndTime = res.endTime.replace(/-/g, '/')
            couponStartTime = res.receiveTimeStart.replace(/-/g, '/')
            couponEndTime = res.receiveTimeEnd.replace(/-/g, '/')
        } else {
            actStartTime = res.beginTime
            actEndTime = res.endTime
            couponStartTime = res.receiveTimeStart;
            couponEndTime = res.receiveTimeEnd;
        }
            var actData = res
            setTitle(res.title);
            countDown();
            houseShareConfig();
        }
    })
}

function btnClick() {
    if (btnColor) { // true为活动还在 false活动结束
        if (platform) { // true为app false不是
            if (!getStorage('appToken')) {
                if (window.webkit != null) {
                window.webkit.messageHandlers.goLogin.postMessage('')
                } else if (window.android != null) {
                window.android.goLogin()
                }
            } else {
                    let params = {
                    couponSource: '1',
                    receiveCityCode: cityCode ? cityCode : '310100000',
                    couponDetailId: share.couponDetailId,
                    code: actListId,
                    title: share.title,
                    hmsr,hmpl
                    }
                    
                    apiPost('/base/preferential/coupon/gain',params,'appToken').then((res) => {
                        
                        if (JSON.stringify(res) == '{}') {
                            $('.awardText').text('优惠劵领取成功')
                            $('.couponSuc').css('display','block')
                            // 埋点数据 领取成功弹框
                            apiPost('/base/bg/preferential/act/burying/point/saveOrUpdate',{actListId: actListId, actPage6: '1', type: '1'}).then((res) => {})
                        }
                    setTimeout(() => {
                        // 埋点数据 立即领券
                        apiPost('/base/bg/preferential/act/burying/point/saveOrUpdate',{actListId: actListId, actPage3: '1', type: '1'}).then((res) => {})
                    }, 2000)
                    // 用 loginType 字段0:一键登录  1:验证码登录
                    window['appPushToken'] = (userInfo) => {
                        if (userInfo.loginType) { // 0:一键登录  1:验证码登录
                            apiPost('/base/bg/preferential/act/burying/point/saveOrUpdate',{actListId: actListId, login1: '1', type: '1'}).then((res) => {})
                        } else {
                            apiPost('/base/bg/preferential/act/burying/point/saveOrUpdate',{actListId: actListId, mobile1: '1', type: '1'}).then((res) => {})
                        }
                    }
                    },function(err){
                        console.log(err.msg)
                        
                        if (err.code === '1000') {
                            showToast('优惠券已存在，请勿重复领取')
                        }
                        if (err.code === '1001') {
                            showToast('很遗憾，您不满足参与条件')
                        }
                        if (err.code === '1002') {
                            showToast('很遗憾，您来晚了活动已结束！')
                        }
                        if (err.code === '1003') {
                            showToast('优惠活动还未开始！')
                        }
                        if (err.code === '1005') {
                            showToast('领取中，请勿重复领取！')
                        }
                        if (err.code === '1007') {
                            showToast('很遗憾该优惠券仅注册用户可领取')
                        }
                        if (err.code === '1008') {
                            showToast('很遗憾优惠券已领完！')
                        }
                    })
                }
            } else {
                console.log(urlParse().Mtoken,111)
            if (!urlParse().Mtoken && urlParse().Mtoken != '') {
                window.location.href = "/#/login?topath=" + encodeURIComponent(window.location.href);
                // if (window.location.host.indexOf('tongcehaofang') !== -1) { // 正式
                //     let url = 'https://m.tongcehaofang.com/#/login?topath=' + encodeURIComponent(window.location.href)
                //     window.open(url);
                    
                // } else if (window.location.host.indexOf('mstag') !== -1) { // uat
                //     let url = 'https://mstag.tospur.com/#/login?topath=' + encodeURIComponent(window.location.href)
                //     window.open(url);
                // } else {
                // let url = 'https://mtest.tospur.com/#/login?topath=' + encodeURIComponent(window.location.href)
                //     window.open(url);
                // }
            } else {
                let params = {
                    couponSource: '3',
                    receiveCityCode: cityCode ? cityCode : '310100000',
                    couponDetailId: share.couponDetailId,
                    code: actListId,
                    title: share.title
                }
                // 埋点数据 立即领券
                apiPost('/base/preferential/coupon/gain',params,'M-token').then((res) => {
                    console.log(res)
                    if (JSON.stringify(res) == '{}') {
                        $('.awardText').text('优惠劵领取成功')
                        $('.couponSuc').css('display','block')
                        // 埋点数据 领取成功弹框
                        apiPost('/base/bg/preferential/act/burying/point/saveOrUpdate',{actListId: actListId, actPage6: '1', type: '2'}).then((res) => {})
                    }
                },function(err){
                        console.log(err)
                        
                        if (err.code === '1000') {
                            showToast('优惠券已存在，请勿重复领取')
                        }
                        if (err.code === '1001') {
                            showToast('很遗憾，您不满足参与条件')
                        }
                        if (err.code === '1002') {
                            showToast('很遗憾，您来晚了活动已结束！')
                        }
                        if (err.code === '1003') {
                            showToast('优惠活动还未开始！')
                        }
                        if (err.code === '1005') {
                            showToast('领取中，请勿重复领取！')
                        }
                        if (err.code === '1007') {
                            showToast('很遗憾该优惠券仅注册用户可领取')
                        }
                        if (err.code === '1008') {
                            showToast('很遗憾优惠券已领完！')
                        }
                })
                setTimeout(() => {
                    apiPost('/base/bg/preferential/act/burying/point/saveOrUpdate',{actListId: actListId, actPage3: '1', type: '2'}).then((res) => {})
                    apiPost('/base/bg/preferential/act/burying/point/saveOrUpdate',{actListId: actListId, mobile1: '1', type: '2'}).then((res) => {})
                }, 2000)
            }
        }
    } else {
        showToast('未在活动期间内！')
    }
}

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

setTitle = function(title) {
    title = title ? `${title}` : '同策网'
    window.document.title = title
}
// 计算器补位
function timeFormat(param) {
    return param < 10 ? '0' + param : param;
}

//定时器
function countDown(it) {
    var interval = setInterval(() => {
      // 获取当前时间，同时得到活动结束时间数组
    var newTime = new Date().getTime();
    // 对结束时间进行处理渲染到页面
    var StartTime = new Date(actStartTime).getTime();
    var endTime = new Date(actEndTime).getTime();
    var CstartTime = new Date(couponStartTime).getTime();
    var CendTime = new Date(couponEndTime).getTime();
    var obj = null;
    // 如果活动未结束，对时间进行处理
    if (newTime >= StartTime && newTime <= endTime) {
        couponWenzi = false
        if(couponWenzi){
            $('.one_btn').text('未在活动期间内')
            $('.phone_btn_cl').text('未在活动期间内')
        }else{
            $('.one_btn').text('立即领劵')
            $('.phone_btn_cl').text('立即领劵')
        }
        if (newTime >= CstartTime && newTime <= CendTime) {
            var time = (endTime - newTime) / 1000;
            // 获取天、时、分、秒
            var day = parseInt(time / (60 * 60 * 24));
            var hou = parseInt(time % (60 * 60 * 24) / 3600);
            var min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
            var sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
            obj = {
                day: timeFormat(day),
                hou: timeFormat(hou),
                min: timeFormat(min),
                sec: timeFormat(sec)
            };
            btnColor = true
            if(btnColor){
                $('.one_btn').addClass('successBtn')
                $('.phone_btn_cl').addClass('successBtn')
            }else{
                $('.one_btn').addClass('failBtn')
                $('.phone_btn_cl').addClass('failBtn')
            }
        } else { // 活动已结束，全部设置为'00'
            obj = {
            day: '00',
            hou: '00',
            min: '00',
            sec: '00'
            };
            btnColor = false
            if(btnColor){
                $('.one_btn').addClass('successBtn')
                $('.phone_btn_cl').addClass('failBtn')
            }else{
                $('.one_btn').addClass('failBtn')
                $('.phone_btn_cl').addClass('failBtn')
            }
            clearInterval(interval);
        }
    } else {
        obj = {
            day: '00',
            hou: '00',
            min: '00',
            sec: '00'
            };
        btnColor = false
        if(btnColor){
            $('.one_btn').addClass('successBtn')
            $('.phone_btn_cl').addClass('failBtn')
        }else{
            $('.one_btn').addClass('failBtn')
            $('.phone_btn_cl').addClass('failBtn')
        }
            couponWenzi = true
            if(couponWenzi){
                $('.one_btn').text('未在活动期间内')
                $('.phone_btn_cl').text('未在活动期间内')
            }{
                $('.one_btn').text('立即领劵')
                $('.phone_btn_cl').text('立即领劵')
            }
    }
        $('#dayTime').text(obj.day)
        $('#houTime').text(obj.hou)
        $('#minTime').text(obj.min)
        $('#secTime').text(obj.sec)
    }, 1000);
}
// 分享
function houseShareConfig() {
    var that = this
    // console.log(window.location)
    var params = {
        url: encodeURIComponent(location.href)
    }
    console.log(share.shareTitle,'分享标题')
    console.log(share.actContent,'分享描述')
    console.log(shareLinkManual,'分享链接')
    console.log(share.sharePicture + '?x-oss-process=image/resize,m_lfit,w_100,h_100','分享图标')
    apiPost('/tospurWeb/wx/serviceNumber/config',params,'',true).then((res) => {
        console.log(9999,res)
        wx.config({
            // debug: true, // 开启调试模式
            appId: res.appId, // 必填，公众号的唯一标识
            timestamp: res.timeStamp, // 必填，生成签名的时间戳
            nonceStr: res.nonceStr, // 必填，生成签名的随机串
            signature: res.signature, // 必填，签名
            jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage"] 
        })
        wx.ready(function () {
            var imgurl = 'https://test.shhxfyl.com/image/default/0A9184459F55463FB5D091C65ECFE33D-6-2.jpg';
            var title = '66666';
            var desc = '999999999';
            var url = "www.baidu.com";
            wx.updateTimelineShareData({
                title: share.shareTitle, // 分享标题
                desc: share.actContent, // 分享描述
                link: shareLinkManual, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: share.sharePicture + '?x-oss-process=image/resize,m_lfit,w_100,h_100', // 分享图标
                success: function () {
                },
                cancel: function () {
                }
            });
            wx.updateAppMessageShareData({
                title: share.shareTitle, // 分享标题
                desc: share.actContent, // 分享描述
                link: shareLinkManual, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: share.sharePicture + '?x-oss-process=image/resize,m_lfit,w_100,h_100', // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                },
                cancel: function () {
                }
            })
        });
    });
}

function urlParse () {
    let url = window.location.search;
    let obj = {};
    let reg = /[?&][^?&]+=[^?&]+/g;
    let arr = url.match(reg);
    // ['?id=123232', '&a=b']
    if (arr) {
        arr.forEach((item) => {
            let tempArr = item.substring(1).split('=');
            let key = decodeURIComponent(tempArr[0]);
            let val = decodeURIComponent(tempArr[1]);
            obj[key] = val;
        });
    }
    return obj;
};

function ruleClick() {
    $('.activityRules').css('display','block')
    if (platform) {
        // 埋点数据 活动规则按钮
        apiPost('/base/bg/preferential/act/burying/point/saveOrUpdate',{actListId: actListId, actPage4: '1', type: '1'}).then((res) => {})
    } else {
        if (sDownPageMark === '0') {
            apiPost('/base/bg/preferential/act/burying/point/saveOrUpdate',{actListId: actListId, actPage4: '1', type: '2'}).then((res) => {})
        }
    }
}

//去查看
function goCheck() {
    if (platform) {
        // 埋点数据 去查看按钮
        apiPost('/base/bg/preferential/act/burying/point/saveOrUpdate',{actListId: actListId, actPage7: '1', type: '1'}).then((res) => {})
        if (window.webkit != null) {
        window.webkit.messageHandlers.goCouponList.postMessage('')
        } else if (window.android != null) {
        window.android.goCouponList()
        }
    } else {
        apiPost('/base/bg/preferential/act/burying/point/saveOrUpdate',{actListId: actListId, actPage7: '1', type: '2'}).then((res) => {})
        window.location.href = '/#/myCard'
        // if (window.location.host.indexOf('tongcehaofang') !== -1) { // 正式
        //     window.open('https://m.tongcehaofang.com/#/myCard');
        // } else if (window.location.host.indexOf('mstag') !== -1) { // uat
        //     window.open('https://mstag.tospur.com/#/myCard');
        // } else {
        //     window.open('https://mtest.tospur.com/#/myCard');
        // }
    }
}
function closeFun() {
    $('.couponSuc').css('display','none')
}
function determineFun() {
    $('.activityRules').css('display','none')
}
 //显示提示框
function showToast(text){
    $(".toast").show();
    $(".toast span").text(text);
    setTimeout(function(){
        $(".toast").hide();
    },1500)
}
//APP 告诉要分享
function appShare(){
    if (window.android != null) {
        window.android.canShare('1');
    } else {
    window.webkit.messageHandlers.canShare.postMessage('1');
    }
}
// 分享朋友圈
window['getShareInfo'] = () => {
// 埋点数据 活动分享按钮
apiPost('/base/bg/preferential/act/burying/point/saveOrUpdate',{actListId: actListId, actPage5: '1', type: '1'}).then((res) => {})
    var params = {
        actListId: actListId,
        actTitle: share.shareTitle,
        sharePicture: share.sharePicture,
        actContent: share.actContent,
        shareLink: shareLinkManual,
        ip: window.returnCitySN['cip'] || '00.000.000.00',
        terminalType: 1,
        phone: (userInfo && userInfo.phone) || ''
    }
    params = JSON.stringify(params);
    if (window.android != null) {
        window.android.getShareInfo(params);
    } else {
        window.webkit.messageHandlers.getShareInfo.postMessage(params);
    }
}
let api = {
    haoFanglist: '/building/pc/building/buildingRecommendMainPush', // 好房推荐 
    pageFooter: '/building/pc/building/pageFooter', //底部接口
    customerList: "/base/preferential/act/index/getBuildingPreferentialActCouponDetailList", //优惠券列表
    buildingUnitList: '/building/pc/buildingUnit/buildingUnitList', //楼栋分布
    getHousekeeperList: '/tospurWeb/v1/capp/rongcloud/new/getHousekeeperList', //优秀管家
    changePhone: '/tospurWeb/api/capp/v1/user/getUserPhone', //获取404手机号码
    changePhoneNotLogin: '/tospurWeb/capp/v2/user/getUserPhone', //没有登录获取 获取404手机号码
    requestMess: '/customer/mweb/customer/record/addRecord', //咨询
    allCity: "/building/capp/building/onlineCity",
    buildingBaseInfo: "/building/capp/building/buildingBaseInfo"
}
checkChannel()
let id = $(".app").attr("buildingId");
let cityCode = "310100000";
let selectedFlag, phone, localName = location.href;
let urlAread = false;
let share = {}
$(function () {
    buildmessInit();
    scrollDom();
    getHouseList();
    $(".spread_main_img").attr("src") && getBuildingUnit();
    getKeeperList();
    getAllCity();
    getFooterMess();
    getCustomerList();
    BaseInfo();
    backys();
    goHome();
    openApp();
})

//增加backHome
function backys(){
    $(".cellQuan").after("<div class='backHome'></div>");
}
function goHome(){
    $(".backHome").click(function () {
        window.location.href = "/#/home";
    });
}
function openApp() {
    $('.houseShare_baseMess_buttons').click(function () {
        downloadIfWeixin()
    })
}

function BaseInfo() {
    let params = {
        buildingId: id
    }
    apiPost(api.buildingBaseInfo, params).then(function (res) {
        if (res) {
            share = res
            console.log(share, '分享数据分享数据分享数据分享数据')
            houseShareConfig();
        }
    })
}

function AveragePrice(type, min) { //均价格式化
    if (min == null) {
        return '均价待定'
    } else {
        if (type == 1) {
            return `  均价  ${min} 元/㎡`
        } else {
            return `  均价  ${min}元/㎡起`
        }
    }
};

function houseShareConfig() {
    var that = this
    // console.log(window.location)
    console.log(share.buildingAlias, AveragePrice(share.referenceAveragePriceType, share.referenceAveragePrice), '分享标题')
    console.log(share.buildingBrightSpot, '分享描述')
    console.log(window.location.href, '分享标题')
    console.log(share.albumCoverPicture + '?x-oss-process=image/resize,m_lfit,w_100,h_100', '分享图片')
    var params = {
        url: encodeURIComponent(location.href)
    }
    apiPost('/tospurWeb/wx/serviceNumber/config', params, '', true).then((res) => {
        console.log(9999, res)
        // let res = {
        //   appId: "wxc676238a4a8c47f9",
        //   jsapiTicket: "LIKLckvwlJT9cWIhEQTwfB4YskA-hWVEqnGFMRMV89-2tLknznc6jR3ygQhoC9iaM2uaZp3KhvO8mNFpfKPDHQ",
        //   nonceStr: "JvwBuagyPn",
        //   signature: "03a021e7e14d97b2122dcb6a8640d24fc9dd8a9e",
        //   timeStamp: "1590483239",
        //   url: "https://tcprod.tospurhf.com/h5mc//index.html?appc.html?buildingId=10174&from=singlemessage",
        // }
        wx.config({
            // debug: true, // 开启调试模式
            appId: res.appId, // 必填，公众号的唯一标识
            timestamp: res.timeStamp, // 必填，生成签名的时间戳
            nonceStr: res.nonceStr, // 必填，生成签名的随机串
            signature: res.signature, // 必填，签名
            jsApiList: ["updateAppMessageShareData", "updateTimelineShareData"]
        })
        wx.ready(function () {
            var _title = share.buildingAlias + AveragePrice(share.referenceAveragePriceType, share.referenceAveragePrice)
            wx.updateAppMessageShareData({
                title: _title, // 分享标题
                desc: share.buildingBrightSpot, // 分享描述
                link: window.location.href, // 分享链接
                imgUrl: share.albumCoverPicture + '?x-oss-process=image/resize,m_lfit,w_100,h_100', // 分享图标
                success: function () {},
                cancel: function () {}
            });
            wx.updateTimelineShareData({
                title: _title, // 分享标题
                desc: share.buildingBrightSpot, // 分享描述
                link: window.location.href, // 分享链接
                imgUrl: share.albumCoverPicture + '?x-oss-process=image/resize,m_lfit,w_100,h_100', // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {},
                cancel: function () {}
            })
        });
    });
};

function checkChannel() {
    var ua = navigator.userAgent,
        isWindowsPhone = /(?:Windows Phone)/.test(ua),
        isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
        isAndroid = /(?:Android)/.test(ua),
        isFireFox = /(?:Firefox)/.test(ua),
        isChrome = /(?:Chrome|CriOS)/.test(ua),
        isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
        isPhone = /(?:iPhone)/.test(ua) && !isTablet,
        isPc = !isPhone && !isAndroid && !isSymbian;
    let os = {
        isTablet: isTablet,
        isPhone: isPhone,
        isAndroid: isAndroid,
        isPc: isPc
    };
    if (os.isTablet || os.isPc) {
        document.querySelector("html").style.width = "750px";
        document.querySelector("html").style.margin = "auto";
        document.querySelector("body").classList.add("pc")
        // let iWidth = document.documentElement.clientWidth;
        // document.getElementsByTagName('html')[0].style.fontSize = 100 * iWidth / 750 + 'px'; 
    }
}

function buildmessInit() {
    //简介 全部展示问题
    introduct();
    new Swiper('.highlightsBanner', {
        on: {
            slideChangeTransitionEnd: function () {
                changeLight(this.activeIndex); //切换结束时，告诉我现在是第几个slide
            },
        },
    });
    //判断是否收藏
    let selected;
    phone = getStorage("phoneNum")
    if ((phone = getStorage("phoneNum")) && (selected = getStorage(phone))) {
        selected = selectedFlag = JSON.parse(selected);
        if (selected[id]) $(".houseShare_footer_star .iconfont").removeClass("iconfavorite_line").addClass("iconfavorite_surface");

    }
    $(".lunbo_img_span").each(function (i, item) {
        if (i == 0) $(item).addClass("spanColor");
        if (i == 0 && $(item).text() == "图片") $(".lunbo_img_num").show()

    })
    domClick();
}

function getCustomerList() {
    apiPost(api.customerList, {
        buildingId: id
    }).then(function (res) {
        if (res && res.result) {
            let str = "";
            res.result.forEach(item => {
                let over = item.received == "false" ? '' : "over";
                let mess = item.received == "false" ? '立即领取' : "已领取";
                str += '<div class="couponList ' + over + '">' +
                    '   <div class="couponList_mainLift">' +
                    '      <span class="couponList_mainLift_span1">' +
                    '          <em class="iconfont iconicon_currency"></em>' +
                    '          <p class="couponList_mainLift_p">' + item.couponName + '</p>' +
                    '      </span>' +
                    '      <span class="couponList_mainLift_span2">' + item.couponDescribe + '</span>' +
                    '   </div>' +
                    '   <div class="couponList_mainRight">' +
                    '        <span class="couponList_mainRight_button"><i class="couponList_mainRight_mess" couponDetailId=' + item.couponDetailId + ' onclick="getCard(this)">' + mess + '</i></span>' +
                    '   </div>' +
                    '</div>'
            })
            $(".coupon").html(str)
        }
    }, function () {

    })
}

function showMoudleforCard() {
    let sd = '<div class="modelSearch rightGet" style="display: block;">' +
        '  <div class="modelMain">' +
        '    <div class="modelMain_header">优惠券领取成功</div>' +
        '    <div class="modelMain_footer">' +
        '        <div class="model_footer_button cancel" onclick="cancelModel()">取消</div>' +
        '        <div class="model_footer_button sure" onclick="pushCard()">去查看</div>' +
        '    </div>' +
        '  </div>' +
        '</div>'
    $("body").append(sd)
}

function showToast(mess) {
    let sd = '<div class="toast"><span>' + mess + '</span></div>';
    $("body").append(sd);
    setTimeout(function () {
        $(".toast").remove();
    }, 1500)
}

function cancelModel() {
    $(".modelSearch.rightGet").remove();
}

function pushCard() {
    $(".modelSearch.rightGet").remove();
    window.location.href = "/#/myCard?code=" + couponDetailId+'&backfrom='+window.location.href;
}
let currentGun, 
hmsr=getUrlParams("hmsr") || getStorage("hmsr") || "",hmpl=getUrlParams("hmpl")|| getStorage("hmpl") || '';

function domClick() {
    $(".img_num_t").text($(".lunbo_img_span.img").attr("num"));
    $(".lunbo_img_span").click(function () {
        let num = prevTotal($(this)),
            width = $(".lunbo_img .swiper-slide").width();
        $(".lunbo_img_span").removeClass("spanColor");
        $(this).addClass("spanColor");
        if ($(this).text() == "图片") {
            $(".img_num_c").text(1)
            $(".lunbo_img_num").show();
        } else {
            $(".lunbo_img_num").hide();
        }
        $(".highlightsBanner .swiper-wrapper").css("transform", 'translate3d(' + -num * width + 'px, 0px, 0px)');


    });
    $(".couponList_mainRight_button").click(function () {
        if (!TOOL.getToken("M-token")) {
            window.location.href = "/#/login?topath=" + localName;
            return;
        }
        if ($(this).text() == "立即领取") {
            console.log("立即领取")
        }
    });
    $(".houseStyles").each(function (i, item) {
        $(item).click(function () {
            $(".houseStyles").removeClass("baseColor");
            $(this).addClass("baseColor");
            $(".houseStyleMess").hide();
            $($(".houseStyleMess")[i]).show();

        })
    });

    $(".houseStyleMess_imgDiv").click(function () {
        let currentId = $(this).attr("currentId");
        window.location.href = "/#/houseTypeDetails/" + id + "/" + currentId+'?backfrom='+window.location.href;
    })
    $(".cellQuan").click(function () {
        if (!TOOL.getToken("M-token")) {
            window.location.href = "/#/login?topath=myCard";
            return;
        }
        window.location.href = "/#/myCard?backfrom="+window.location.href;
    });
    

    $(".model_footer_button.cancel").click(function () {
        $(".modelSearch").hide();
    })
    $(".model_footer_button.sure").click(function () {
        let name = $(".content_name.name").val(),
            phone = $(".content_name.phone").val();
        if (!name) {
            $(".content_error").show().text("请完善信息再提交")
            return;
        };
        if (!(/^[1][3,4,5,7,8,9][0-9]{9}$/.test(phone))) {
            $(".content_error").show().text("请填写正确的手机号码")
            return;
        };
        submitMess({
            phone,
            customerName: name,
            source: 1,
            buildId: id,
            hmsr,
            hmpl,
        })
    })
    $(".houseShare_footer_telphone.footerButton").click(function () {
        $(".modelSearch").show()
    })
    $(".houseShare_footer_star").click(function () {
        var that = this;

        if (TOOL.getToken("M-token")) {
            //校验token
            checkLogin(function () {
                if ($(that).find(".iconfont").hasClass("iconfavorite_line")) {
                    $(".houseShare_footer_star .iconfont").removeClass("iconfavorite_line").addClass("iconfavorite_surface");
                    $("body").append("<div class='toast'>收藏成功, 请在APP内查看</div>");
                    setTimeout(function () {
                        $(".toast").remove()
                    }, 1000)
                    if (selectedFlag) {
                        selectedFlag[id] = {};
                        setStorage({
                            [phone]: JSON.stringify(selectedFlag)
                        })
                    } else {
                        let obj = {
                            [id]: {}
                        };
                        setStorage({
                            [phone]: JSON.stringify(obj)
                        })
                    }
                } else {
                    $(".houseShare_footer_star .iconfont").removeClass("iconfavorite_surface").addClass("iconfavorite_line");
                    $("body").append("<div class='toast'>您已取消收藏</div>");
                    setTimeout(function () {
                        $(".toast").remove()
                    }, 1000)
                    let selectedFlag = getStorage("phone");
                    delete selectedFlag[id];
                    setStorage({
                        [phone]: JSON.stringify(selectedFlag)
                    })
                }
            }, function () {
                window.location.href = "/#/login?topath=" + localName;
            }, "M-token")
        } else {
            window.location.href = "/#/login?topath=" + localName;
        }





        // if (!TOOL.getToken("M-token")) {
        //     window.location.href = "/#/login?topath=" + localName;
        //     return;
        // }
        // if ($(this).find(".iconfont").hasClass("iconfavorite_line")) {
        //     $(".houseShare_footer_star .iconfont").removeClass("iconfavorite_line").addClass("iconfavorite_surface");
        //     $("body").append("<div class='toast'>收藏成功, 请在APP内查看</div>");
        //     setTimeout(function () {
        //         $(".toast").remove()
        //     }, 1000)
        //     if (selectedFlag) {
        //         selectedFlag[id] = {};
        //         setStorage({
        //             [phone]: JSON.stringify(selectedFlag)
        //         })
        //     } else {
        //         let obj = {
        //             [id]: {}
        //         };
        //         setStorage({
        //             [phone]: JSON.stringify(obj)
        //         })
        //     }
        // } else {
        //     $(".houseShare_footer_star .iconfont").removeClass("iconfavorite_surface").addClass("iconfavorite_line");
        //     $("body").append("<div class='toast'>您已取消收藏</div>");
        //     setTimeout(function () {
        //         $(".toast").remove()
        //     }, 1000)
        //     let selectedFlag = getStorage("phone");
        //     delete selectedFlag[id];
        //     setStorage({
        //         [phone]: JSON.stringify(selectedFlag)
        //     })
        // }
    })
    $(".lunbo_img .swiper-slide").click(function () {
        if ($(this).find(".lunbo_img_play").length > 0) {
            if ($(this).find(".lunbo_img_play.VR").length > 0) {
                let url = $(this).find(".lunbo_img_play.VR").attr("code");
                window.open(url)
            } else {
                let code = $(this).find(".lunbo_img_play").attr("code");
                window.location.href = "/#/videoPlayer?buildingId=" + id
            }
        } else {
            window.location.href = "/#/housePhoto/" + id+'?backfrom='+window.location.href;
        })
        }
    })
    $(".maoList").each(function (index, item) {
        let id = $(this).attr("currentName");
        if ($("." + id).length < 1 || $("." + id).css("display") == "none") {
            $(this).remove();
        }
    })
    if ($(".lunbo_price_num").text() == "待定") {
        $(".lunbo_price_img2").remove();
    }

}
//点击切换锚点链接
$(".maoList").each(function (i, item) {
    $(item).click(function (e) {
        $(".maoList").removeClass("active")
        $(this).addClass("active");
        let id = $(this).attr("currentName");
        currentGun = true;
        // let to = $('.'+id).offset().top-60;
        let to = allHeights[i] - 38;
        $('html,body').animate({
            scrollTop: to
        }, 500)
        // {scrollTop: $('.'+id).offset().top-80}
        setTimeout(_ => {
            currentGun = false;
        }, 600)
    })

})
//领取优惠券
let couponDetailId = '';

function getCard(e) {
    if (!getStorage("M-token")) {
        window.location.href = "/#/login?topath=" + encodeURIComponent(location.href);
        return;
    }
    couponDetailId = $(e).attr("couponDetailId");
    let cityCode = getStorage("storageCity") ? JSON.parse(getStorage("storageCity")).code : '310100000';
    let params = {
        couponSource: 3,
        receiveCityCode: cityCode,
        couponDetailId,
        hmsr,
        hmpl,
        buildingId:id
    }
    //if(source == "pc")params.customerPhone = getStorage("pcUsername") || '';
    apiPost("/base/preferential/coupon/gain", params).then(function () {
        getCustomerList();
        showMoudleforCard();

    }, function (err) {
        console.log(err.msg)
        if (err.code == 1000) {
            showToast('优惠券已存在，请勿重复领取')
        } else if (err.code == 1001 || err.code == 1006) {
            showToast('很遗憾，您不满足参与条件')
        } else if (err.code == 1002) {
            showToast('很遗憾，您来晚了活动已经结束')
        } else if (err.code == 1003) {
            showToast('优惠活动还未开始')
        } else if (err.code == 1005) {
            showToast('领取中，请勿重复领取')
        } else if (err.code == 1007) {
            showToast('很遗憾该优惠券仅注册用户可领取')
        } else if (err.code == 1008) {
            showToast('很遗憾优惠券已领完')
        } else {
            showToast(err.msg)
        }

    })
}
//清除某个锚点
function clearPoint(name) {
    $(".maoList").each(function (i, item) {
        if ($(item).attr("currentName") == name) $(item).remove()
    })
    $(".maoList").each(function (index, item) {
        let id = $(this).attr("currentName");
        if ($("." + id).length < 1 || $("." + id).css("display") == "none") {
            $(this).remove()
        }
    })
}

function modelHide() {
    $(".content_error").hide()
}

function prevTotal(dom) {
    let num = 0;
    dom && $(dom).prevAll().each(function (i, res) {
        num += $(res).attr("num") - 0
    })
    return num;
}

function changeLight(num) {
    let c = 0,
        n = 0,
        t = 0;
    $(".lunbo_img_span").each(function (i, item) {
        n = prevTotal($(item)) - 1;
        t = $(this).attr("num") - 0 + n;
        if (i == 0 && num <= t) return c = i;
        if (i > 0 && num <= t && num > n) c = i;
    })
    $(".lunbo_img_span").removeClass("spanColor");
    let currentImg = $(".lunbo_img_span")[c];
    $(currentImg).addClass("spanColor");
    if ($(currentImg).text() == "图片") {
        $(".lunbo_img_num").show();
        $(".img_num_c").text(num - n)
    } else {
        $(".lunbo_img_num").hide();
    }
    if (num >= 1 && !urlAread) {
        urlAread = true;
        $(".lunbo_img_current").each(function (i, item) {
            $(item).attr("currenturl") && $(item).css({
                "backgroundImage": "url(" + $(item).attr("currenturl") + ")"
            })
        })
    }
}

function introduct() {
    let h = $(".introduce_mess").height();
    if (h > 48) {
        $(".introduce_more").show();
        $(".introduce_mess").addClass("active");
    };
    $(".introduce_more").click(function () {
        if ($(this).text() == "全文") {
            $(".introduce_mess").removeClass("active");
            $(this).text("收起");
        } else {
            $(".introduce_mess").addClass("active");
            $(this).text("全文");
        }
    })
}
//页面滚动  锚点固定
let review = true,
    allHeights = []

function scrollDom() {
    let scrollHeight = 0,
        currentPoint = 0,
        flag = true,
        flag1 = true,
        flag2 = true;
    $(window).scroll(() => {
        // 获取当前滚动的高度
        var top = document.body.scrollTop + document.documentElement.scrollTop;
        top = top + 50;
        var zhouTop = $("#zhoubian").scrollTop();
        if (scrollHeight != document.body.scrollHeight || review) {
            if (review) review = false;
            scrollHeight = document.body.scrollHeight;
            allHeights = [];
            $(".maoList").each((index, item) => {
                let top = '',
                    s = $("." + $(item).attr("currentname"));
                allHeights.push(s.offset().top)
            })
        }
        let index = 0;
        if (top >= allHeights[allHeights.length - 1]) {
            index = allHeights.length - 1
        } else {
            $(allHeights).each((i, res) => {

                if (top < res && top > allHeights[i - 1]) return index = i - 1
            })
        }
        if (currentPoint != index && !currentGun) {
            currentPoint = index;
            $(".maoList").removeClass("active");
            $($(".maoList")[index]).addClass("active")
        }

        // 滚动条距离顶部的距离 大于 200px时
        if (top >= 400 && flag) {
            flag = false;
            $(".mao").show()
        } else if (top < 400) {
            flag = true;
            $(".mao").hide();
        }
        //滚动条距离顶部的距离 到地图的距离快100的时候
        if (top > 100 && flag1) {
            // width='1200' height='640'
            flag1 = false;
            $("<iframe  width='100%' height='360' src='/house/html/house_map.html' id='iFrame' name='iFrame' frameborder='no' marginheight='0' marginwidth='0' allowTransparency='true'></iframe>").prependTo('#zhoubian .spread_main');
        }
        //滚动条距离顶部的距离 到地图的距离快100的时候
        if (top > 200 && flag2) {
            flag2 = false;
            $.getScript('/house/js/pinchzoom.js').done(function () {
                new RTP.PinchZoom($(".spread_main_all"), {});
            })
        }
    });
};
//好房推荐
function getHouseList() {
    var params = {
        city: getStorage('cityCode') || '310100000',
    }
    apiPost(api.haoFanglist, params).then(function (data) {
        if (data && data.list.length > 0) {
            let str = '';
            data.list.slice(0, 3).forEach(item => {
                item.propertyType = item.propertyType.split(",")[0];
                item.salesStatus = item.salesStatus.split(",")[0];
                let url = item.albumCoverPicture ? item.albumCoverPicture : "/img/pic_default_big@2x.png";
                let price = item.referenceAveragePrice ? item.referenceAveragePrice : item.referenceAveragePriceMax ? item.referenceAveragePriceMax : '暂无价格';
                let propertyTypes = propertyType(item.propertyType) ? '<span class="houseShare_baseMess_span2 fs10 fl">' + propertyType(item.propertyType) + '</span>' : '';
                let salesStatusDom = salesStatus(item.salesStatus) ? `<span class="houseShare_baseMess_span2 fs10 fl houseShare_baseMess_span3">${salesStatus(item.salesStatus)[0]}</span>` : ''
                let area = item.referenceBuildAreaMin ?
                    (item.referenceBuildAreaMax ? `${item.referenceBuildAreaMin}-${item.referenceBuildAreaMax}` : item.referenceBuildAreaMin) :
                    item.referenceBuildAreaMax ? item.referenceBuildAreaMax : '暂无建面'
                let areaMess = area == "暂无建面" ? "暂无建面" : ` 建面 ${area} ㎡`;
                let buildingTag = '';
                item.buildingTag && item.buildingTag.split(",").forEach((item, index) => {
                    if (index >= 3) return;
                    buildingTag += '<span class="recommend_lists_goodList">' + item + '</span>'
                })
                str += '<div class="listFor" currentId = ' + item.id + '>' +
                    '  <div class="recommend_lists clearfloat">' +
                    '    <div class="recommend_lists_one disLB">' +
                    '       <img class="recommend_lists_img"   src=' + url + ' alt="">' +
                    '    </div>' +
                    '    <div class="disLB">' +
                    '      <div class="recommend_lists_address clearfloat" >' +
                    '        <span class="fl mt2" >' + item.buildingAlias + '</span>' +
                    propertyTypes +
                    salesStatusDom +
                    '        </div>' +
                    '      <div class="recommend_lists_price"><span class="recommend_lists_p">' + price + '</span>&nbsp;元/㎡</div>' +
                    '      <div class="recommend_lists_aere">' + item.areaName + '-' + item.streetName + '  &nbsp;&nbsp; ' + areaMess + '</div>' +
                    '      <div >' +
                    buildingTag +
                    '       </div>' +
                    '    </div>' +
                    '   </div>' +
                    ' </div>   '
            })
            $(".houseShare_recommend .listForList").html(str);
            $(".listFor").click(function () {
                let id = $(this).attr("currentid");
                let agreement = window.location.protocol
                let host = agreement + "//" + window.location.host;
                window.location.href = `${host}/dynamicPages/mstation/${id}.html`
            })
        } else {
            $(".houseShare_recommend").hide();
            clearPoint("houseShare_recommend");
        }
    }, function (err) {
        $(".houseShare_recommend").hide();
        clearPoint("houseShare_recommend");
    })

}
let buildingImgSize = { //后台上传的图片的尺寸
    Width: 373,
    Height: 330
};

function getBuildingUnit() {
    var params = {
        buildingId: id,
    }
    apiPost(api.buildingUnitList, params).then(function (data) {
        //$(".spread_main_img").attr("src",data.annexPath);
        if (data.pcBuildingUnitBaseInfoList && data.pcBuildingUnitBaseInfoList.length > 0) {
            let w1 = $(".spread_main_all").width(),
                h1 = $(".spread_main_all").height(),
                a = buildingImgSize.Width,
                b = buildingImgSize.Height;
            let stateW = w1 / a;
            let stateH = h1 / b;
            photosPoint1(data.pcBuildingUnitBaseInfoList, stateW, stateH)
            return;

        } else {
            $(".spread_main_divs").hide()
        }
    })
};
let photosPointDate = "";

function photosPoint1(data, stateX, stateY) {
    let str = '',
        that = this;
    data.forEach((item, index) => {
        let left = item.leftMargin - 0,
            top = item.topMargin - 0,
            l = left * stateX + 29 * (stateX - 1) / 2,
            t = top * stateY + 36 * (stateY - 1) + 17,
            c = index == 0 ? 'active' : '';

        if (left && top)(str += '<span class="allpoint ' + c + '" style="left:' + l + 'px;top:' + t + 'px">' + item.unitName.replace(/[^0-9]/ig, "") + '栋</span>')
    })
    photosPointDate = data;
    $(".allpoints").html(str);
    changeLoudong(data[0]);
    $(".allpoint").each(function (i, item) {
        $(item).click(function () {
            $(".allpoint").removeClass("active");
            $(this).addClass("active");
            changeLoudong(photosPointDate[i]);
        })
    });
};
//切换楼栋 
function changeLoudong(res) {
    $(".divsSpan").html(res.unitName + "栋");
    res.saleStatus && salesStatus(res.saleStatus) ? $(".spread_main_divs .houseStyleMess_spans").html(salesStatus(res.saleStatus)[0]) : $(".spread_main_divs .houseStyleMess_spans").hide();
    $(".unit .divsSpan").html(res.unit + "个单元");
    $(".ce .divsSpan").html(res.layers + "层");
    $(".hu .divsSpan").html(res.householdNum + '户')
};
//获取管家
function getKeeperList() {
    let params = {
        'buildingId': id,
        'type': 1
    }
    apiPost(api.getHousekeeperList, params).then(function (res) {
        console.log("管家管家res")
        console.log(res)
        if (res.list && res.list.length > 0) {
            let workNo = res.list[0].workNo;
            let str = '';
            res.list.slice(0, 3).forEach(item => {
                let url = item.avatarUrl || "../../img/mine.png",
                    span = '',
                    satisfaction = item.satisfaction ? (item.satisfaction - 0).toFixed(1) : 0;
                item.expertiseFieldList && item.expertiseFieldList.forEach((r, i) => {
                    if (i >= 3) return;
                    span += '<span class="housekeeper_spans">' + r.paraValue + '</span>'
                })
                str += '<div  class="clearfloat housekeeper_divs">' +
                    '    <div class="housekeeper_img" style="background-image:url(' + url + ')">' +
                    '    </div>' +
                    '   <div class="clearfloat housekeeperList">' +
                    '     <div style="overflow: hidden;">' +
                    '       <span class="housekeeper_name">' + item.userName + '</span>' +
                    '       <span class="housekeeper_satisfaction">满意度' + satisfaction + '</span>' +
                    '     </div>' +
                    '     <div>' +
                    span +
                    '     </div>' +
                    '     <div class="housekeeper_pos">' +
                    '      <a href="tel:" class="housekeeper_pos_a">' +
                    '          <em class="iconfont iconlive_phone housekeeper_pos_img" currentPhone="' + item.phone + '" currentWorkNo="' + item.workNo + '"></em>' +
                    '      </a>' +
                    '     </div>' +
                    '   </div>' +
                    '</div>'
            })
            $(".housekeeper_divsList").html(str);
            $(".houseShare_footer_online").click(function (event) {
                event.stopPropagation();
                event.preventDefault();
                let that = this;
                //if(!TOOL.getToken("M-token")){
                // window.location.href="/#/login?topath="+localName;
                // return;
                // console.log(`tel:02133194608,${workNo}#`)
                // window.location.href = `tel:02133194608,${workNo}#`;

                let phone = res.list[0].phone;
                phone && get404PhoneNotLogin(phone).then(function (res) {
                    if (!res) return;
                    $(that).parents(".footer_phone").attr("href", "tel:" + res);
                    window.location.href = "tel:" + res
                    // $(that).parents(".footer_phone").click();
                })
                str += '<div  class="clearfloat housekeeper_divs">' +
                    '    <div class="housekeeper_img" style="background-image:url(' + url + ')">' +
                    '    </div>' +
                    '   <div class="clearfloat housekeeperList">' +
                    '     <div style="overflow: hidden;">' +
                    '       <span class="housekeeper_name">' + item.userName + '</span>' +
                    '       <span class="housekeeper_satisfaction">满意度' + item.satisfaction + '</span>' +
                    '     </div>' +
                    '     <div>' +
                    span +
                    '     </div>' +
                    '     <div class="housekeeper_pos">' +
                    '      <a href="tel:" class="housekeeper_pos_a">' +
                    '          <em class="iconfont iconlive_phone housekeeper_pos_img" currentPhone="' + item.phone + '" currentWorkNo="' + item.workNo + '"></em>' +
                    '      </a>' +
                    '     </div>' +
                    '   </div>' +
                    '</div>'
            })
            $(".housekeeper_divsList").html(str);
            $(".houseShare_footer_online").click(function (event) {
                event.stopPropagation();
                event.preventDefault();
                let that = this;
                if (!TOOL.getToken("M-token")) {
                    // window.location.href="/#/login?topath="+localName;
                    // return;
                    // console.log(`tel:02133194608,${workNo}#`)
                    // window.location.href = `tel:02133194608,${workNo}#`;

                } else {
                    let phone = res.list[0].phone;
                    //let phone = "15102168492";
                    phone && get404Phone(phone).then(function (res) {
                        if (!res) return;
                        $(that).parents(".footer_phone").attr("href", "tel:" + res);
                        window.location.href = "tel:" + res
                        // $(that).parents(".footer_phone").click();
                    })
                }
            })
            $(".housekeeper_pos_a").click(function (event) {
                event.stopPropagation();
                event.preventDefault();
                if (!TOOL.getToken("M-token")) {
                    // window.location.href="/#/login?topath="+localName;
                    // console.log(`tel:02133194608,${workNo}#`)

                    // let currentWorkNo = $(this).find(".housekeeper_pos_img").attr("currentWorkNo");
                    // window.location.href = `tel:02133194608,${currentWorkNo}#`;

                    let phone = $(this).find(".housekeeper_pos_img").attr("currentphone"),
                        backPhone = '';
                    phone && get404PhoneNotLogin(phone).then(res => {
                        if (!res) return;
                        $(this).attr("href", "tel:" + res);
                        window.location.href = "tel:" + res
                        // $(this).parents(".housekeeper_pos_a").click();
                    })

                } else {
                    //let phone = res.list[0].phone;
                    let phone = "15102168492";
                    phone && get404Phone(phone).then(function (res) {
                        if (!res) return;
                        $(that).parents(".footer_phone").attr("href", "tel:" + res);
                        window.location.href = "tel:" + res
                        // $(that).parents(".footer_phone").click();
                    })
                }
            })
            $(".housekeeper_pos_a").click(function (event) {
                event.stopPropagation();
                event.preventDefault();
                if (!TOOL.getToken("M-token")) {
                    // window.location.href="/#/login?topath="+localName;
                    // console.log(`tel:02133194608,${workNo}#`)

                    // let currentWorkNo = $(this).find(".housekeeper_pos_img").attr("currentWorkNo");
                    // window.location.href = `tel:02133194608,${currentWorkNo}#`;

                    let phone = $(this).find(".housekeeper_pos_img").attr("currentphone"),
                        backPhone = '';
                    phone && get404PhoneNotLogin(phone).then(res => {
                        if (!res) return;
                        $(this).attr("href", "tel:" + res);
                        window.location.href = "tel:" + res
                        // $(this).parents(".housekeeper_pos_a").click();
                    })

                } else {
                    console.log("$(this)")
                    console.log($(this))
                    let phone = $(this).find(".housekeeper_pos_img").attr("currentphone"),
                        backPhone = '';
                    phone && get404Phone(phone).then(res => {
                        if (!res) return;
                        $(this).attr("href", "tel:" + res);
                        window.location.href = "tel:" + res
                        // $(this).parents(".housekeeper_pos_a").click();
                    })

                }

            })
        } else {
            $(".houseShare_housekeeper").hide();
            clearPoint("houseShare_housekeeper");
        }
    }, function (err) {
        $(".houseShare_housekeeper").hide();
        clearPoint("houseShare_housekeeper");
    })
}
//获取404号码
function get404Phone(phone) {
    return new Promise((resove, reject) => {
        apiPost(api.changePhone, {
            phone,
            source: 4
        }).then(function (res) {
            resove(res.mobile);
        })
    })
}

//获取404号码
function get404PhoneNotLogin(phone) {
    return new Promise((resove, reject) => {
        apiPost(api.changePhoneNotLogin, {
            phone,
            source: 4
        }).then(function (res) {
            resove(res.mobile);
        })
    })
}

let footerMess, allCity;
//获取全国城市
function getAllCity() {
    apiPost(api.allCity, {
        clientType: 3
    }).then(function (res) {
        if (res) {
            let str = "";
            Object.keys(res).forEach(r => {
                res[r].map(item => {
                    let url = '';
                    console.log(item.title,item.title.indexOf("大连")>-1)
                    if(item.title.indexOf("大连")>-1){
                        location.host.indexOf("test")>-1?url="https://daliantest.tospur.com/":url='https://mdalian.tongcehaofang.com/'
   
                    }else if(location.host.indexOf("dalian")>-1){
                        url = location.host.indexOf("test")>-1?"https://mtest.tospur.com/":'https://m.tongcehaofang.com/'
                     }
                    str += '<a href="'+url+'/#/houseList?cityCode=' + item.code + '&name=' + item.title + '" class="houseLink">' + item.title + '</a>'
                })
            })
            allCity = str;
            $(".houseLinks").html(str);
        }

    })
}
//获取底部显示信息
function getFooterMess() {
    let storageCity = getStorage("storageCity") ? JSON.parse(getStorage("storageCity")) : {
        title: "上海",
        code: '310100000'
    };
    $(".footerMain em").text(storageCity.title);
    apiPost(api.pageFooter, {
        cityCode: storageCity.code
    }).then(function (res) {
        res && (footerMess = res);
        $(".houseTag_span").click(function () {
            $(".houseTag_span").removeClass("footerActive");
            $(this).addClass("footerActive");
            let text = $(this).text();
            let str = '';
            if (text.indexOf("区域楼盘") > -1) {
                footerMess.areaResult.forEach(item => {
                    str += '<a href="/#/houseList?areaCode=' + item.code + '&name=' + item.title + '" class="houseLink">' + item.title + '</a>'
                })
            } else if (text.indexOf("楼盘推荐") > -1) {
                let agreement = window.location.protocol
                let host = agreement + "//" + window.location.host;
                footerMess.mainPushResult.forEach(item => {
                    str += '<a href="' + host + '/dynamicPages/mstation/' + item.code + '.html" class="houseLink">' + item.title + '</a>'
                })
            } else if (text.indexOf("新开楼盘") > -1) {
                let agreement = window.location.protocol
                let host = agreement + "//" + window.location.host;
                footerMess.recentUpdateResult.forEach(item => {
                    str += '<a href="' + host + '/dynamicPages/mstation/' + item.code + '.html" class="houseLink">' + item.title + '</a>'
                })
            } else {
                str = allCity;
            }
            $(".houseLinks").html(str)
        })
    })

}

function footList(data) {
    let str = '';
    data.forEach(item => {
        str += '<a href="/#/houseList?areaCode="+item.code class="houseLink">item.title</a>'
    })
}

function submitMess(params) {
    console.log("我是弹框params")
    console.log(params)
    apiPost(api.requestMess, params).then(function () {
        $(".modelSearch").hide();
        showToast("稍后管家会跟您联系 请耐心等待");
    }, function (err) {
        $(".content_error").show().text(err.msg || "请求错误")
    })
};

function getUrlParams(name) {
    var url = window.location.search;
    if (url.indexOf('?') == 1) {
        return false;
    }
    url = url.substr(1);
    url = url.split('&');
    var name = name || '';
    var nameres;
    for (var i = 0; i < url.length; i++) {
        var info = url[i].split('=');
        var obj = {};
        obj[info[0]] = decodeURI(info[1]);
        url[i] = obj;
    }
    if (name) {
        for (var i = 0; i < url.length; i++) {
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
};


function urlPush(type) {
    let url = "";
    switch (type) {
        case "map":
            pushMap()
            break;
        case "dynamic":
            url = "/#/propertyDynamic/" + id;
            window.location.href = url;
            break;
        case "houseStyle":
            url = "/#/houseTypeList/" + id;
            window.location.href = url;
            break;
        case "housekeeper":
            url = "/#/majordomoList/" + id;
            window.location.href = url;
            break;

    }
}
//跳转地图
function pushMap() {
    let s = $(".footerImg").attr("lng") && $(".footerImg").attr("lat") ? $(".footerImg").attr("lng") + '-' + $(".footerImg").attr("lat") : '';
    let buildingUrl = $(".houseShare_baseMess_footer span").text();
    buildingUrl = buildingUrl.split(" ").filter(item => item.length > 0);
    buildingUrl = buildingUrl[buildingUrl.length - 1];
    let url = s ? `/#/peripheral/${s}?buildingName=${$("h1.houseShare_baseMess_span1").text()}&buildingUrl=${buildingUrl}` : '';
    if (!s) return;
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i); //获取本地存储的Key
        console.log(key)
        if (key.indexOf("BMap") > -1) {
            console.log(key)
            window.localStorage.removeItem(key)
        }
    }
    window.open(url);
}
// 物业类型
function propertyType(types) {
    switch (types) {
        case '1':
            return '住宅';
            break;
        case '2':
            return '别墅';
            break;
        case '3':
            return '商铺';
            break;
        case '4':
            return '写字楼';
            break;
        case '5':
            return '酒店式公寓';
            break;
        case '6':
            return '车位';
            break;
        case '7':
            return '动迁房';
            break;
        case '8':
            return '其他';
            break;
        case '9':
            return '洋房';
            break;
        case '10':
            return '公寓';
            break;
        default:
            break;
    }
}
// 销售状态
function salesStatus(types) {
    switch (types) {
        case '1':
            return ['待售', 'forsale'];
            break;
        case '2':
            return ['在售', 'onsale'];
            break;
        case '3':
            return ['售罄', 'saleout'];
            break;
        case '4':
            return ['在租', 'inRent'];
            break;
        default:
            break;
    }
}

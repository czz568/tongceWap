let api = {
    colorConfig:'/building/capp/brand/hall/colorConfig',//颜色设置
    ProjectlistBrand:'/building/capp/brand/hall/listBrandHallBuildingExhibition',//项目展示
    introductionlistBrand: "/building/capp/brand/hall/listBrandHallIntroduce",//品牌介绍
    getPlayInfo:"/tospurWeb/api2/v1/vod/getPlayInfo"//请求视频地址
}
let cityCode = urlParse().cityCode,brandId=urlParse().brandId, height=document.documentElement.clientHeight,footHeight=$('.brand_footer').outerHeight(true);
let selectedWord = '',selectedColor = '',unselectedColor='',unselectedWord=''
let shareData={title : '', desc:'', logoPath:''}
let myPlayer = videojs('brandVideo')
$(function () {
    $('.brand_introduction').css('height',height-footHeight);
    $('.img_path').css('height','100%');
    ProjectData();
    introductionData();
    scrollDom();
})
//微信二次分享
function houseShareConfig() {
    var that = this
    var params = {
        url: encodeURIComponent(location.href)
    }
    apiPost('/tospurWeb/wx/serviceNumber/config', params, '', true).then((res) => {
        wx.config({
            // debug: true, // 开启调试模式
            appId: res.appId, // 必填，公众号的唯一标识
            timestamp: res.timeStamp, // 必填，生成签名的时间戳
            nonceStr: res.nonceStr, // 必填，生成签名的随机串
            signature: res.signature, // 必填，签名
            jsApiList: ["updateAppMessageShareData", "updateTimelineShareData"]
        })
        wx.ready(function () {
            wx.updateAppMessageShareData({
                title: shareData.title, // 分享标题
                desc: shareData.desc, // 分享描述
                link: window.location.href, // 分享链接
                imgUrl: shareData.logoPath + '?x-oss-process=image/resize,m_lfit,w_100,h_100', // 分享图标
                success: function () {
                },
                cancel: function () {
                }
            });
            wx.updateTimelineShareData({
                title: shareData.title, // 分享标题
                desc: shareData.desc, // 分享描述
                link: window.location.href, // 分享链接
                imgUrl: shareData.logoPath + '?x-oss-process=image/resize,m_lfit,w_100,h_100', // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                },
                cancel: function () {
                }
            })
        });
    });
};

//滚动监听
function scrollDom(){
    $(window).scroll(function () {
        let top = $(document).scrollTop()
        let topTitleHeight = $('.top_title').height()
        if(top>=topTitleHeight){
            $('.top_title').css('display','block')
        }else{
            $('.top_title').css('display','none')
        }
    })
}

//获取设置的颜色
function colorConfigData(){
    let params = {
        cityCode:cityCode,
        brandId:brandId
    }
    apiPost(api.colorConfig,params).then(function (res){
        if(res){
            selectedColor = res.selectedColor?'#'+res.selectedColor : '#FFE4B9'
            selectedWord = res.selectedWord ? '#'+res.selectedWord : '#614923'
            unselectedColor = res.unselectedColor?'#'+res.unselectedColor : '#888888'
            unselectedWord = res.unselectedWord ? '#'+res.unselectedWord : '#FDEBC7'
            $('.top_title').css({'background':selectedColor,'color':selectedWord})
            $('.top_title .goBack_btn').css({'color':selectedWord})
            $('.brand_footer').css({'background':selectedColor,'color':selectedWord})
            $('.presentation_btn').css({'border-right':'1px solid '+selectedWord})
            $('.active_foot span').css({'border-bottom':'2px solid '+selectedWord})
            
            $('.scroll_tab .introduction_tab').css({'background':hexToRgba(unselectedColor),'color':unselectedWord})
            $('.scroll_tab .introduction_tab_active').css({'background':selectedColor,'color':selectedWord})
        }
    })
}
//底部按钮切换
$('.foot_btn').click(function(){
    $(".foot_btn").eq($(this).index()).addClass("active_foot").siblings().removeClass('active_foot');
    $(".brand_footer .foot_btn span").css({'border-bottom':0})
    myPlayer.load();
    $(".brand_footer .active_foot span").css({'border-bottom':'2px solid '+selectedWord})
    $(".page_warp").hide().eq($(this).index()).show();
})

//项目展示逻辑
function ProjectData(){
    let params={
        cityCode:cityCode,
        brandId:brandId
    }
    apiPost(api.ProjectlistBrand,params).then(function (res){
        if(res){
            //分享字段
            shareData.title = res.exhibitionVO.title?res.exhibitionVO.title:'品牌管'
            shareData.desc = res.exhibitionVO.description?res.exhibitionVO.description:'品牌管'
            shareData.logoPath = res.exhibitionVO.logoPath?res.exhibitionVO.logoPath:'https://m.tongcehaofang.com/#/Home'
            //背景设置
            $('.top_title .title').text(res.exhibitionVO.title);
            let imgPathBg = '',Rgb = ''
            if(res.exhibitionVO.backgroundType==2){
                Rgb = res.exhibitionVO.brandRgb
                imgPathBg = res.exhibitionVO.brandAnnexPath
            }else if(res.exhibitionVO.backgroundType==1){
                Rgb = res.exhibitionVO.rgb
                imgPathBg = res.exhibitionVO.annexPath
                $('.title_type_1').show()
                $('.title_type_1').text(res.exhibitionVO.title)
            }else{
                Rgb = res.exhibitionVO.cityRgb
                imgPathBg = res.exhibitionVO.cityAnnexPath
            }
            $('.img_path').css({'background':'url('+ imgPathBg +') no-repeat','background-size':'cover'})
            setTitle(res.exhibitionVO.title)
            //楼盘列表
            let str = ''
            res.brandHallBuildingVOS.forEach(item=>{
                let albumCoverPictureurl = item.albumCoverPicture ? item.albumCoverPicture : "/img/pic_default_big@2x.png";
                let annexPathurl = item.annexPath ? item.annexPath : "/img/pic_default_big@2x.png";
                let haveVR = item.haveVR != 0 ? '<span class="img_btn"></span>' : '';
                let haveVideo = item.haveVideo != 0 ? '<span class="play_btn"></span>' : '';

                let buildingTag = '';
                item.buildingTag && item.buildingTag.split(",").forEach((item, index) => {
                    if (index >= 4) return;
                    buildingTag += '<p class="tag">'+ item + '</p>'
                    '<span class="recommend_lists_goodList">' + item + '</span>'
                })
                str += '<div class="building_list" currentId = ' + item.buildingId + '>'+
                    '       <div class="building_list_top_img">'+
                    '           <p class="img_play">'+
                                    haveVR +
                                    haveVideo +
                    '           </p>'+
                    '           <img src="'+ albumCoverPictureurl +'" alt="">'+
                    '       </div>'+
                    '       <div class="building_list_content">'+
                    '           <div class="left_img">'+
                    '           <img src="'+ annexPathurl +'" alt="">'+
                    '           </div>'+
                    '           <div class="right_txt">'+
                    '               <div class="top_txt">'+
                    '                   <p>'+item.buildingAlias+'</p><p class="cl_FF">'+ AveragePrice(item.referenceAveragePriceType,item.referenceAveragePrice,item.referenceAveragePriceMax) +'</p>'+
                    '               </div>'+
                    '               <div class="adress_area">'+
                    '                   <p class="adress">'+item.areaName+'-'+item.streetName+'</p><p class="area">'+ formatArea(item.referenceBuildAreaMin,item.referenceBuildAreaMax) +'</p>'+
                    '               </div>'+
                    '               <div class="building_tag">'+
                                        buildingTag +
                    '               </div>'+
                    '           </div>'+
                    '       </div>'+
                    '       <div class="bright_spot"><i class="iconfont iconicon_experience"></i>'+item.buildingBrightSpot+'</div>'+
                    '   </div>'
            })
            $('.building_list_warp').html(str)
            let buildingListWarpHeight =height- ($('.building_list').outerHeight(true) + $('.brand_footer').outerHeight(true))
            $('.building_list_warp').css({'top': buildingListWarpHeight})
            $('.building_list').css({'background':'#'+Rgb})
            //点击楼盘信息 跳转楼盘详情
            $('.building_list').click(function () {
                let id = $(this).attr("currentId");
                let agreement = window.location.protocol
                let host = agreement + "//" + window.location.host;
                window.location.href = `${host}/dynamicPages/mstation/${id}.html`
            })
            houseShareConfig()
        }
    })
}



// 品牌介绍逻辑
let bgImg = '', videoId = '', introductionlistBrand = null
function introductionData() {
    var params = {
        cityCode:cityCode,
        brandId:brandId
    }
    apiPost(api.introductionlistBrand,params).then(function (res) {
        if(res && res.result){
            introductionlistBrand = res.result
            if(res.result[0].type==1){
                $('.brand_introduction').css('background','url()')
                getPlayInfo(res.result[0].videoPath)
                $('.video').css({'display':'block','top':0,'transform':'translate(0,0)'})
                $('.video-js').css('height',height-footHeight)
                $('.brand_introduction').attr("currentType",res.result[0].type);
            }else if(res.result[0].type==3){
                bgImg = res.result[0].imagePath
                getPlayInfo(res.result[0].videoPath)
                $('.video').css({'display':'block','top':'50%','transform':'translate(0,-50%)'})
                $('.brand_introduction').attr("currentType",res.result[0].type);
            }else{
                bgImg = res.result[0].imagePath
                videoId = res.result[0].videoPath
                $('.video').css('display','none')
                $('.brand_introduction').attr("currentType",res.result[0].type);
            }
            let str = ''
            res.result.forEach(item => {
                str += '<div class="introduction_tab" currentId='+ item.id+'>'+
                    '       <p class="introduction_title">'+ item.title +'</p>'+
                    '       <p class="introduction_content">'+ changeBr(item.content) +'</p>'+
                    '   </div>'
            })
            $('.scroll_tab').html(str)
            $('.scroll_tab').find(".introduction_tab").first().addClass("introduction_tab_active");
            $('.brand_introduction').css({'background':'url('+ bgImg +') no-repeat','backgroundSize':'cover'})
            colorConfigData()
        }
    })
}
//获取视频地址
function getPlayInfo(videoId){
    myPlayer.load();
    let params = {
        vedioId : videoId
    }
    apiPost(api.getPlayInfo,params).then(function (res){
        $(".video-js video").attr("poster", res.videoBase.coverURL)
        $(".video-js video").attr("src", res.playInfoList[1].playURL);
        // myPlayer.poster(res.videoBase.coverURL);
    })
}
//品牌介绍 点击背景图跳转 
$('.brand_introduction').click(function(){
    if($(this).attr('currentType')==2){
        if($(this).attr('jumpUrl')){
            window.location.href = $(this).attr('jumpUrl')
        }else{
            return false
        }
    }
})
//品牌介绍切换
$('.scroll_tab').on('click','.introduction_tab',function(e){
    e.stopPropagation()
    let currentId = $(this).attr('currentId')
    $(".introduction_tab").eq($(this).index()).addClass("introduction_tab_active").siblings().removeClass('introduction_tab_active');

    myPlayer.load();

    $('.scroll_tab .introduction_tab').css({'background':hexToRgba(unselectedColor),'color':unselectedWord})
    $('.scroll_tab .introduction_tab_active').css({'background':selectedColor,'color':selectedWord})
    introductionlistBrand.forEach((item)=>{
        if(item.id==currentId){
            if(item.type == 1){
                $('.brand_introduction').css('background','url()')
                getPlayInfo(item.videoPath)
                $('.video').css({'display':'block','top':0,'transform':'translate(0,0)'})
                $('.video-js').css('height',height-footHeight)
                $('.brand_introduction').attr("currentType",item.type);
            }else if(item.type == 3){
                $('.brand_introduction').css({'background':'url('+ item.imagePath +')','backgroundSize':'cover'})
                getPlayInfo(item.videoPath)
                $('.video').css({'display':'block','top':'50%','transform':'translate(0,-50%)'})
                $('.video-js').css('height','150px')
                $('.brand_introduction').attr("currentType",item.type);
            }else{
                $('.brand_introduction').css({'background':'url('+ item.imagePath +')','backgroundSize':'cover'})
                $('.video').css('display','none')
                $('.brand_introduction').attr("currentType",item.type);
                $('.brand_introduction').attr("jumpUrl",item.jumpUrl);
            }
        }
    })
})

//点击返回按钮跳转M站首页  区分环境
$('.goBack_btn .iconfont').click(function(e){
    e.stopPropagation()
    if (window.location.host.indexOf('tongcehaofang') !== -1) { // 正式
        window.open('https://m.tongcehaofang.com/#/Home');
    } else if (window.location.host.indexOf('mstag') !== -1) { // uat
        window.open('https://mstag.tospur.com/#/Home');
    } else {
        window.open('https://mtest.tospur.com/#/Home');
    }
})
function changeBr(str){
    return str.replace(/\\n/gm,"<br>")
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
//hex -->  rgba
function hexToRgba(hex, opacity=0.7) {
    return 'rgba(' + parseInt('0x' + hex.slice(1, 3)) + ',' + parseInt('0x' + hex.slice(3, 5)) + ','
            + parseInt('0x' + hex.slice(5, 7)) + ',' + opacity + ')';
}
function setTitle(title) {
    title = title ? `${title}` : '品牌管'
    window.document.title = title
}
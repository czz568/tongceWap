<template>
  <div class="app">
    <Scroll class="appScroll">
       <div class="houseShare">
        <div class="houseShare_lunbo">
           <div class="lunbo_img">
                <img class="lunbo_img_current" :src="houseMess.albumCoverPicture" alt="">
              <div class="lunbo_img_playDiv">
                  <div class="lunbo_img_play">
                    <img class="lunbo_img_play_icon" src="../../assets/img/squareness@2x.png" alt="">
                  </div>
                  <div class="lunbo_img_change">
                     <span class="lunbo_img_span">视频</span>
                     <span class="lunbo_img_span spanColor">图片</span>
                  </div>
              </div>
           </div>
           <div class="lunbo_price">
             <img class="lunbo_price_img" src="../../assets/img/basePrice@2x.png" alt="">
             <div class="lunbo_price_div">
               <span class="lunbo_price_mess">参考均价</span>
               <div class="ml3">
                 <span class="lunbo_price_num">{{houseMess.referenceAveragePrice}}</span>
                 <span><img class="lunbo_price_img2" src="../../assets/img/spuer@2x.png" alt=""></span>
               </div>
             </div>
           </div>
        </div>
        <div class="houseShare_baseMess">
          <div>
            <div class="houseShare_baseMess_spanDiv clearfloat">
              <span class="houseShare_baseMess_span1">{{houseMess.buildingAlias}}</span>
              <span class="houseShare_baseMess_span2 fl">{{$formatter.switchName('propertyType',houseMess.propertyType)}}</span>
              <span class="houseShare_baseMess_span2 fl houseShare_baseMess_span3">{{$formatter.switchName('salesStatus',houseMess.salesStatus)}}</span>
            </div>
            <div class="houseShare_baseMess_spanDiv1">
               <span class="spanList" v-for="(item,index) in houseMess.buildingTag" :key="index" >{{item}}</span>
            </div>
            <div class="houseShare_baseMess_spanMess">
               <span >
                 <img class="spanMessStar" src="../../assets/img/diamond@2x.png" alt="">
               </span>
               <span class="spanMessIntroduce">{{houseMess.buildingBrightSpot}}</span>
            </div>
            <div class="line"></div>
          </div>
          <div class="houseShare_baseMess_live">
            <img class="liveMess" src="../../assets/img/live@2x.png" alt="">
          </div>
          <div class="houseShare_baseMess_house">
             <span class="houseSpan">{{`参考总价:  约${houseMess.referenceTotalPrice}万`}}</span>
             <span class="houseSpan1">{{`在售户型:  ${houseMess.houseType}室`}}</span>
             <span class="houseSpan">{{`建筑面积: 约${houseMess.referenceBuildArea}㎡`}}</span>
             <span class="houseSpan1">{{`开盘时间: ${houseMess.openTime}`}}</span>
          </div>
          <div class="houseShare_baseMess_buttons">查看详情</div>
          <div class="houseShare_baseMess_footer">
             <span>地址： {{houseMess.address}}</span>
             <img class="footerImg" src="../../assets/img/detail_map@2x.png" alt="">
           </div>
        </div>
        <div class="houseShare_alertmess">
          <img class="alertmessImg" src="../../assets/img/alertMess@2x.png" alt="">
        </div>
        <div class="houseShare_houseStyle" v-if="houseStyle.styles.length > 0">
           <div class="lin7">
               <span class="TLeft"></span>
               <div class="houseStyleTMess">户型介绍(<span>{{houseStyle.count}}</span>)</div>
               <span class="houseStyleTR">全部户型 <i class="cubeic-arrow"></i></span>
           </div>
           <div v-if="houseStyle.styles.length > 0" style="overflow: hidden;white-space: nowrap;">
             <span v-for="(item,i) in houseStyle.styles" :key="i" :class="['houseStyles',i==0?'baseColor':'']">{{`${item.name}室(${item.num})`}}</span>
           </div>
           <div class="houseStyleMess" v-if="houseStyle.houseMess.length > 0">
              <div  v-for="(item,i) in houseStyle.houseMess" :key="i" class="houseStyleMess_all">
                <img class="houseStyleMess_img" :src="item.annexPath || '../../assets/img/timgHouse@2x.png'" alt="">
                <div>
                  <span class="houseStyleMess_style">{{item.houseType}}</span>
                  <span class="houseStyleMess_spans">{{$formatter.switchName('salesStatus',item.salesStatus)}}</span>
                </div>
                <div class="houseStyleMess_area">
                  <span>建筑面积{{item.constructionArea}}㎡</span>
                  <span>{{$formatter.switchName("oriented",item.oriented)}}</span>
                </div>
                <div class="houseStyleMess_price" v-if="item.totalPrice">约{{item.totalPrice}}万</div>
              </div>
           </div>
           <div class="houseShare_baseMess_buttons houseStyleButton">一房一价</div>
        </div>
        <div class="houseShare_dynamic" v-if="houseDynamic.active.length>0">
           <div class="lin7">
               <span class="TLeft"></span>
               <div class="dynamic_title">楼盘动态</div>
           </div>
           <div class="houseShare_dynamic_active">
              <div v-for="(item,i) in houseDynamic.active" :key="i" class="dynamic_actives">
                  <div class="dynamic_actives_divs">
                     <span v-if="houseDynamic.active[i-0+1] && !item.timeOver" :class="['dynamic_actives_line',houseDynamic.active[i-0+1]&&houseDynamic.active[i-0+1].timeOver?'colorH':'']"></span>
                     <img class="dynamic_actives_img" v-if="item.id ==1 && !item.timeOver" src="../../assets/img/Pre-sale_Details@2x.png" alt="">
                     <img class="dynamic_actives_img" v-if="item.id ==1 && item.timeOver" src="../../assets/img/Pre-sale_Detailsd@2x.png" alt="">
                     <img class="dynamic_actives_img" v-if="item.id ==2 && !item.timeOver" src="../../assets/img/Raise_money_Details_pre@2x.png" alt="">
                     <img class="dynamic_actives_img" v-if="item.id ==2 && item.timeOver" src="../../assets/img/Raise_money_Details@2x.png" alt="">
                     <img class="dynamic_actives_img" v-if="item.id ==3 && !item.timeOver" src="../../assets/img/opening_Details_pre@2x.png" alt="">
                     <img class="dynamic_actives_img" v-if="item.id ==3 &&  item.timeOver" src="../../assets/img/opening_Details@2x.png" alt="">
                  </div>
                  <div class="dynamic_actives_title">{{item.title}}</div>
                  <div class="dynamic_actives_name">{{item.time}}</div>
              </div>

           </div>
           <div class="houseShare_dynamic_timeing">
               <div  v-for="(item,i) in houseDynamic.timeing" :key="i" class="clearfloat">
                   <div class="leftTimes">
                     <span class="leftTimes_title"></span>
                     <span class="leftTimes_line"></span>
                   </div>
                   <div>
                      <div class="right_time">{{item.createTime}}</div>
                      <div class="right_title">{{item.title}}</div>
                      <div class="right_message">{{item.content}}</div>
                   </div>
               </div>
           </div>
           <div class="p3">
              <div class="houseShare_baseMess_buttons houseStyleButton">更多动态</div>
           </div>
        </div>
        <div class="houseShare_spread" v-if="houseSpread.annexPath">
          <div class="lin7">
               <span class="TLeft"></span>
               <div class="dynamic_title">楼栋分布</div>
           </div>
           <div class="spread_main">
              <img class="spread_main_img" v-if="houseSpread.annexPath" :src="houseSpread.annexPath" alt="">
              <div class="spread_main_divs" v-if="houseSpread.unitName">
                  <div>
                     <div>楼栋号</div>
                     <span class="divsSpan">{{houseSpread.unitName}}栋</span>
                  </div>
                  <div class="tac">
                    <div >单元数</div>
                     <span class="divsSpan">{{houseSpread.unit}}个单元</span>
                  </div>
                  <div class="tar r14">
                      <div>户数</div>
                     <span class="divsSpan">{{houseSpread.householdNum}}户</span>
                   </div>
              </div>
            </div>
           <div class="houseShare_baseMess_buttons houseStyleButton">一房一价</div>
        </div>
        <div class="houseShare_periphery">
          <div class="lin7">
               <span class="TLeft"></span>
               <div class="dynamic_title">周边配套</div>
           </div>
           <div class="spread_main">
               <baidu-map class="bmView spread_main_img"  :scroll-wheel-zoom="true" :center="location" :zoom="zoom" @ready="handler" ak="5FelKuTajGG599tCPYQXYuD5kpqf2Vwz">
                <bm-overlay
                   pane="labelPane"
                   class="sample"
                   @draw="draw">
                   <div class="mapImg">
                     <div class="mapSqure">{{houseMess.buildingAlias}}</div>
                     <img class="draw_img" src="../../assets/img/Surrounding@2x.png" alt="">
                    </div>
                 </bm-overlay>
                </baidu-map>
              <div class="spread_main_styles">
                  <div v-for="(item,i) in housePeriphery.styleList" :key="i"  :class="['styles_divs',i==0?'baseColor':'']">
                     <span>{{item.name}}({{item.num}})</span>
                  </div>
              </div>
              <div>
                  <div v-for="(item,i) in  housePeriphery.listMess" :key="i" class="busList">
                    <span class="busList_left">{{item.title}}</span>
                    <span class="busList_center">({{item.address}})</span>
                    <span class="busList_right">
                      <img class="busList_right_img" src="../../assets/img/distance@2x.png" alt="">
                      {{item.distance}}m
                    </span>
                  </div>
              </div>
           </div>
        </div>
        <div class="houseShare_questions">
          <div class="lin7">
               <span class="TLeft"></span>
               <div class="houseStyleTMess">好房问答</div>
               <span class="houseStyleTR">全部户型 <i class="cubeic-arrow"></i></span>
           </div>
           <div v-for="(item,i) in questions" :key="i" class="questions">
              <div>
                <span class="questions_ask">问</span>
                <span class="questions_askMess">{{item.quesDesc}}</span>
              </div>
              <div class="questions_divs">
                <span  class="questions_answer">答</span>
                <span class="questions_answerMess">{{item.answerDesc}}</span>
              </div>
           </div>
           <div class="houseShare_baseMess_buttons houseStyleButton">我要提问</div>
        </div>
        <div class="houseShare_housekeeper">
           <div class="lin7 ml5">
               <span class="TLeft"></span>
               <div class="dynamic_title disLB">优秀管家</div>
               <span v-for="(item,i) in housekeeper.service" :key="i" class="housekeeper_title">
                  <img src="../../assets/img/live_tick@2x.png" alt="" class="housekeeper_title_img">
                  <span class="housekeeper_title_mess">{{item}}</span>
               </span>
           </div>
           <div v-for="(item,i) in housekeeper.menList" :key="i" class="clearfloat housekeeper_divs">
             <div class="housekeeper_img">
                <img  v-if="item.avatarUrl" :src="item.avatarUrl" alt="">
                <img  v-if="!item.avatarUrl"  src="../../assets/img/pic_default_small@2x.png" alt="">
             </div>
             <div class="clearfloat">
               <div>
                 <span class="housekeeper_name">{{item.userName}}</span>
                 <span class="housekeeper_satisfaction">满意度{{item.satisfaction}}</span>
               </div>
               <div>
                 <span v-for="(messd,y) in item.expertiseFieldList" :key="y" class="housekeeper_spans">{{messd.paraValue}}</span>
               </div>
               <div class="housekeeper_pos">
                 <img class="housekeeper_pos_img" src="../../assets/img/live_advisory@2x.png" alt="">
                 <img class="housekeeper_pos_img" src="../../assets/img/live_phone@2x.png" alt="">
               </div>
             </div>
             <div v-if="i != housekeeper.menList.length-1" class="housekeeper_line"></div>
           </div>
        </div>
        <div class="houseShare_introduce" v-if="introduce.length>0">
           <div class="lin7 ml5 mb5">
               <span class="TLeft"></span>
               <div class="dynamic_title">楼盘介绍</div>
           </div>
           <div v-for="(item,i) in introduce" :key="i">
              <img  :src="item" alt="" class="introduce_imgs">
           </div>
        </div>
        <div class="houseShare_recommend">
           <div class="lin7 mb5">
               <span class="TLeft"></span>
               <div class="dynamic_title">推荐楼盘</div>
           </div>
           <div v-for="(item,i) in recommend" :key="i">
               <div class="recommend_lists clearfloat">
                 <div class="recommend_lists_one disLB">
                    <img class="recommend_lists_img"  v-if="item.albumCoverPicture"  :src="item.albumCoverPicture" alt="">
                    <img class="recommend_lists_img"  v-if="!item.albumCoverPicture" src='../../assets/img/pic_default_big@2x.png' alt="">
                 </div>
                 <div class="disLB">
                   <div class="recommend_lists_address clearfloat" >
                     <span class="fl mt4" >{{item.buildingAlias}}</span>
                     <span class="houseShare_baseMess_span2 fs10 fl">{{$formatter.switchName('propertyType',houseMess.propertyType)}}</span>
                     <span class="houseShare_baseMess_span2 fs10 fl houseShare_baseMess_span3">{{$formatter.switchName('salesStatus',houseMess.salesStatus)}}</span>
                     </div>
                   <div class="recommend_lists_price"><span class="recommend_lists_p">{{item.referenceAveragePrice}}</span>元/㎡</div>
                   <div class="recommend_lists_aere">{{item.referenceBuildArea? `建面${item.referenceBuildArea}㎡`: '暂无建面'}} &nbsp;&nbsp; {{item.referenceTotalPrice? `总价${item.referenceTotalPrice}万`: '暂无价格'}}</div>
                   <div ><span v-for="(it,y) in item.buildingTag" :key="y" class="recommend_lists_goodList">{{it}}</span></div>
                 </div>
               </div>
               <div class="recommend_mess">
                    <img class="recommend_mess_img" src="../../assets/img/icon_advantage@2x.png" alt="">
                    <span>{{item.buildingBrightSpot}}</span>
               </div>
               <div v-if="i != recommend.length-1" class="recommend_line"></div>
           </div>
        </div>
        <div class="houseShare_declare">
            <div class="houseShare_declare_imgs">
                <img class="houseShare_declare_currentImg" src="../../assets/img/Exemption_Details@2x.png" alt="">
            </div>
            <div class="houseShare_declare_msgs">
               <div class="msgs_title">
                 免责声明
               </div>
               <span class="msgs_main">
                 楼盘信息来源于政府公示网站、开发商、第三方公众平台，最终以政府部 门登记备案为准，请谨慎核查。
               </span>
            </div>
        </div>
     </div>
    </Scroll>
     <div class="houseShare_footer">
            <div class="houseShare_footer_online footerButton">在线咨询</div>
            <div class="houseShare_footer_telphone footerButton">电话咨询</div>
    </div>
  </div>
</template>
<script>
import Scroll from '../../components/scroll/scroll';
import star from './star';
import { BaiduMap, BmView, BmOverlay } from 'vue-baidu-map'
import { urlParse } from '../../common/js/util.js';
import { formatDate1 } from '../../common/js/date.js';
// import {
//   buildingBaseInfo,
//   getWXSignature,
//   buildingHouseType,
//   buildingDynamicAndDate,
//   buildingUnitList,
//   housekeeperList,
//   buildingQaSearch,
//   buildingRecommend
// } from 'common/api/appc/share.js'

export default {
  components: {
    Scroll,
    star,
    BaiduMap,
    BmView,
    BmOverlay
  },
  data() {
    return {
      title: '同策好房APP下载',
      icon: 'iconfont iconicon_home_cardshare_normal',
      baseHouseImg: './img/timgHouse@2x.png',
      location: {
        lat: 0,
        lng: 0
      },
      zoom: 3,
      currentPonitLat: '',
      currentPonitlng: '',
      houseMess: {
        albumCoverPicture: '',
        openTime: '',
        address: '',
        buildingAlias: '', // 楼盘名称
        referenceAveragePrice: '',
        salesStatus: '',
        propertyType: '', // 物业类型
        buildingTag: '', // 楼盘标签
        buildingBrightSpot: '', // 楼盘亮点
        referenceTotalPrice: '', // 参考总价
        referenceBuildArea: '', // 建筑面积
        houseType: ''
      },
      houseStyle: { // 户型
        count: '',
        styles: [],
        houseMess: []
      },
      houseDynamic: {
        active: [],
        timeing: []
      },
      houseSpread: {},
      housePeriphery: {
        styleList: [],
        listMess: []
      },
      questions: [],
      housekeeper: {
        service: ['专业服务', '免费咨询', '全程带看'],
        menList: []
      },
      introduce: [],
      recommend: [],
      defaultImg: './pic_default_big@2x.png',
      buildingId: 1
    }
  },
  mounted() {

  },
  created() {
    // this.buildingId = urlParse().buildingId ? urlParse().buildingId : 9803;
    // this.getBaseInfo()
  },
  methods: {
    handler ({BMap, map}) {
      console.log(BMap, map)
       new BMap.Geolocation().getCurrentPosition(r => {
            this.currentLatitude = r.latitude;
            this.currentLongitude = r.longitude;
        });
      setTimeout(_ => {
         let that = this;
         console.log(this.currentPonitLat, this.currentPonitlng)
         this.$set(this.location, 'lat', this.currentPonitLat || '31.380156')
         this.$set(this.location, 'lng', this.currentPonitlng || '121.272591')
         this.zoom = 15;
         map.disableDragging();
         var local;
         var options = {
           onSearchComplete(results) {
             // 判断状态是否正确
               that.mySearchCompleteCallback(results, BMap, map)
            }
          }
        this.$nextTick(_ => {
           local = new BMap.LocalSearch(map, options);
           local.searchNearby(['公交', '地铁', '学校', '医院', '商场'], new BMap.Point(this.location.lng, this.location.lat), 6000);
           document.querySelector('.anchorBL').style.display = 'none'
        })
      }, 2000)
    },
    mySearchCompleteCallback(LocalResult, BMap, map) {
      if (LocalResult.length < 1) return;
      for (var i = 0; i < LocalResult.length; i++) {
        if (LocalResult[i].Ir.length > 0) {
          var s = LocalResult[i].Ir;
          var keyword = LocalResult[i].keyword;
          this.addhousePeriphery(keyword, s, BMap, map)
          }
      }
     this.$set(this.housePeriphery, 'listMess', (this.housePeriphery.styleList[0] && this.housePeriphery.styleList[0].currentMess) || [])
    },
     addhousePeriphery(keyword, messList, BMap, map) {
       messList.forEach(item => {
          let d = map.getDistance(new BMap.Point(this.location.lng, this.location.lat), new BMap.Point(item.point.lng, item.point.lat))
          d = parseInt(d);
          if (d > 1000)d = (d / 1000).toFixed(1) + 'k'
          item.distance = d;
       })
       this.housePeriphery.styleList.push({
             name: keyword,
             num: messList.length,
             currentMess: messList.slice(0, 3)
       })
      },
     draw ({el, BMap, map}) {
      const {lng, lat} = this.location
      const pixel = map.pointToOverlayPixel(new BMap.Point(lng, lat))
      el.style.left = pixel.x - 60 + 'px'
      el.style.top = pixel.y - 20 + 'px'
    },
    goVideo(item) {
      this.playVideo = true
      this.videoSrc = item.annexPath
    },
    getBaseInfo() {
      let params = {
        buildingId: this.buildingId
      }
      buildingBaseInfo(params).then((res) => {
        res && this.checkBuildingBaseInfo(res)
      })
       this.getbuildingHouseType();
       this.getBuildingDynamicAndDate(params);
       this.getBuildingUnitList(params);
       this.getHousekeeperList();
       this.getBuildingQaSearch();
       this.getBuildingRecommend(params);
    },
    getBuildingRecommend(params) {
      buildingRecommend(params).then(resd => {
        let array = [];
        resd.result.map(res => {
            let obj = {}
            obj.referenceAveragePrice = res.referenceAveragePrice;
            obj.albumCoverPicture = res.referenceAveragePrice
            obj.albumCoverPicture = res.albumCoverPicture
            obj.buildingAlias = res.buildingAlias;
            obj.salesStatus = (res.salesStatus && res.salesStatus.split(',')[0]) || '';
            obj.propertyType = (res.propertyType && res.propertyType.split(',')[0]) || '';
            obj.buildingTag = (res.buildingTag && res.buildingTag.split(',').slice(0, 3)) || [];
            obj.buildingBrightSpot = res.buildingBrightSpot;
            obj.referenceTotalPrice = res.referenceTotalPriceMin ? ` ${res.referenceTotalPriceMin}${res.referenceTotalPriceMax != null ? -res.referenceTotalPriceMax : ''} ` : '';
            obj.referenceBuildArea = res.referenceBuildAreaMin ? ` ${res.referenceBuildAreaMin}${res.referenceBuildAreaMax != null ? -res.referenceBuildAreaMax : ''} ` : '';
            array.push(obj)
        })
       this.recommend = array;
      })
    },
    getBuildingQaSearch() {
      let params = {
        buildingId: this.buildingId,
         page: 1,
         rows: 3,
         type: 4
     }
     buildingQaSearch(params).then(res => {
       if (!res) return;
       this.questions = res.list;
     })
    },
    getHousekeeperList() {
      let params = {
        buildingId: this.buildingId,
        type: 1
      }
       housekeeperList(params).then(res => {
        if (!res) return;
        res.list.forEach(item => (item.expertiseFieldList = item.expertiseFieldList.slice(0, 3)))
        this.$set(this.housekeeper, 'menList', res.list || [])
       })
    },
    getBuildingUnitList(params) {
      buildingUnitList(params).then(res => {
          if (!res) return;
          let obj = {};
          obj.annexPath = res.annexPath
          obj = Object.assign(obj, res.cAppBuildingUnitBaseInfoList[0])
          this.houseSpread = obj;
      })
    },
    getBuildingDynamicAndDate(params) {
       buildingDynamicAndDate(params).then(res => {
           if (!res) return;
           let arr = [];
           let currentTime = (new Date()).valueOf();
           res.dateBaseInfoList.map(item => {
               item.evidenceDate && arr.push({
                 title: '预售证',
                 time: formatDate1(item.evidenceDate, 'yy-MM-dd'),
                 // img: currentTime < item.evidenceDate ? 'Pre-sale_Detailsd@2x.png' : 'Pre-sale_Details@2x.png',
                 timeOver: currentTime < item.evidenceDate,
                 id: 1
               })
               item.identifyChipsDate && arr.push({
                 title: '认筹',
                 time: formatDate1(item.identifyChipsDate, 'yy-MM-dd'),
                 img: currentTime < item.identifyChipsDate ? 'Raise_money_Details@2x.png' : 'Raise_money_Details_pre@2x.png',
                 timeOver: currentTime < item.identifyChipsDate,
                 id: 2
                })
               item.openTime && arr.push({
                 title: '开盘',
                 time: formatDate1(item.openTime, 'yy-MM-dd'),
                 img: currentTime < item.openTime ? 'opening_Details@2x.png' : 'opening_Details_pre@2x.png',
                 timeOver: currentTime < item.openTime,
                 id: 3
              })
           })
           this.$set(this.houseDynamic, 'timeing', res.dynamicBaseInfoList.slice(0, 2))
           this.$set(this.houseDynamic, 'active', arr)
       })
    },
    getbuildingHouseType() {
      let params = {
        buildingId: this.buildingId,
        bedroom: 0,
        page: 1,
        row: 10
      }
      buildingHouseType(params).then((res) => {
        if (!res) return;
        let obj = {};
        let array = [];
        this.$set(this.houseStyle, 'count', res.list.length)
        res.list.map(item => {
          let nums = item.houseType.split('室')[0];
          if (obj[nums]) {
            let sds = obj[nums].mess;
            sds.push(item)
            obj[nums] = {name: nums, num: obj[nums].num - 0 + 1, mess: sds}
          } else {
            let sd = [];
            sd.push(item)
             obj[nums] = {name: nums, num: 1, mess: sd}
          }
        })
        array = Object.values(obj).sort((a, b) => a.name - b.name);
        this.$set(this.houseStyle, 'styles', array)
        this.$set(this.houseStyle, 'houseMess', array[0].mess)
      })
    },
    checkBuildingBaseInfo(res) {
       this.currentPonitLat = res.lat;
       this.currentPonitlng = res.lng;
       this.introduce = res.buildingIntroduce;
       let obj = {}
       let obj1 = this.copy(this.houseMess);
       obj.address = `${res.areaName}-${res.streetName}  ${res.detailAddress}`;// 地址
       obj.referenceAveragePrice = res.referenceAveragePrice;
       obj.salesStatus = res.salesStatus.split(',')[0];
       obj.propertyType = res.propertyType.split(',')[0];
       obj.buildingTag = res.buildingTag.split(',').slice(0, 3) || [];
       obj.buildingBrightSpot = res.buildingBrightSpot;
       obj.referenceTotalPrice = res.referenceTotalPriceMin ? ` ${res.referenceTotalPriceMin}${res.referenceTotalPriceMax != null ? -res.referenceTotalPriceMax : ''} ` : '';
       obj.referenceBuildArea = res.referenceBuildAreaMin ? ` ${res.referenceBuildAreaMin}${res.referenceBuildAreaMax != null ? -res.referenceBuildAreaMax : ''} ` : '';
       obj1 = Object.assign(obj1, obj);
       Object.keys(obj1).forEach(item => obj1[item] ? '' : (obj1[item] = res[item] || ''));
       this.houseMess = obj1;
    },
    getAnnexsList(list) {
      // console.log(list)
      let newList = [];
      // 获取首个视频
      if (list['109']) {
        let videoInfo = list['109'].length > 0 ? list['109'][0] : ''
        if (videoInfo !== '') {
          let videoItem = {
            type: '2',
            smallAnnexPath: videoInfo.smallAnnexPath
          }
          newList.push(videoItem)
        }
      }
      // 获取首个VR
      // console.log(list)
      if (list['110']) {
        let vrInfo = list['110'].length > 0 ? list['110'][0] : ''
        if (vrInfo !== '') {
          let vrItem = {
            type: '3',
            smallAnnexPath: vrInfo.smallAnnexPath
          }
          newList.push(vrItem)
        }
      }

      // 获取封面图
      let picItem = {
        type: '1',
        smallAnnexPath: this.detailObj.albumCoverPicture
      }
      newList.push(picItem)
      // console.log(videoList)
      // 获取视频封面
      return newList;
    },
    formatList(list, type) {
      let listArr = []
      list.forEach((item, index) => {
        switch (type) {
          case '110':
            item.isVr = true;
            break;
          case '109':
            item.isVideo = true;
            break;
        }
        listArr.push(item)
      })
      return listArr;
    },
    copy(source) {
     let result = Array.isArray(source) ? [] : {};
     for (var key in source) {
       result[key] = source[key] != null && typeof source[key] === 'object' ? this.copy(source[key]) : source[key];
     }
     return result;
    }
  }
};

</script>
<style lang="scss" scoped>
  .sample {
    position: absolute;
  }
  .anchorBL{
    display:none!important;
  }
 .draw_img{
   width: 30px;
   height: 30px;
 }
 .mapSqure{
   width: 95px;
   height: 32px;
   background-color: white;
   position: absolute;
   top: -50px;
   border-radius: 8px;
   left: -31px;
   color: #1B1833;
    font-size: 15px;
    text-align: center;
    line-height: 36px;
 }
 .mapSqure::after{
     content: '';
     width: 0;
     height: 0;
     position: absolute;
      border: 12px solid;
      bottom: -23px;
      left: 36px;
     border-color:  #fff transparent transparent;
  }
   .ml3{
     margin-left: 15px;
   }
   .line{
     border-bottom: 1px solid #EFEFEF;
     margin: 14px 0;
   }
   .ml5{
       margin-left: 15px;
     }
     .mb5{
       margin-bottom: 15px;
     }
  .app{
  width: 100%;
  position: fixed;
  top: 0;
  bottom: 0px;
  box-sizing: border-box;
  z-index: 1;
}
.appScroll{
  position: fixed;
  top: 0px;
  bottom: 0px;
  width: 100%;
  overflow: hidden;
  z-index: 2;
}
 .houseShare{
   height: 100%;
   background-color: #F4F8F8;
   .TLeft{
     border-left: 2px solid #6BCFB6;
     margin-right: 5px;
     height: 16px;
     float: left;
   }
   .lin7{
     line-height: 17px;
     margin-bottom: 24px;
   }
   .p3{
     padding-right: 15px;
   }
   .tac{
     text-align: center;
   }
   .tar{
     text-align: right;
   }
   .baseColor{
     color: #52C196!important;
   }
   .fs10{
     font-size: 10px;
   }
   .disLB{
     display: inline-block;
   }
   .fl{
     float: left;
   }
   .mt4{
     margin-top: 4px;
   }
   .colorH{
     border-top: 0.053333rem solid #CFCFCF!important;
   }
   .clearfloat:after{display:block;clear:both;content:"";visibility:hidden;height:0}
   .clearfloat{zoom:1}
   .houseShare_baseMess_buttons{
         background-color: #F4F8F8;
         height: 34px;
         color: #52C196;
         width: 100%;
         text-align: center;
         line-height: 34px;
         font-size: 14px;
        font-weight: 700;
    }
    .dynamic_title{
       color:#3D3E3F;
       font-size: 16px;
       font-weight: 700;
     }
   &_lunbo{
     width: 100%;
     height: 10rem;
     position: relative;
     .lunbo_img{
       height:100%;
       &_current{
         width: 100%;
         height: 100%;
       }
       &_playDiv{
           position: absolute;
           width: 100%;
           left: 0;
           top: 0;
           height: 8.82rem;
       }
       &_play{
         width: 64px;
         height: 64px;
         border-radius: 50%;
         background-color: #1B1B1B;
         opacity: 0.6;
           left: 50%;
           top: 50%;
           position: absolute;
           transform: translate(-50%, -50%);
         &_icon{
           position: absolute;
           width: 20px;
           height: 23px;
           left: 24px;
           top: 50%;
           transform: translateY(-50%);
         }
       }
       &_change{
         position: absolute;
         bottom: 24px;
         height: 22px;
         width: 100%;
         text-align: center;
       }
       &_span{
         width: 44px;
         height: 100%;
         background-color: white;
         border-radius: 10px;
         display: inline-block;
         text-align: center;
         line-height: 24px;
         margin-right: 8px;
       }
       .spanColor{
         background-color: #52C196;
         color:white;
       }
     }
     .lunbo_price{
       height: 44px;
       width: 100%;
       position: absolute;
       bottom:0;
       &_div{
         position: absolute;
         width: 100%;
         height: 100%;
         left: 0;
         top: 0;
       }
       &_img{
         width: 100%;
         height: 100%;
       }
       &_mess{
        color: #A9A8AE;
        font-size: 12px;
        margin: 10px 0 0 15px;
        display: inline-block;
       }
       &_img2{
         width: 30px;
         height: 13px;
       }
       &_num{
         font-size: 24px;
         color: #F12224;
       }
     }
   }
   &_baseMess{
     width: 100%;
     height: 264px;
     background-color: white;
     padding: 24px 15px 0 15px;
     position: relative;
     box-sizing: border-box;
     &_spanDiv1{
       margin: 10px 0 15px 0;
       .spanList{
         background-color: #F0F4F4;
         padding: 0.08rem 0.16rem;
         color: #929292;
         font-size: 0.266667rem;
         border-radius: 0.053333rem;
         margin-right: 0.08rem;
         display: inline-block;
         margin-bottom: 3px;
       }
     }
     &_span1{
       color: #3D3E3F;
       font-size: 20px;
       float: left;

     }
     &_span2{
       width: 32px;
       height: 16px;
       line-height: 18px;
       color:white;
       border-radius: 2px;
       background-color: #52C196;
       display: inline-block;
       text-align: center;
       margin: 2px 4px 0 5px;

     }
     &_span3{
        background-color: #FF8252;
        margin-left: 0;
     }
     &_spanMess{
       color:#6D6D6D;
       font-size: 12px;
       overflow: hidden;
       text-overflow: ellipsis;
       white-space: nowrap;
      .spanMessStar{
        width: 13px;
        height: 11px;
      }
     }
     &_live{
       width: 50px;
       height: 50px;
       position: absolute;
       right: 15px;
       top: -5px;
       .liveMess{
         width: 100%;
         height: 100%;
       }
     }
     &_house{
       display: flex;
       flex-direction: row;
       flex-wrap: wrap;
       .houseSpan{
         width: 60%;
         color: #6D6D6D;
         font-size: 13px;
         margin-bottom: 10px;
       }
       .houseSpan1{
         width: 40%;
          color: #6D6D6D;
         font-size: 13px;
         margin-bottom: 10px;
       }
     }
     &_buttons{
         background-color: #F4F8F8;
         height: 34px;
         color: #52C196;
         width: 100%;
         text-align: center;
         line-height: 34px;
       }
      &_footer{
        margin: 20px 0;
        color: #6D6D6D;
        font-size: 13px;
        .footerImg{
         position: absolute;
         width: 32px;
         height: 22px;
         right: 20px;
         bottom: 15px;
        }
      }}
   &_alertmess{
     height: 60px;
     margin: 10px 0;
     .alertmessImg{
      width: 100%;
      height: 100%;
     }
   }
   &_houseStyle,&_questions{
     background-color: #fff;
     padding: 20px 15px 15px 15px;
     .houseStyleTMess{
       color: #3D3E3F;
       font-size: 16px;
       font-weight: 700;
       display: inline-block;
     }
     .houseStyleTR{
      float: right;
     }
     .houseStyles{
       font-size: 16px;
       color: #A9A8AE;
       margin-right: 14px;
     }
     .houseStyleMess{
       margin-top: 20px;
       display: flex;
       width: 100%;
       overflow: hidden;
       margin-bottom: 15px;
       height: 240px;
       &_all{
         float: left;
         margin-right: 13px;
         display: inline-block;
       }
       &_img{
         width: 202px;
         height: 166px;
         margin-bottom: 9px;
       }
       &_style{
         font-size: 15px;
         color: #1B1833;
         font-weight: 700;
       }
       &_spans{
         width: 32px;
         height: 16px;
         line-height: 18px;
         color:white;
         border-radius: 2px;
         background-color: #FF824B;
         display: inline-block;
         text-align: center;
         margin-left: 5px;
       }
       &_area{
         margin: 8px 0 10px 0;
         color: #706F81;
         font-size: 13px;
       }
       &_price{
         color: #F12224;
         font-size: 15px;
         font-weight: 700;
       }
     }
   }
   &_dynamic{
     background-color: white;
     padding: 20px 0 20px 15px;
     margin-top: 10px;
    &_active{
      width: 100%;
      display: flex;
    }
    .dynamic_actives{
      width: 25%;
      &_divs{
        height:21px;
        position: relative;
      }
      &_img{
        width: 21px;
        height: 21px;
        position: absolute;
      }
      &_line{
        width: 100%;
        display: inline-block;
        position: absolute;
        left: 0;
        top: 11px;
        border-top: 0.053333rem solid #6BCFB6;
      }
      &_title{
        margin: 6px 0 5px;
        color: #000000;
        font-size: 12px;
      }
      &_name{
        color: #686868;
        font-size: 12px;
      }
    }
    &_timeing{
      padding-right: 18px;
      margin-top: 24px;
      .right_time{
        color: #CBCBCB;
        font-size: 12px;
      }
      .right_title{
        font-size: 16px;
        color: #282828;
        margin: 15px 0 10px;
        font-weight: 700;
      }
      .right_message{
        color: #6A6F70;
        font-size: 14px;
        display: -webkit-box;
        -webkit-line-clamp:2;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
      }
    }
    .leftTimes{
      float: left;
      position: relative;
      width: 8px;
      height: 110px;
      margin-right: 9px;
      &_title{
        width: 9px;
        height: 9px;
        border-radius: 8px;
        position: absolute;
        background-color: #D8D8D8;
      }
      &_line{
        position: absolute;
        height: 100%;
        left: 4px;
        border-left: 1px solid  #D8D8D8;
      }
    }
   }
   &_spread,&_periphery{
     margin-top: 10px;
     padding: 20px 20px 15px;
     background-color: white;
     .spread_main{
       padding-left: 5px;
       &_img{
         width: 100%;
         height: 21em;
       }
       &_divs{
         margin: 10px 0 16px;
         display: flex;
         >div{
           //display: inline-block;
           flex:1;
           >div{
             color: #1B1833;
             font-size: 15px;
             font-weight: 700;
             margin-bottom: 5px;
           }
           .divsSpan{
              color: #6D6D6D;
             font-size: 13px;
           }
         }
         .r14{
           margin-right: 14px;
         }
       }
     }
   }
   &_periphery{
     .spread_main_styles{
       margin-top: 10px;
       width: 200%;
       >div{
           display: inline-block;
           margin-right: 25px;
         }
       .styles_divs{
         color: #323232;
         font-size: 15px;
       }
     }
     .busList{
       margin: 15px 0;
       &_left{
         color: #323232;
         font-size: 13px;
       }
        &_center{
           color: #C0C3CA;
           font-size: 13px;
           max-width: 56%;
           white-space: nowrap;
           overflow: hidden;
           text-overflow: ellipsis;
           display: inline-block;
           }
        &_right{
         float: right;
         color: #A9A8AE;
         font-size: 11px;
         &_img{
           width: 6px;
           height: 9px;
         }
       }
     }
   }
   &_questions{
     margin-top: 10px;
     background-color: white;
     padding: 20px 15px;
     .questions{
       margin-bottom: 33px;
       &_ask{
          width: 16px;
          height: 16px;
          border-radius: 4px;
          text-align: center;
         line-height: 17px;
         color: white;
         background-color: #67D0B6;
        display: inline-block;
        margin:0 5px 6px 0;
       }
       &_askMess{
         color: #1B1833;
         font-size: 13px;
       }
       &_divs{
         display:flex;
       }
       &_answer{
           width: 16px;
          height: 16px;
          border-radius: 4px;
          text-align: center;
          line-height: 17px;
          color: white;
          background-color: #FF714B;
         display: inline-block;
         margin-right: 6px;
         flex: 0 0 16px;
       }
       &_answerMess{
          color: #A9A8AE;
         font-size: 13px;
       }
     }
      .questions:first-child{
       margin-top: 27px;
     }
      .questions:last-child{
       margin-bottom: 20px;
     }

   }
   &_housekeeper{
     padding: 20px 0 0px 0px;
     background-color: white;
     margin-top: 10px;
     .ml5{
       margin-left: 15px;
     }
     .housekeeper_title{
       display: inline-block;
     }
     .housekeeper_title_img{
       width: 11px;
       height: 11px;
       margin: 0 1px 0 10px;
       float: left;
       margin-top: 2px;
     }
     .housekeeper_title_mess{
       color: #999999;
       font-size: 12px;
     }
     .housekeeper_img{
       margin: 0 11px 15px 20px;
       width: 60px;
       height: 60px;
       float: left;
       border-radius: 50%;
       overflow: hidden;
       >img{
         width: 100%;
         height: 100%;
       }
     }
     .housekeeper_name{
       font-size: 16px;
       color: #222222;
       font-weight: 700;
       margin: 12px 5px 9px 0;
       display: inline-block;
     }
     .housekeeper_satisfaction{
       padding: 3px 6px;
       background-color: #B7B8C0;
       color: white;
       font-style: 8px;
       border-radius: 9px;
     }
     .housekeeper_spans{
       color: #999999;
       font-size: 12px;
       margin-right: 8px;
     }
     .housekeeper_divs{
       position: relative;
     }
     .housekeeper_pos{
       position: absolute;
       right: 20px;
       top:18px;
      &_img{
        width: 25px;
        height: 25px;
        margin-right: 15px;
      }
      &_img:last-child{
        margin-right:0;
      }
     }
     .housekeeper_line{
        border-top: 1px solid #EDEDED;
        width: 100%;
        margin-bottom: 14px;
      }
   }
   &_introduce{
     margin-top: 10px;
     background-color: white;
     padding-top: 20px;
     .introduce_imgs{
       width: 100%;
     }
   }
   &_recommend{
     padding: 20px 0px 0 15px;
     margin-top: 10px;
     background-color: white;
     .recommend_lists{
       &_one{
         width: 105px;
         height: 85px;
         float: left;
         margin-right: 10px;
       }
       &_img{
         width: 100%;
         height: 100%;
         border-radius: 4px;
       }
       &_address{
         color: #282828;
         font-size: 16px;
         font-weight: 700;
         margin-bottom: 10px;
       }
       &_price{
         color: #FF4750;
         margin-bottom: 7px;
       }
       .recommend_lists_p{
         font-size: 16px;
       }
       &_aere{
         color: #6A6F70;
         font-size: 12px;
         margin-bottom: 8px;
       }
       &_goodList{
         padding: 3px 4px;
         background-color: #F0F4F4;
         color: #929292;
         font-size: 10px;
         margin-right: 3px;
         border-radius: 2px;
       }
     }
     .recommend_mess{
       margin: 10px 0 15px 0;
       background-color: #FFF9F3;
       color: #A9A29A;
       font-size: 10px;
       height: 18px;
       line-height: 20px;
       display: inline-block;
       padding-right: 10px;
       overflow: hidden;
       text-overflow: ellipsis;
       white-space: nowrap;
       &_img{
         width: 14px;
         height: 14px;
         float: left;
         margin: 2px 4px 0 0;
       }
     }
     .recommend_line{
       border-top: 1px solid #EFEFEF;
       margin-bottom: 15px;
     }
   }
   &_declare{
     margin: 15px 0 50px 0;
     padding: 0 23px 30px 15px;
     display: flex;
     &_imgs{
       flex: 0 0 13px;
       height: 15px;
       margin-right: 5px;
     }
     &_msgs{
       flex:1;
       color: #929292;
       font-size: 10px;
       .msgs_title{
         margin:4px 0 10px;
       }
       .msgs_main{
         line-height: 16px;
       }
     }
     &_currentImg{
       width: 100%;
       height: 100%;
     }
   }
  }
  .houseShare_footer{
     position: fixed;
     height: 58px;
     width: 100%;
     bottom: 0;
     left: 0;
     padding: 10px;
     background-color: white;
     box-sizing: border-box;
     z-index:999;
     .footerButton{
       background-color: #67D0B6;
       color: white;
       width: 48%;
       height: 38px;
       border-radius: 2px;
       display: inline-block;
       font-size: 14px;
       text-align: center;
       line-height: 38px;
     }
     &_telphone{
       background-color: #FF714B!important;
       float: right;
     }
   }
.model{
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  z-index: 99;
  background-color: rgba(0, 0, 0, 0.6);
  .model-content{
    position: relative;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    width: 327px;
    height: 304px;
    background-color:#fff;
    border-radius: 10px;
    box-sizing: border-box;
    text-align: center;
    .close{
      position: absolute;
      right:15px;
      top:15px;
      font-size: 24px;
      font-size: 17px;
      color: #fff;
    }
    .title{
      color: #222222;
      font-size: 17px;
      font-weight: 700;
      margin: 5px 0 10px 0;
    }
    .gray{
      font-size: 14px;
      color: #666666;
      margin-bottom: 25px;
    }
    .btn{
      margin: 0 auto;
      width: 140px;
      height: 40px;
      background-color: #FF8252;
      border-radius: 50px;
      color: #fff;
      font-size: 14px;
      text-align: center;
      line-height: 40px;
      text-align: center;
    }
    .img-box{
      width: 100%;
      height: 160px;
      img{
        display: block;
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>

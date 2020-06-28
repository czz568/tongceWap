<template>
  <div class="mian-warp">
    <!-- 户型ban -->
    <div class="houseBan">
      <van-swipe @change="swipeChange" :loop="false" ref="typeSwipe" :height="280">
        <van-swipe-item
          v-for="(item, index) in houseBan"
          :key="index"
          @click="swipeClick(item, index)"
        >
          <van-image height="280px" width="100%" :src="item.path" />
          <img v-show="item.type == 1" class="icon" src="../../assets/img/VrIcon.png" />
        </van-swipe-item>

        <template #indicator>
          <div class="custom-indicator">
            <span
              @click="spanSwipeClick(item)"
              :class="{'active': item.type == currentType}"
              v-for="(item, index) in houseBan.reduce((all,next)=>all.some((item)=>item['type']==next['type'])?all:[...all, next],[])"
              :key="index"
            >{{item.type==1 ? 'VR' : item.type==2 ? '户型图' : item.type==3 ? '样板间' : '-'}}</span>
          </div>
        </template>
      </van-swipe>
    </div>

    <!--  户型描述 -->
    <div class="room-des">
      <div class="title">
        <h3>
          {{houseInfo.houseType}}
          <img
            :src="require('../../assets/img/icon_fire@2x.png')"
            v-if="houseInfo.isHot==1"
          />
        </h3>
        <div>
          <!--两种状态  有价格  第二无价格-->
          <span v-if="houseInfo.totalPrice">
            总价约
            <b>{{houseInfo.totalPrice}}万</b>
          </span>
          <b v-else>总价待定</b>
        </div>
      </div>
      <div class="description">
        <span :class="'sale'+houseInfo.salesStatus">{{houseInfo.salesStatus | salesStatusFlag}}</span>
        <span v-for="(item,index) of houseTag" :key="index">{{item}}</span>
      </div>
      <p class="introduction">
        <!-- <span>建面约{{houseInfo.constructionArea}} ㎡</span>
        <span>朝向{{houseInfo.oriented | orientedFlag}}</span>-->
        <span v-if="'houseInfo.constructionArea'">建面约{{houseInfo.constructionArea}}㎡</span>
        <span v-else>建面待定</span>
        <span v-if="'houseInfo.oriented'">朝向{{houseInfo.oriented | orientedFlag}}</span>
        <span v-else>朝向待定</span>
        {{houseInfo.houseTypeName}}
      </p>
      <div class="address">
        <span>所属楼盘：</span>
        <em @click="buildingClick(houseInfo)">
          {{houseInfo.buildingName}}
          <i class="iconfont iconarrow_right"></i>
        </em>
      </div>
      <!--两种状态  有价格  第二无价格-->

      <div class="priceDisplay" v-if="houseInfo.totalPrice">
        <div class="priceDisplayCont">
          <!--(data.totalPrice*0.35).toFixed(2)-->
          <p class="title">首付3.5成约{{(houseInfo.totalPrice*0.35).toFixed(2)}}万 · 商贷30年 · 等额本息</p>
          <div class="priceShow">
            <div>
              <p>贷款总额</p>
              <!--this.loanData.loanTotal = (data.totalPrice*0.65).toFixed(2)-->
              <p>{{(houseInfo.totalPrice*0.65).toFixed(2)}}万元</p>
            </div>
            <!-- var obj = calculate(this.loanData) -->
            <div>
              <p>利息总额</p>
              <!-- totalRepayment = (Number(obj.interest.left.replace(/,/g, ""))/10000).toFixed(2)-->
              <p>{{totalRepayment}}万元</p>
            </div>
            <div>
              <p>每月应还</p>
              <!--  monthPrice = obj.repayments.left+'.'+obj.repayments.right -->
              <p>{{monthPrice}}元</p>
            </div>
          </div>
        </div>
        <div class="priceDisplay_link" @click="linkJump">编辑条件</div>
      </div>
      <div class="loanCalculation" v-else @click="linkJump">贷款计算</div>
    </div>
    <!--户型点评-->
    <div class="unitReviews" v-if="this.viewsFlag">
      <div class="unitReviewsCont">
        <h3>户型点评</h3>
        <dl v-for="(itemHou,index) in houseInfo.houseTypeReviews" :key="index">
          <dt>{{itemHou.reviewTitle}}</dt>
          <dd>{{itemHou.reviewContent}}</dd>
        </dl>
      </div>
    </div>
    <!--推荐户型-->
    <div class="recommendType">
      <div class="unitReviewsCont">
        <h3>推荐户型</h3>
        <ul class="typeListCont">
          <li v-for="item in houseInfo.houseTypeListVOS" :key="item.id">
            <router-link
              :to="{name:'houseTypeDetails', params:{buildingId:$route.params.buildingId,houseTypeId:item.id}}"
              @click.native="flushCom"
              style="cursor:pointer;"
            >
              <div class="left">
                <van-image width="125px" height="103px" :src="item.annexPath" />
                <div class="title">{{item.houseTypeName}}</div>
              </div>
              <div class="right">
                <h3>
                  {{item.houseType}}
                  <img src="../../assets/img/icon_fire@2x.png" />
                </h3>
                <p>
                  <!-- <span>建面约{{item.constructionArea}}㎡</span>
                  朝向{{item.oriented | orientedFlag}}-->
                  <span v-if="item.constructionArea">建面约{{item.constructionArea}}㎡</span>
                  <span v-else>建面待定</span>
                  <span v-if="item.oriented">朝向{{item.oriented | orientedFlag}}</span>
                  <span v-else>朝向待定</span>
                </p>
                <div class="price">
                  总价约
                  <!-- <span>{{item.totalPrice}}万元</span> -->
                  <!--两种状态  有价格  第二无价格-->
                  <span v-if="item.totalPrice">
                    <b>{{item.totalPrice}}万</b>
                  </span>
                  <b v-else>总价待定</b>
                </div>
                <div class="lable">
                  <b :class="'sale'+item.salesStatus">{{item.salesStatus | salesStatusFlag}}</b>

                  <b v-for="(itemC,index) of item.houseTagChild" :key="index">{{itemC}}</b>
                </div>
              </div>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <!--底部-->
    <div class="page-bottom">
      <consultation-foot
        @changeCollection="changeCollection"
        @consultBtn="consultBtn"
        :isCollection="isCollection"
        @consultConfirm="consultConfirm"
      ></consultation-foot>
    </div>
    <!--图片 预览标题-->
    <div class="previewTitle" v-show="previewTitle">
      <van-tabs
        v-model="vanActive"
        line-height="0"
        line-width="0"
        background="transparent"
        :border="false"
        :ellipsis="false"
        @click="tabClick"
      >
        <template
          v-for="(item, index) in houseBan.reduce((all,next)=>all.some((item)=>item['type']==next['type'])?all:[...all, next],[])"
        >
          <van-tab
            :title="item.type==2 ? '户型图('+ item.imgTotal+')' : item.type==3 ? '样板间('+item.imgTotal+')' : '-'"
            :name="item.type"
            :key="index"
            v-if="item.type != 1"
          ></van-tab>
        </template>
      </van-tabs>
    </div>
    <van-image-preview
      v-model="show"
      :images="imagePaths"
      :closeable="true"
      :loop="false"
      @close="PreviewClose"
      @change="PreviewChange"
      :startPosition="startPosition"
    >
      <template v-slot:index>{{ imgIndex }} / {{imgTotal}}</template>
    </van-image-preview>
  </div>
</template>
<script>
import Vue from "vue";
import { Image, Swipe, SwipeItem, ImagePreview, Tab, Tabs } from "vant";
Vue.use(Image)
  .use(Swipe)
  .use(SwipeItem)
  .use(ImagePreview)
  .use(Tab)
  .use(Tabs);
import { urlParse } from "../../common/js/util.js";
import { calculate } from "../calculator/toolCalc.js";
import { getDetail } from "@/apiOptions/home_api.js";
import consultationFoot from "../../components/consultationFoot/index.vue";
import wxShare from "weixin-js-sdk";
export default {
  components: {
    consultationFoot
  },
  data() {
    return {
      houseInfo: {},
      loanData: {
        comprise: 1, // 贷款方式： 1商业贷款；2公积金贷款；3组合贷款
        loanType: 1, // 1为等额本息   2为等额本金
        total: "", // 房屋总价
        ratio: 4.9, // 贷款比例
        loanTotal: "", // 贷款总额
        year: 30, // 贷款年限
        fundRate: 3.25, // 公积金年利率
        fundTotal: "", // 公积金贷款金额
        rate: 4.9, // 商贷年利率
        rateTotal: "" // 商业贷款金额
      },

      totalRepayment: "", //利息总额
      monthPrice: "", //月供
      houseTag: [], //房屋标签
      houseTagChild: [], //房屋标签

      show: false,

      currentType: 1,
      imgIndex: 1,
      imgTotal: 1,
      houseBan: [],
      annexPaths: [],
      modelHouses: [],
      vrUrl:
        "http://test.shhxfyl.com/image/default/E64A4AD4E0414EE5B54ABAA7B4A927D3-6-2.png",
      vrImg: "",
      previewTitle: false,
      vanActive: 2,
      imagePaths: [],
      startPosition: 0,

      //收藏
      token: "",
      isCollection: false,
      tel: "", //底部中间点击获取管家电话
      tel400: "", //获取到的400
      workNo: "",
      viewsFlag: 0
    };
  },
  methods: {
    buildingClick(item) {
      window.location.href =
        window.location.protocol +
        "//" +
        window.location.host +
        "/dynamicPages/mstation/" +
        item.buildingId +
        ".html";
    },
    flushCom() {
      window.location.reload();
    },
    // 跳转链接
    linkJump() {
      this.$router.push({
        path: "/calculator",
        query: { loanTotal: this.loanData.loanTotal }
      });
    },
    // ban 切换
    swipeChange(index) {
      this.currentType = this.houseBan[index].type;
    },
    spanSwipeClick(item) {
      this.$refs.typeSwipe.swipeTo(item.numIndex, { immediate: true });
      this.currentType = item.type;
    },
    swipeClick(item) {
      if (item.type == 1) {
        window.location.href = this.houseInfo.vrUrl;
      } else {
        if (this.vrUrl) {
          this.startPosition = item.numIndex - 1;
        } else {
          this.startPosition = item.numIndex;
        }
        this.show = true;
        this.previewTitle = true;
        let reg = /[?&][^?&]+=[^?&]+/g;
        let obj = {};
        item.path.match(reg).forEach(item => {
          let tempArr = item.substring(1).split("=");
          let key = decodeURIComponent(tempArr[0]);
          let val = decodeURIComponent(tempArr[1]);
          obj[key] = val;
        });
        this.imgIndex = obj.imgIndex;
        this.imgTotal = obj.imgTotal;
        this.vanActive = Number(obj.imgType);
      }
    },
    PreviewClose() {
      this.show = false;
      this.previewTitle = false;
    },
    PreviewChange(index) {
      let reg = /[?&][^?&]+=[^?&]+/g;
      let obj = {};
      this.imagePaths[index].match(reg).forEach(item => {
        let tempArr = item.substring(1).split("=");
        let key = decodeURIComponent(tempArr[0]);
        let val = decodeURIComponent(tempArr[1]);
        obj[key] = val;
      });
      this.imgIndex = obj.imgIndex;
      this.imgTotal = obj.imgTotal;
      this.vanActive = Number(obj.imgType);
      this.startPosition = index;
    },
    // 点击tab事件
    tabClick(name) {
      this.startPosition = this.imagePaths.findIndex(function(
        value,
        index,
        array
      ) {
        let reg = /[?&][^?&]+=[^?&]+/g;
        let obj = {};
        value.match(reg).forEach(item => {
          let tempArr = item.substring(1).split("=");
          let key = decodeURIComponent(tempArr[0]);
          let val = decodeURIComponent(tempArr[1]);
          obj[key] = val;
        });
        return obj.imgType == name;
      });
    },

    getHouseTypeDetail() {
      getDetail("/api/building/buildingHouseType/detail", {
        id: this.$route.params.houseTypeId,
        buildingId: this.$route.params.buildingId
      })
        .then(res => {
          console.log(6699, res);
          this.houseInfo = res;
          console.log("this.houseInfo");
          console.log(this.houseInfo);
          this.annexPaths = this.houseInfo.annexPaths;
          this.modelHouses = this.houseInfo.modelHouses;

          this.vrUrl = this.houseInfo.vrUrl;
          this.vrImg = this.houseInfo.vrImg;

          if (this.houseInfo.houseTypeTag) {
            this.houseTag = this.houseInfo.houseTypeTag.split(",");
          }
          this.viewsFlag = this.houseInfo.houseTypeReviews.length;

          if (this.houseInfo.houseTypeListVOS) {
            this.houseInfo.houseTypeListVOS.forEach(item => {
              if (item.houseTypeTag) {
                item.houseTagChild = item.houseTypeTag.split(",");
              }
            });
          }

          this.loanData.loanTotal = (this.houseInfo.totalPrice * 0.65).toFixed(
            2
          );
          this.totalRepayment = (
            Number(calculate(this.loanData).interest.left.replace(/,/g, "")) /
            10000
          ).toFixed(2);
          this.monthPrice =
            calculate(this.loanData).repayments.left +
            "." +
            calculate(this.loanData).repayments.right;

          if (this.vrUrl) {
            this.houseBan.push({
              type: 1,
              path: this.vrImg
            });
          }
          if (this.annexPaths.length > 0) {
            for (let i = 0; i < this.annexPaths.length; i++) {
              this.houseBan.push({
                type: 2,
                path:
                  this.annexPaths[i] +
                  "?x-oss-process=image/resize,h_294,w_393" +
                  "&imgIndex=" +
                  (i + 1) +
                  "&imgTotal=" +
                  this.annexPaths.length +
                  "&imgType=" +
                  2,
                imgTotal: this.annexPaths.length
              });
            }
          }
          if (this.modelHouses.length) {
            for (let i = 0; i < this.modelHouses.length; i++) {
              this.houseBan.push({
                type: 3,
                path:
                  this.modelHouses[i] +
                  "?x-oss-process=image/resize,h_294,w_393" +
                  "&imgIndex=" +
                  (i + 1) +
                  "&imgTotal=" +
                  this.modelHouses.length +
                  "&imgType=" +
                  3,
                imgTotal: this.modelHouses.length
              });
            }
          }
          for (let i = 0; i < this.houseBan.length; i++) {
            this.houseBan[i].numIndex = i;
            if (this.houseBan[i].type != 1) {
              this.imagePaths.push(this.houseBan[i].path);
            }
          }
          document.querySelector("body").className = "bodyOwnStyle";
          this.houseShareConfig();
        })
        .catch(err => {
          console.log("请求结果报错", err);
        });
    },

    // 收藏
    changeCollection() {
      this.checkLoginCollect();
      // if (this.token) {
      //   debugger;
      //   let phone = this.$tool.getStorage("phoneNum");
      //   let celPhone;
      //   if (this.$tool.getStorage(phone)) {
      //     celPhone = JSON.parse(this.$tool.getStorage(phone));
      //   } else {
      //     celPhone = {};
      //   }
      //   let buildingId = this.$route.params.buildingId.toString();
      //   let houseTypeId = this.$route.params.houseTypeId.toString();
      //   let obj = {};
      //   if (celPhone[buildingId]) {
      //     if (celPhone[buildingId].hasOwnProperty(houseTypeId)) {
      //       delete celPhone[buildingId][houseTypeId];
      //       obj[phone] = JSON.stringify(celPhone);
      //       this.$tool.setStorage(obj);
      //       this.isCollection = false;
      //       this.$toast("你已取消收藏");
      //     } else {
      //       celPhone[buildingId][houseTypeId] = {};
      //       obj[phone] = JSON.stringify(celPhone);
      //       this.$tool.setStorage(obj);
      //       this.isCollection = true;
      //       this.$toast("收藏成功，请在APP内查看。");
      //     }
      //   } else {
      //     celPhone[buildingId] = {
      //       [houseTypeId]: {}
      //     };
      //     obj[phone] = JSON.stringify(celPhone);
      //     this.$tool.setStorage(obj);
      //     this.isCollection = true;
      //     this.$toast("收藏成功，请在APP内查看。");
      //   }
      // } else {
      //   this.$router.push({
      //     path: "/login",
      //     query: {
      //       topath:
      //         "houseTypeDetails" +
      //         "/" +
      //         this.$route.params.buildingId +
      //         "/" +
      //         this.$route.params.houseTypeId
      //     }
      //   });
      // }
    },

    checkLoginCollect() {
      getDetail("/tospurWeb/pclogin/checkLogin", {
        token: this.$tool.getToken()
      })
        .then(res => {
          if (res) {
            let phone = this.$tool.getStorage("phoneNum");
            let celPhone;
            if (this.$tool.getStorage(phone)) {
              celPhone = JSON.parse(this.$tool.getStorage(phone));
            } else {
              celPhone = {};
            }
            let buildingId = this.$route.params.buildingId.toString();
            let houseTypeId = this.$route.params.houseTypeId.toString();
            let obj = {};
            if (celPhone[buildingId]) {
              if (celPhone[buildingId].hasOwnProperty(houseTypeId)) {
                delete celPhone[buildingId][houseTypeId];
                obj[phone] = JSON.stringify(celPhone);
                this.$tool.setStorage(obj);
                this.isCollection = false;
                this.$toast("你已取消收藏");
              } else {
                celPhone[buildingId][houseTypeId] = {};
                obj[phone] = JSON.stringify(celPhone);
                this.$tool.setStorage(obj);
                this.isCollection = true;
                this.$toast("收藏成功，请在APP内查看。");
              }
            } else {
              celPhone[buildingId] = {
                [houseTypeId]: {}
              };
              obj[phone] = JSON.stringify(celPhone);
              this.$tool.setStorage(obj);
              this.isCollection = true;
              this.$toast("收藏成功，请在APP内查看。");
            }
          }
        })
        .catch(err => {
          console.log("未登录或登录过期", err);
          console.log(err.code);
          if (err.code == 1) {
            this.$router.push({
              path: "/login",
              query: {
                topath:
                  "houseTypeDetails" +
                  "/" +
                  this.$route.params.buildingId +
                  "/" +
                  this.$route.params.houseTypeId
              }
            });
          }
        });
    },

    //咨询售楼部
    //get管家
    consultBtn() {
      getDetail("/api/tospurWeb/v1/capp/rongcloud/new/getHousekeeperList", {
        buildingId: this.$route.params.buildingId,
        type: 1
      })
        .then(res => {
          console.log("我是优秀管家");
          console.log(res);
          this.tel = res.list[0].phone;
          this.workNo = res.list[0].workNo;
          console.log(this.tel);
          this.getMaj();
        })
        .catch(err => {
          console.log("请求结果报错", err);
        });
    },
    //获取管家手机号对应的400
    getMaj() {
      if (this.token) {
        getDetail("/api/tospurWeb/api/capp/v1/user/getUserPhone", {
          phone: this.tel,
          source: 4,
          "X-token": this.$tool.getStorage("M-token")
        })
          .then(res => {
            console.log("登录");
            console.log(res);
            this.tel400 = res.mobile;
            window.location.href = "tel:" + this.tel400;
          })
          .catch(err => {
            console.log("请求结果报错", err);
          });
      } else {
        getDetail("/api/tospurWeb/capp/v2/user/getUserPhone", {
          phone: this.tel,
          source: 4
        })
          .then(res => {
            console.log("我是没登录");
            console.log(res);
            this.tel400 = res.mobile;
            window.location.href = "tel:" + this.tel400;
          })
          .catch(err => {
            console.log("请求结果报错", err);
          });
        // window.location.href = `tel:02133194608,${this.workNo}#`;

        // this.$router.push({
        //   path: "/login",
        //   query: {
        //     topath:
        //       "houseTypeDetails" +
        //       "/" +
        //       this.$route.params.buildingId +
        //       "/" +
        //       this.$route.params.houseTypeId
        //   }
        // });
      }
    },
    //我要咨询btn
    consultConfirm(val) {
      console.log(val);
      let hmsr = this.$tool.getUrlParams("hmsr") || this.$tool.getStorage("hmsr") || "",
      hmpl = this.$tool.getUrlParams("hmpl") || this.$tool.getStorage("hmpl") || "";
      getDetail("/api/customer/mweb/customer/record/addRecord", {
        phone: val.data.telNum,
        customerName: val.data.name,
        source: 1, //来源 1:M站,2:app
        buildId: this.$route.params.buildingId,
        houseTypeId: this.$route.params.houseTypeId,
        hmsr,
        hmpl
      })
        .then(res => {
          console.log("我要咨询接口");
          console.log(res);
          this.$toast("稍后管家会跟您联系，请耐心等待");
        })
        .catch(err => {
          console.log("请求结果报错", err);
        });
    },
    // 分享
    houseShareConfig() {
      let that = this;
      // console.log(window.location)
      let params = {
        url: encodeURIComponent(location.href)
      };
      // alert(location.href.split('#')[0])

      getDetail("/tospurWeb/wx/serviceNumber/config", params, true).then(
        res => {
          console.log(res);
          wxShare.config({
            // debug: true, // 开启调试模式
            appId: res.appId, // 必填，公众号的唯一标识
            timestamp: res.timeStamp, // 必填，生成签名的时间戳
            nonceStr: res.nonceStr, // 必填，生成签名的随机串
            signature: res.signature, // 必填，签名
            jsApiList: ["updateTimelineShareData", "updateAppMessageShareData"]
          });
          console.log(
            that.houseInfo.buildingName,
            that.houseInfo.houseType,
            that.$formatter.AveragePrice(1, that.houseInfo.unitPrice),
            "分享标题"
          );
          console.log(that.houseInfo.houseTypeTag, "分享描述");
          console.log(location.href, "分享链接");
          console.log(
            that.houseInfo.annexPath +
              "?x-oss-process=image/resize,m_lfit,w_100,h_100",
            "分享图标"
          );
          // 通过ready接口处理成功验证
          wxShare.ready(function() {
            that.wxShareTimeline();
            that.wxShareAppMessage();
          });

          wxShare.error(function(res) {
            console.log(res);
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
          });
          console.log(res);
        }
      );
    },
    wxShareTimeline() {
      let that = this;
      wxShare.updateAppMessageShareData({
        title:
          that.houseInfo.buildingName +
          " " +
          that.houseInfo.houseType +
          " " +
          that.$formatter.AveragePrice(1, that.houseInfo.unitPrice), // 分享标题
        desc: that.houseInfo.houseTypeTag, // 分享描述
        link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl:
          that.houseInfo.annexPath +
          "?x-oss-process=image/resize,m_lfit,w_100,h_100", // 分享图标
        success: () => {}
      });
    },
    wxShareAppMessage() {
      // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
      let that = this;
      wxShare.updateTimelineShareData({
        title:
          that.houseInfo.buildingName +
          " " +
          that.houseInfo.houseType +
          " " +
          that.$formatter.AveragePrice(1, that.houseInfo.unitPrice), // 分享标题
        desc: that.houseInfo.houseTypeTag, // 分享描述
        link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl:
          that.houseInfo.annexPath +
          "?x-oss-process=image/resize,m_lfit,w_100,h_100", // 分享图标
        success: () => {}
      });
    }
  },
  computed: {},
  mounted() {},
  filters: {
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

    salesStatusFlag(value) {
      let set = { 1: "待售", 2: "在售", 3: "售罄", 4: "在租" };
      return set.hasOwnProperty(value) ? set[value] : value;
    },
    
  },
  watch: {
    '$route': 'getHouseTypeDetail' 
  },
  created() {
    this.getHouseTypeDetail();
    this.token = this.$tool.getStorage("M-token");
    if (this.$tool.getStorage("phoneNum")) {
      let phone = this.$tool.getStorage("phoneNum");
      if (this.$tool.getStorage(phone)) {
        let celPhone = JSON.parse(this.$tool.getStorage(phone));
        let buildingId = this.$route.params.buildingId;
        let houseTypeId = this.$route.params.houseTypeId;
        if (celPhone[buildingId]) {
          if (celPhone[buildingId].hasOwnProperty(houseTypeId)) {
            this.isCollection = true;
          }
        }
      }
    }

  }
};
</script>
<style lang="scss">
.bodyOwnStyle .van-image-preview__close-icon--top-right {
  left: 16px;
  right: auto;
  &:before {
    content: "";
    width: 18px;
    height: 18px;
    background: url("../../assets/img/down_Details@2x.png") no-repeat left top;
    background-size: 100% 100%;
  }
}
</style>
<style lang="scss" scoped>
.mian-warp {
  width: 100%;
  padding-bottom: 48px;
  .houseBan {
    .van-swipe-item {
      .icon {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 64px;
        transform: translate(-50%, -50%);
        z-index: 2;
      }
    }
    .custom-indicator {
      position: absolute;
      left: 50%;
      bottom: 14px;
      transform: translate(-50%, 0);
      z-index: 2;
      display: flex;
      span {
        text-align: center;
        min-width: 44px;
        margin: 0 4px;
        padding: 5px 7px;
        display: inline-block;
        color: #333333;
        font-size: 11px;
        background-color: #f5f5f5;
        border-radius: 10px;
        &.active {
          background-color: #00a4ff;
          color: #ffffff;
        }
      }
    }
  }
  .room-des {
    padding: 20px 15px 18px 15px;
    background-color: #fff;
    .title {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      h3 {
        color: #3d3e3f;
        font-size: 18px;
        font-weight: 700;
        vertical-align: center;
        img {
          width: 11px;
          margin-left: 4px;
        }
      }
      div {
        color: #666666;
        font-size: 12px;
        b {
          margin-left: 4px;
          color: #ff664f;
          font-size: 18px;
          font-weight: 700;
        }
      }
    }
    .description {
      margin-top: 10px;
      span {
        display: inline-block;
        padding: 3px 6px;
        color: #999999;
        font-size: 10px;
        background-color: #f1f9ff;
        margin-right: 4px;
        border-radius: 2px;
        margin-bottom: 5px;
        // &:first-child {
        //   background-color: #ff824b;
        //   color: #ffffff;
        // }
      }
      .sale1 {
        background-color: #3bd0a0;
        color: #ffffff;
      }
      .sale2 {
        background-color: #ff8353;
        color: #ffffff;
      }
      .sale3 {
        background-color: #c7cbd3;
        color: #ffffff;
      }
      .sale4 {
        background-color: #f6b638;
        color: #ffffff;
      }
    }
    .introduction {
      color: #333333;
      font-size: 13px;
      margin-top: 13px;
      font-weight: 700;
      span {
        color: #666666;
        margin-right: 15px;
        font-weight: normal;
      }
    }
    .address {
      font-size: 12px;
      color: #00a4ff;
      margin-top: 13px;
      line-height: 16px;
      span {
        color: #666666;
        margin-right: 2px;
      }
      i {
        font-size: 10px;
        margin-left: 4px;
        line-height: 14px;
      }
      em {
        font-style: normal;
      }
    }
    .loanCalculation {
      margin-top: 13px;
      width: 100%;
      height: 34px;
      background-color: #f1f9ff;
      line-height: 34px;
      text-align: center;
      font-size: 14px;
      color: #00a4ff;
    }
    .priceDisplay {
      .priceDisplayCont {
        background-color: #f1f9ff;
        margin-top: 14px;
        padding: 15px 13px 20px 22px;
        .title {
          color: #666666;
          font-size: 14px;
          position: relative;
          &:before {
            content: "";
            position: absolute;
            left: -7px;
            top: 0.5px;
            width: 2px;
            height: 13px;
            background-color: #00a4ff;
          }
        }
        .priceShow {
          display: flex;
          justify-content: space-between;
          div {
            text-align: center;
            margin-top: 16px;
            p {
              color: #333333;
              font-size: 16px;
              font-weight: 700;
              &:first-child {
                font-weight: normal;
                color: #666666;
                font-size: 14px;
                margin-bottom: 8px;
              }
            }
          }
        }
      }
      .priceDisplay_link {
        width: 100%;
        height: 34px;
        line-height: 34px;
        text-align: center;
        background-color: #f1f9ff;
        margin-top: 5px;
        font-size: 14px;
        color: #00a4ff;
      }
    }
  }
  .unitReviews {
    background-color: #fff;
    margin: 10px 0;
    .unitReviewsCont {
      padding: 20px 17px 15px 22px;
      h3 {
        color: #333333;
        font-size: 16px;
        font-weight: 700;
        position: relative;
        margin-bottom: 25px;
        &:before {
          content: "";
          position: absolute;
          left: -6px;
          top: 2px;
          width: 2px;
          height: 13px;
          background-color: #00a4ff;
        }
      }
      dl {
        font-size: 14px;
        padding-left: 14px;
        dt {
          color: #333333;
          font-weight: 700;
          margin-bottom: 6px;
          position: relative;
          &:after {
            content: "";
            position: absolute;
            left: -16px;
            top: 2px;
            width: 7px;
            height: 7px;
            border-radius: 7px;
            border: 2px solid #fa784a;
            background-color: #fff;
          }
        }
        dd {
          color: #666666;
          line-height: 20px;
          margin-bottom: 14px;
        }
      }
    }
  }
  .recommendType {
    background-color: #fff;
    .unitReviewsCont {
      padding: 20px 0px 0px 14px;
      h3 {
        margin-left: 6px;
        color: #333333;
        font-size: 16px;
        font-weight: 700;
        position: relative;
        &:before {
          content: "";
          position: absolute;
          left: -6px;
          top: 2px;
          width: 2px;
          height: 13px;
          background-color: #00a4ff;
        }
      }
      .typeListCont {
        margin-top: 15px;
        > li:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }
        > li {
          padding-bottom: 15px;
          margin-bottom: 15px;
          border-bottom: 1px solid #efefef;
          a {
            display: flex;
            flex-direction: row;
            .left {
              position: relative;
              .title {
                font-size: 10px;
                text-align: center;
                width: 100%;
                height: 23px;
                line-height: 23px;
                position: absolute;
                left: 0;
                bottom: 0;
                z-index: 1;
                background: rgba(0, 0, 0, 0.3);
                color: #ffffff;
              }
            }
            .right {
              margin-left: 10px;
              h3 {
                font-size: 16px;
                font-weight: 700;
                color: #333333;
                img {
                  width: 11px;
                  margin-left: 5px;
                }
              }
              p {
                margin-top: 10px;
                margin-bottom: 12px;
                font-size: 12px;
                color: #666666;
                span {
                  margin-right: 15px;
                }
              }
              .price {
                font-size: 12px;
                color: #666666;
                span {
                  font-size: 16px;
                  color: #ff664f;
                  margin-left: 6px;
                }
              }
              .lable {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                margin-top: 12px;
                // b:first-child {
                //   background: rgba(255, 130, 75, 1);
                //   margin-left: 0;
                //   color: #ffffff;
                // }
                b {
                  background: rgba(241, 249, 255, 1);
                  border-radius: 4px;
                  padding: 3px 6px 3px;
                  font-size: 10px;
                  color: #999999;
                  margin-left: 3px;
                  margin-bottom: 9px;
                }
                .sale1 {
                  background-color: #3bd0a0;
                  color: #ffffff;
                }
                .sale2 {
                  background-color: #ff8353;
                  color: #ffffff;
                }
                .sale3 {
                  background-color: #c7cbd3;
                  color: #ffffff;
                }
                .sale4 {
                  background-color: #f6b638;
                  color: #ffffff;
                }
              }
            }
          }
        }
      }
    }
  }
}
.page-bottom {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 48px;
  z-index: 999;
  a {
    display: block;
    width: 345px;
    margin: 5px auto 0;
    height: 38px;
    background: rgba(0, 164, 255, 1);
    box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.06);
    border-radius: 4px;
    text-align: center;
    line-height: 38px;
    font-size: 14px;
    color: #ffffff;
    text-shadow: 0px 0px 16px rgba(0, 0, 0, 0.06);
  }
}
.previewTitle {
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 22px;
  z-index: 3000;
  ::v-deep .van-tab__text {
    color: #333333;
    font-size: 12px;
  }
  ::v-deep .van-tabs__wrap--scrollable .van-tab {
    flex-basis: auto !important;
    padding: 0 15px;
  }
  ::v-deep .van-tabs__wrap {
    height: 28px;
  }
  ::v-deep .van-tab {
    padding: 0 15px;
    flex: none !important;
    background-color: #fff;
    margin-right: 10px;
    height: 28px;
    line-height: 28px;
    border-radius: 13px;
    min-width: 60px;
    &:first-child {
      margin-left: 10px;
    }
    &.van-tab--active {
      background-color: #00a4ff;
      .van-tab__text {
        color: #ffffff;
      }
    }
  }
}
</style>

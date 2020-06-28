<template>
  <div class="typeList">
    <van-tabs
      v-model="active"
      @click="tabClick"
      :ellipsis="false"
      animated
      color="#00A4FF"
      sticky
      title-active-color="#00A4FF"
      :border="false"
      line-width="17px"
      line-height="2px"
      title-inactive-color="#999999"
    >
      <van-tab
        v-for="(item,index) in tabData"
        :title="bedRoomFlag(item.bedroom) +'('+ item.count+')'"
        :key="index"
        :name="item.bedroom"
      >
        <ul class="typeListCont">
          <li v-for="item in houseList" :key="item.id">
            <router-link
              :to="{name:'houseTypeDetails', params:{buildingId:$route.params.buildingId,houseTypeId:item.id}} "
            >
              <div class="left">
                <van-image class="typeListImg" :src="item.annexPath" />
                <div class="title">{{item.houseTypeName}}</div>
              </div>
              <div class="right">
                <h3>
                  {{item.houseType}}
                  <img
                    src="../../assets/img/icon_fire@2x.png"
                    v-if="item.isHot==1"
                  />
                </h3>
                <p>
                  <span v-if="item.constructionArea">建面约{{item.constructionArea}}㎡</span>
                  <span v-else>建面待定</span>
                  <span v-if="item.oriented">朝向{{item.oriented | orientedFlag}}</span>
                  <span v-else>朝向待定</span>
                </p>
                <div class="price">
                  总价约
                  <span>{{item.totalPrice}}万元</span>
                </div>
                <div class="lable">
                  <b :class="'sale'+item.salesStatus">{{item.salesStatus | salesStatusFlag}}</b>
                  <b v-for="(item,index) of houseTag" :key="index">{{item}}</b>
                </div>
              </div>
            </router-link>
          </li>
        </ul>
      </van-tab>
    </van-tabs>
    <div class="page-bottom">
      <consultation-foot
        @changeCollection="changeCollection"
        @consultBtn="consultBtn"
        :isCollection="isCollection"
        @consultConfirm="consultConfirm"
      ></consultation-foot>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Tab, Tabs, Image, Toast } from "vant";
Vue.use(Tab)
  .use(Tabs)
  .use(Image)
  .use(Toast);
import { getDetail } from "@/apiOptions/home_api.js";
import consultationFoot from "../../components/consultationFoot/index.vue";
export default {
  components: {
    consultationFoot
  },
  data() {
    return {
      active: 0,
      tabData: [],
      houseList: [],
      houseListNum: 0,
      houseTag: [],
      bedroom: 0,
      page: 1,
      rows: 10,

      // phoneNum: "",
      token: "",
      isCollection: false,
      tel: "", //底部中间点击获取管家电话
      tel400: "" //获取到的400
    };
  },
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
    }
  },
  methods: {
    // 点击tab事件
    tabClick(name, title) {
      console.log(name);
      console.log(title);
      this.bedroom = name;
      this.getHouseList();
    },
    getHouseList() {
      console.log("请求参数");
      console.log(this.$route.params.buildingId);
      console.log(this.bedroom);
      getDetail("/api/building/buildingHouseType/list", {
        buildingId: this.$route.params.buildingId,
        bedroom: this.bedroom,
        page: this.page,
        rows: this.rows
      })
        .then(res => {
          console.log("aa");
          console.log(res);
          this.houseList = res.list;
          this.houseListNum = this.houseList.length;
          if (this.houseList.houseTypeTag) {
            this.houseTag = this.houseList.houseTypeTag.split(",");
          }
        })
        .catch(err => {
          console.log("请求结果报错", err);
        });
    },

    bedRoomFlag(value) {
      let set = {
        0: "全部",
        1: "一室",
        2: "二室",
        3: "三室",
        4: "四室",
        5: "五室",
        6: "六室",
        7: "七室",
        8: "八室",
        9: "九室",
        10: "十室"
      };
      return set.hasOwnProperty(value) ? set[value] : value;
    },
    // 收藏
    changeCollection() {
      this.checkLoginCollect();
      // if (this.token) {
      //   let phone = this.$tool.getStorage("phoneNum");
      //   let celPhone;
      //   if (this.$tool.getStorage(phone)) {
      //     celPhone = JSON.parse(this.$tool.getStorage(phone));
      //   } else {
      //     celPhone = {};
      //   }
      //   let buildingId = this.$route.params.buildingId.toString();
      //   let obj = {};
      //   if (celPhone.hasOwnProperty(buildingId)) {
      //     delete celPhone[buildingId];
      //     obj[phone] = JSON.stringify(celPhone);
      //     this.$tool.setStorage(obj);
      //     this.isCollection = false;
      //     this.$toast("你已取消收藏");
      //   } else {
      //     // celPhone[buildingId] = {};
      //     celPhone = {
      //       [buildingId]: {}
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
      //       topath: "houseTypeList" + "/" + this.$route.params.buildingId
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
            let obj = {};
            if (celPhone.hasOwnProperty(buildingId)) {
              delete celPhone[buildingId];
              obj[phone] = JSON.stringify(celPhone);
              this.$tool.setStorage(obj);
              this.isCollection = false;
              this.$toast("你已取消收藏");
            } else {
              // celPhone[buildingId] = {};
              celPhone = {
                [buildingId]: {}
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
                topath: "houseTypeList" + "/" + this.$route.params.buildingId
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
          this.tel = res.list[0].phone;
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
            this.tel400 = res.mobile;
            window.location.href = "tel:" + this.tel400;
          })
          .catch(err => {
            console.log("请求结果报错", err);
          });
      }
    },
    //我要咨询btn
    consultConfirm(val) {
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
          this.$toast("稍后管家会跟您联系，请耐心等待");
        })
        .catch(err => {
          console.log("请求结果报错", err);
        });
    },
    getCount() {
      getDetail("/api/building/buildingHouseType/count", {
        buildingId: this.$route.params.buildingId
      })
        .then(res => {
          this.tabData = res.result;
          this.bedroom = 0;
          this.getHouseList();
        })
        .catch(err => {
          console.log("请求结果报错", err);
        });
    }
  },
  computed: {},
  watch: {},
  mounted() {},
  created() {
    this.token = this.$tool.getToken();
    if (this.$tool.getStorage("phoneNum")) {
      let phone = this.$tool.getStorage("phoneNum");
      if (this.$tool.getStorage(phone)) {
        let celPhone = JSON.parse(this.$tool.getStorage(phone));
        let buildingId = this.$route.params.buildingId;
        if (celPhone.hasOwnProperty(buildingId)) {
          this.isCollection = true;
        }
      }
    }

    this.getCount();
  }
};
</script>
<style lang="scss" scoped>
.typeListImg {
  width: 125px;
  height: 103px;
}
.typeList {
  ::v-deep .van-sticky {
    background-color: #fff;
    max-width: 750px; /*no*/
    margin: 0 auto;
  }
  ::v-deep .van-tabs__wrap {
    padding: 0 5px;
  }
  ::v-deep .van-tab__text {
    font-size: 15px;
  }
  ::v-deep .van-tabs__wrap--scrollable .van-tab {
    flex-basis: auto !important;
    padding: 0 12px;
  }
  ::v-deep .van-tab {
    padding: 0 12px;
    flex: none !important;
  }
  .typeListCont {
    margin-top: 27px;
    padding-bottom: 48px;
    > li:last-child {
      border-bottom: none;
    }
    > li {
      margin-left: 14px;
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
            font-weight: bold;
            color: #333333;
            margin-top: 4px;
            img {
              width: 11px;
              margin-left: 2px;
            }
          }
          p {
            margin-top: 8px;
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
              font-weight: bold;
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
}
</style>

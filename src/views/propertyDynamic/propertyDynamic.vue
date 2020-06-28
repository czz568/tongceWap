<template>
  <div class="app" :class="dynamicList.length === 0 ? 'app1' : '' ">
    <!-- <Scroll class="appScroll"> -->
    <div class="mian" v-if="len">
      <div class="timeline-item" v-for="(item, index) in dynamicList" :key="index">
        <div class="time">
          <i class="georama"></i>
          {{item.createTime}}
        </div>
        <div class="timetitle">{{item.title}}</div>
        <div class="content">
          <!-- {{ item.flag ? item.newContent : item.content }} -->
          <div v-html="item.flag ? item.newContent : item.content"></div>
          <div class="all" @click="showAll(index)">{{item.show}}</div>
        </div>
      </div>
    </div>
    <div class="resultNull" v-else>
      <img src="../../assets/img/icon_sorry.png" alt />
      <p>暂无数据</p>
    </div>
    <!-- </Scroll> -->
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
import Scroll from "../../components/scroll/scroll";
import { getDetail } from "@/apiOptions/home_api.js";
import consultationFoot from "../../components/consultationFoot/index.vue";
export default {
  components: {
    Scroll,
    consultationFoot
  },
  data() {
    return {
      dynamicList: [],
      token: "",
      isCollection: false,
      tel: "", //底部中间点击获取管家电话
      tel400: "", //获取到的400,
      app1:'app1', 
      workNo:'',
      len:0
    };
  },
  computed: {},
  watch: {},
  methods: {
    showAll(index) {
      if (this.dynamicList[index].show === "全文") {
        this.dynamicList[index].show = "收起";
        this.dynamicList[index].flag = false;
      } else {
        this.dynamicList[index].show = "全文";
        this.dynamicList[index].flag = true;
      }
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
      //     }
      //     obj[phone] = JSON.stringify(celPhone);
      //     this.$tool.setStorage(obj);
      //     this.isCollection = true;
      //     this.$toast("收藏成功，请在APP内查看。");
      //   }
      //   this.$store.dispatch('saveIsLoading',false)
      // } else {
      //   this.$router.push({
      //     path: "/login",
      //     query: {
      //       topath: "propertyDynamic" + "/" + this.$route.params.buildingId
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
      //  this.$tool.openLoading()  
      getDetail("/api/tospurWeb/v1/capp/rongcloud/new/getHousekeeperList", {
        buildingId: this.$route.params.buildingId,
        type: 1
      })
        .then(res => {
          // this.$tool.closeLoading()  
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
          source:4,
          "X-token": this.$tool.getStorage("M-token")
        })
          .then(res => {
            console.log("tel");
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
          source:4
        })
          .then(res => {
            console.log('我是没登录')
            console.log(res)
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
        //     topath: "propertyDynamic" + "/" + this.$route.params.buildingId
        //   }
        // });
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
          
          console.log("我要咨询接口");
          console.log(res);
          this.$toast("稍后管家会跟您联系，请耐心等待");
        })
        .catch(err => {
          console.log("请求结果报错", err);
        });
    }
  },
  created() {    
    this.token = this.$tool.getStorage("M-token");
    console.log(this.$tool.getStorage("phoneNum"));
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

    
    this.$tool.openLoading()
    getDetail("/api/building/pc/buildingDynamic/buildingDynamicAndDate", {
      buildingId: this.$route.params.buildingId
    })
      .then(res => {     
        // this.$store.dispatch('saveIsLoading',false)   
        this.$tool.closeLoading()
        console.log("楼盘动态");
        console.log(res.dynamicBaseInfoList);
        let dynamicList = res.dynamicBaseInfoList;  

    
        for (let i = 0; i < dynamicList.length; i++) {
          if (dynamicList[i].content.length > 55) {
            dynamicList[i].show = "全文";
            dynamicList[i].flag = true;
            dynamicList[i].newContent =
              dynamicList[i].content.substr(0, 64) + "...";
          }
        }
        dynamicList.forEach(item=>{ 
          item.createTime = item.createTime.substring(0,item.createTime.length-3)        
          item.content = item.content.replace(/(\r\n)|(\n)/g,'<br/>');    
        })

        this.dynamicList = dynamicList;
        this.len = dynamicList.length;
      })
      .catch(err => {
        console.log("请求结果报错", err);
      });
  },
  mounted() {}
};
</script>
<style lang='scss' scoped>
.app {
  position: relative;
  &:before {
    content: "";
    position: absolute;
    display: block;
    width: 2px;
    background: #ececec;
    top: 20px;
    left: 24px;
    height: 100%;
  }
  // width: 100%;
  // position: fixed;
  // top: 0;
  // bottom: 0px;
  // box-sizing: border-box;
  // z-index: 1;
}
.app1::before {
  display: none;
}
.appScroll {
  position: fixed;
  top: 44px;
  bottom: 44px;
  width: 100%;
  overflow: hidden;
  z-index: 2;
  &:before {
    content: "";
    position: absolute;
    display: block;
    width: 2px;
    background: #ececec;
    top: 20px;
    left: 24px;
    height: 100%;
  }
}
.mian {
  padding-bottom: 38px;
}
.timeline-item {
  padding: 16px 20px 10px 20px;
  .time {
    position: relative;
    color: #999999;
    font-size: 11px;
    padding-left: 18px;
    padding-top: 4px;
    .georama {
      position: absolute;
      top: 5px;
      left: 0px;
      box-sizing: border-box;
      width: 9px;
      height: 9px;
      background-color: #d8d8d8;
      border-radius: 9px;
      z-index: 700;
    }
  }
  .timetitle {
    padding: 8px 0px 0px 18px;
    font-size: 15px;
    color: #333333;
    font-weight: 700;
    line-height: 23px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .content {
    padding: 2px 0px 0px 18px;
    font-size: 13px;
    line-height: 22px;
    word-break: break-word;
    color: #666666;
  }
  .all {
    color: #00a4ff;
    font-size: 13px;
    background: #fff;
    width: 34px;
  }
}
.resultNull {
  width: 167px;
  margin: 100px auto 0;
  text-align: center;
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
  p {
    margin-top: 10px;
    color: #888888;
    font-size: 14px;
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
</style>

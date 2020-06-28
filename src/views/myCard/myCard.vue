<template>
  <div class="cardAll">
    <div class="cardContainer">
      <div class="cardBox" v-for="item in cardList" :key="item.couponDetailId">
        <div class="cardTop">
          <div class="topBox">
            <p class="p1">{{item.couponName}}</p>
            <p
              class="p2"
            >有效期：{{item.termOfValidityStart | timeFilter}} - {{item.termOfValidityEnd | timeFilter}}</p>
            <p class="p3">编号：{{item.couponCode}}</p>
            <i
              class="iconfont cardImg"
              :class="'use'+item.couponStatus"
              v-html="tuFlag(item.couponStatus)"
            ></i>
          </div>
        </div>
        <div class="cardBottom">
          <div
            v-if="item.couponType == 'ZSQ' ? false : true"
            class="cardBtn"
            :class="'use'+item.couponStatus"
            @click="btnClick(item.couponStatus)"
          >{{item.couponStatus|cardFlag}}</div>
          <van-collapse v-model="activeNames" :border="false">
            <van-collapse-item title="使用规则" :name="item.couponDetailId">
              <p class="text" v-html="item.couponDetail"></p>
            </van-collapse-item>
          </van-collapse>
        </div>
      </div>
      <van-empty v-if="emptyFlag" description="您暂时没有卡券" />
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Collapse, CollapseItem, Dialog, Empty } from "vant";
Vue.use(Collapse)
  .use(CollapseItem)
  .use(Dialog)
  .use(Empty);
import { getDetail } from "@/apiOptions/home_api.js";
export default {
  data() {
    return {
      activeNames: [],
      cardList: [],
      emptyFlag: false,
      downApp:
        "https://tcstag.tospur.com/download/client/tchf_download_app.html?hmsr=&hmpl="
    };
  },
  filters: {
    cardFlag(value) {
      let set = {
        1: "申请兑换",
        2: "发放中",
        3: "查看券码",
        4: "无法使用",
        5: "未开始"
      };
      return set.hasOwnProperty(value) ? set[value] : value;
    },
    timeFilter(value) {
      return (value = value.substring(0, value.length - 3));
    }
  },
  methods: {
    tuFlag(value) {
      console.log(value);
      let set = {
        1: "&#xe65a;",
        2: "&#xe65c;",
        3: "&#xe65c;",
        4: "&#xe661;",
        5: "&#xe663;"
      };
      return set.hasOwnProperty(value) ? set[value] : value;
    },
    btnClick(val) {
      console.log(val);
      let that = this
      if (val == 1) {
        console.log("aaa");
        Dialog.confirm({
          message: "优惠券需在APP内兑换",
          confirmButtonText: "下载APP",
          confirmButtonColor: "#00A4FF"
        })
          .then(() => {
            console.log("1111");
            // window.location.href = this.downApp;
            that.$tool.downloadIfWeixin()
          })
          .catch(() => {});
      } else if (val == 2) {
        Dialog.confirm({
          message: "优惠券发放中请耐心等待",
          confirmButtonText: "下载APP",
          confirmButtonColor: "#00A4FF"
        })
          .then(() => {
            // window.location.href = this.downApp;
            that.$tool.downloadIfWeixin()
          })
          .catch(() => {});
      } else if (val == 3) {
        Dialog.confirm({
          message: "查看券码需下载App",
          confirmButtonText: "下载APP",
          confirmButtonColor: "#00A4FF"
        })
          .then(() => {
            // window.location.href = this.downApp;
            that.$tool.downloadIfWeixin()
          })
          .catch(() => {});
      }else if (val == 5) {
        Dialog.confirm({
          message: "活动未开始请耐心等待",
          confirmButtonText: "下载APP",
          confirmButtonColor: "#00A4FF"
        })
          .then(() => {
            window.location.href = this.downApp;
          })
          .catch(() => {});
      }
    },
    getMyCard() {
      // getDetail("/api/base/act/api/customer/list", {
      getDetail("/api/base/v1/api/coupon/getPage", {
        // "X-Token": this.$tool.getStorage("M-token")
      })
        .then(res => {
          console.log("我是优惠券列表");
          console.log(res);
          this.cardList = res.list;
          this.cardList.forEach(item => {
            item.couponDetail = item.couponDetail.replace(
              /(\r\n)|(\n)/g,
              "<br/>"
            );
          });

          if (this.cardList.length === 0) {
            this.emptyFlag = true;
          }
        })
        .catch(err => {
          console.log("请求结果报错", err);
        });
    }
  },
  created() {
    this.getMyCard();
  }
};
</script>
<style lang="scss" scoped>
.cardAll {
  height: 100%;
  background-color: #f8f8f8;
}
.cardContainer {
  background-color: #f8f8f8;
  min-height: 100%;
  padding: 15px;
  .cardBox {
    margin-top: 10px;
    background-color: #fff;
    border-radius: 6px;
    .cardTop {
      padding: 16px 20px 0;
      position: relative;
      &::before {
        content: " ";
        position: absolute;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: #f8f8f8;
        left: -7px;
        bottom: -7px;
      }
      &::after {
        content: " ";
        position: absolute;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: #f8f8f8;
        right: -7px;
        bottom: -7px;
      }
      .topBox {
        position: relative;
        padding-bottom: 20px;
        &::after {
          content: "";
          border-bottom: 1px #ececec dashed;
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
        }
        .p1 {
          font-size: 14px;
          color: #333;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-weight: bold;
          padding-top: 2px;
        }
        .p2 {
          font-size: 11px;
          color: #333;
          margin-top: 15px;
        }
        .p3 {
          font-size: 11px;
          color: #999;
          margin-top: 8px;
        }
        .cardImg {
          // width: 52px;
          // height: 45px;
          font-size: 50px;
          position: absolute;
          bottom: 13px;
          right: 0;
        }
        .use1 {
          color: #00a4ff;
        }
        .use2 {
          color: #ff8353;
        }
        .use3 {
          color: #ff4700;
        }
        .use4 {
          color: #cccccc;
        }
        .use5 {
          color: #00C24F;
        }
      }
    }
    .cardBottom {
      position: relative;
      padding: 13px 20px;
      .cardBtn {
        width: 66px;
        height: 21px;
        background-color: #00a4ff;
        line-height: 21px;
        text-align: center;
        color: #fff;
        font-size: 11px;
        border-radius: 10px;
        position: absolute;
        top: 13px;
        right: 20px;
        z-index: 999;
      }
      .use1 {
        background-color: #00a4ff;
      }
      .use2 {
        background-color: #ff8353;
      }
      .use3 {
        background-color: #ff4700;
      }
      .use4 {
        background-color: #cccccc;
      }
      .use5 {
        background-color: #00C24F;
      }

      /deep/.van-cell {
        width: 66px; /*no*/
        font-size: 11px;
        color: #00a4ff;
        padding: 0;
        box-sizing: border-box;
      }
      /deep/.van-cell:not(:last-child)::after {
        border: none;
      }
      /deep/.van-icon-arrow::before {
        color: #00a4ff;
      }
      /deep/.van-cell__right-icon {
        margin-left: 2px;
        font-size: 10px;
      }
      /deep/.van-collapse-item__content {
        padding: 10px 0 10px;
      }
      p.text {
        font-size: 12px;
        color: #666;
        line-height: 2;
        margin-top: 12px;
      }
    }
  }
}
</style>

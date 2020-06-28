<template>
  <div class="majordomo">
    <div class="main-mode">
      <div class="item" v-for="(item,index) in majordomoList" :key="index">
        <div class="major-mode">
          <img :src="item.avatarUrl ? item.avatarUrl :imgText" class="user-icon" />
          <div class="major-session">
            <div class="major-msg">
              <span class="user-name">{{item.userName}}</span>
              <span class="evaluate">满意度{{item.satisfaction}}</span>
            </div>
            <div class="major-sub-title">
              <span v-for="(val,index) in item.expertiseFieldList" :key="index">{{val.paraValue}}</span>
            </div>
          </div>
        </div>
        <a @click="telMaj(item)">
          <img src="../../assets/img/live_phone_blue@2x.png" class="live-phone-icon" />
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import Footer from "../../components/foot/foot.vue";
import { getDetail } from "@/apiOptions/home_api.js";
export default {
  components: {
    Footer
  },
  data() {
    return {
      imgText: require("@/assets/img/mine.png"),
      majordomoList: [],
      token: ""
    };
  },
  methods: {
    //获取管家手机号对应的400
    telMaj(val) {
      console.log(val)
      if (this.token) {
        getDetail("/api/tospurWeb/api/capp/v1/user/getUserPhone", {
          phone: val.phone,
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
          phone: val.phone,
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
        // console.log(val.workNo)
        // window.location.href = `tel:02133194608,${val.workNo}#`;
        // this.$router.push({
        //   path: "/login",
        //   query: {
        //     topath: "majordomoList"+'/'+this.$route.params.buildingId,
        //   }
        // });
      }
    }
  },
  created() {
    this.token = this.$tool.getStorage("M-token");
    getDetail("/api/tospurWeb/v1/capp/rongcloud/new/getHousekeeperList", {
      buildingId: this.$route.params.buildingId,
      type: 1
    })
      .then(res => {
        console.log("我是优秀管家");
        console.log(res);
        this.majordomoList = res.list;
      })
      .catch(err => {
        console.log("请求结果报错", err);
      });
  }
};
</script>

<style lang="scss" scoped>
.majordomo {
  .main-mode {
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 20px 15px;
      border-bottom: 1px solid rgba(237, 237, 237, 0.8);
      .major-mode {
        display: flex;
        align-items: center;
        .user-icon {
          width: 60px;
          height: 60px;
          border-radius: 100%;
        }
        .major-session {
          margin-left: 11px;
          .user-name {
            font-size: 16px;
            color: #333;
            font-weight: 500;
            display: inline-block;
            vertical-align: middle;
          }
          .evaluate {
            display: inline-block;
            font-size: 8px;
            color: #666;
            padding: 2px 6px;
            background: rgba(241, 249, 255, 1);
            border-radius: 9px;
            margin-left: 5px;
            vertical-align: middle;
          }
          .major-sub-title {
            margin-top: 9px;
            span {
              font-size: 12px;
              color: #999;
              margin-right: 20px;
            }
          }
        }
      }
      .live-phone-icon {
        width: 25px;
        height: 25px;
      }
    }
    .item:last-child {
      border-bottom: none;
    }
  }
}
</style>
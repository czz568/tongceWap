<template>
  <div class="infoDetail">
    <div class="detail">
      <h2>{{infoDetail.articleTitle}}</h2>
      <div class="avatar">
        <img src="@/assets/img/mine.png" class="avatarImg" />
        <span class="Nickname">{{infoDetail.authorName}}</span>
        <span class="dataTime">{{infoDetail.firstPushTime}}</span>
      </div>

      <div class="artCon" v-html="infoDetail.articleContent" ref="artConRef"></div>
      <van-loading size="50px" type="spinner" vertical v-if="loadFlag"></van-loading>

      <house-rec :hotList="hotList"></house-rec>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import HouseRec from "./houseRec.vue";
import { getDetail } from "@/apiOptions/home_api.js";
import { mapState } from "vuex";

import { Loading } from "vant";
Vue.use(Loading);
export default {
  components: {
    HouseRec
  },
  data() {
    return {
      infoDetail: {},
      hotList: [],
      loadFlag: true
    };
  },

  methods: {
    getinfoDetail() {
      getDetail("/api/search/v1/article/business/details", {
        id: this.$route.query.id
      })
        .then(res => {
          console.log(res);
          this.infoDetail = res;
          this.loadFlag = false;
          this.getHot();
        })
        .catch(err => {
          console.log("请求结果报错", err);
        });
    },
    getHot() {
      getDetail("/api/search/v1/article/business/popular/building", {
        cityCode: this.cityCode,
        source: 5 //5:热门楼盘   6:本地热盘
      })
        .then(res => {
          console.log("hot");
          this.hotList = res.result;
          console.log(this.hotList);
        })
        .catch(err => {
          console.log("请求结果报错", err);
        });
    }
  },
  computed: {
    //获取vuex中的cityCode
    ...mapState({
      cityCode: state => state.city.code
    })
  },
  watch: {},
  mounted() {
    
  },
  created() {
    console.log(this.$route.query.id);
    this.getinfoDetail();
    

    // this.$refs.artConRef.$nextTick(function() {
    //   console.log('当前dom渲染完成')
      
    // });
  }
};
</script>
<style lang="scss" scoped>
/deep/.van-loading{
  padding:20px 0;
}
.infoDetail {
  background-color: #fff;
  padding: 20px;
  .detail {
    h2 {
      font-size: 16px;
      color: #333;
      font-weight: bold;
      line-height: 1.5;
    }
    .avatar {
      margin-top: 22px;
      display: flex;
      flex-direction: row;
      .avatarImg {
        width: 40px;
        height: 40px;
      }
      .Nickname {
        font-size: 14px;
        color: #333;
        line-height: 40px;
        margin-left: 10px;
      }
      .dataTime {
        font-size: 14px;
        color: #333;
        text-align: right;
        flex: 1;
        line-height: 40px;
      }
    }
    .detailCon {
      font-size: 14px;
      color: #333;
      line-height: 21px;
      margin: 20px 0;
    }
  }
}
/deep/.artCon {
  p {
    margin-top: 20px !important;
  }
  img {
    max-width: 100%;
  }
}
</style>

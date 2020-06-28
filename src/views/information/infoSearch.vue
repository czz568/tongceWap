<template>
  <div class="infoSearch">
    <!-- <van-sticky :offset-top="44"> -->
    <SearchInput @seVal="seVal" @seClick="seClick" :autoFlag="autoFlag"></SearchInput>
    <!-- </van-sticky> -->

    <div class="vague">
      <div class="vaBox" v-if="flag">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="loadHot"
          :immediate-check="false"
          offset="10"
        >
          <van-cell v-for="item in infoListVal" :key="item.articleId">
            <p class="title clamp1" @click="goDetail(item.articleId)" v-html="pushHTML(keyWord,item.articleTitle)"></p>
          </van-cell>
          <div slot="loading">
            <loading />
          </div>
        </van-list>
      </div>
      <div class="infoAll" v-else>
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="loadList"
          :immediate-check="false"
          offset="10"
        >
          <van-cell v-for="(item,index) in infoListVal" :key="index">
              <div class="infoBox"  @click="goDetail(item.articleId)">
                <div class="left">
                  <p class="p1 clamp2">{{item.articleTitle}}</p>
                  <p class="p2 clamp2">{{item.articleAbstract}}</p>
                  <p class="p3">
                    <span>{{item.authorName}}</span>
                    <span>{{item.firstPushTime}}</span>
                  </p>
                </div>
                <div class="right">
                  <img :src="item.articleImage" class="infoTu" />
                  <span>
                    <i class="iconfont">&#xe659;</i>
                    {{item.readNumber}}
                  </span>
                </div>
              </div>
          </van-cell>
          <div slot="loading">
            <loading />
          </div>
        </van-list>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import SearchInput from "./serchInput.vue";
import { mapState } from "vuex";
import { getDetail } from "@/apiOptions/home_api.js";
import { List, Toast } from "vant";
import loading from "@/components/loading";
Vue.use(List, Toast);

export default {
  components: {
    SearchInput,
    loading
  },
  data() {
    return {
      searchValue: "",
      infoListVal: [],
      page: 1,
      rows: 10,
      keyWord: "",

      flag: true,

      loading: false,
      finished: true,
      autoFlag: true,
      total: 0
    };
  },

  methods: {
    goDetail(val){
      window.location.href ="/ad/infoDetail.html?id="+val;
    },
    pushHTML(text, str) {
      let arr = str.split(text);
      let newText = arr.join('<span style="color:#00A4FF">' + text + "</span>");
      return newText;
    },
    seVal(msg) {
      this.infoListVal = [];
      this.keyWord = msg;
      this.flag = true;
      this.page = 1;
      this.getinfoList();
    },
    seClick(msg) {
      console.log("111");
      this.infoListVal = [];
      this.page = 1;
      this.flag = false;
      this.keyWord = msg;
      this.getinfoList();
      this.$toast(`为你找到${this.total}条相关记录`);
    },
    loadHot() {
      this.getinfoList();
    },
    loadList() {
      console.log("1");
      this.getinfoList();
    },
    getinfoList() {
      if (this.keyWord == "") {
        return false;
      } else {
        getDetail("/api/search/cpc/RelationController/search", {
          cityCode: this.cityCode,
          // searchType: 2, //搜索类型 1:百科,2:资讯
          pushPlatform: 2, //1 c-pc、2 c-m站 、3 c-app，4c-小程序，5b-app
          // typeId:2,  //searchType==1 三级分类id， searchType==2 一级分类id
          keyWord: this.keyWord, //搜索关键字
          page: this.page,
          rows: this.rows
        })
          .then(res => {
            this.loading = false;
            this.finished = false;
            console.log("我是搜索infoList");
            console.log(res);
            this.total = res.total;
            this.infoListVal = this.infoListVal.concat(res.list);
            this.page = parseInt(res.pageNum) + 1;
            if (this.page > res.pages) {
              this.finished = true;
            }
          })
          .catch(err => {
            console.log("请求结果报错", err);
          });
      }
    }
  },
  computed: {
    ...mapState({
      cityCode: state => state.city.code
    })
  }
};
</script>
<style lang="scss" scoped>
.clamp1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.vaBox {
  padding: 14px;
  .title {
    display: block;
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    border-bottom: 1px #dedede solid;
  }
}
.vaBox {
  /deep/.van-cell {
    padding: 0;
  }
  .van-cell:not(:last-child)::after {
    display: none;
  }
}
.clamp2 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.infoAll {
  padding: 9px 12px;
  .infoBox {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border-bottom: 1px #dedede solid;
    padding: 10px 0;
    .left {
      width: 64%;
      .p1 {
        font-size: 16px;
        color: #333;
        font-weight: bold;
        line-height: 22.5px;
      }
      .p2 {
        font-size: 14px;
        color: #666;
        line-height: 20px;
        margin-top: 5px;
      }
      .p3 {
        font-size: 12px;
        color: #999;
        line-height: 16.5px;
        display: flex;
        flex-direction: row;
        margin-top: 7px;
        span {
          margin-right: 15px;
        }
      }
    }
    .right {
      width: 32%;
      .infoTu {
        width: 113px;
        height: 85px;
        display: block;
        border-radius: 4px;
      }
      span {
        font-size: 12px;
        color: #999;
        margin-top: 11px;
        text-align: right;
        display: block;
        i {
          font-size: 9px;
          color: #c0c0c0;
          display: inline-block;
          margin-right: 2px;
        }
      }
    }
  }
  /deep/.van-hairline--top-bottom::after {
    border: none;
    // box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 1);
  }
  /deep/.van-tab {
    font-size: 15px;
    color: #999;
  }
  /deep/.van-tabs__line {
    background-color: #00a4ff;
  }
  /deep/.van-tab--active {
    color: #00a4ff;
  }
  /deep/.van-tabs__wrap {
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.05);
  }
  /deep/.van-cell:not(:last-child)::after {
    border: none;
  }
  /deep/.van-cell {
    padding: 0;
  }
}
</style>

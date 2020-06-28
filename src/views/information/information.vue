<template>
  <div class="info">
    <div @click="SearchInputClick">
      <SearchInput></SearchInput>
    </div>
    <div class="infoList">
      <van-tabs v-model="typeId" line-width="23" line-height="2" @change="oneTypeIdChange">
        <van-tab
          v-for="itemNav in typeIdList"
          :title="itemNav.value"
          :key="itemNav.id"
          :name="itemNav.id"
        >
          <div class="infoAll">
            <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="loadList">
              <van-cell v-for="(item,index) in infoListVal" :key="index">
                  <div class="infoBox" @click="goDetail(item.articleId)">
                    <div class="left">
                      <p class="p1 clamp2">{{item.articleTitle}}</p>
                      <p class="p2 clamp2">{{item.articleAbstract}}</p>
                      <p class="p3">
                        <span v-if="item.authorName">{{item.authorName}}</span>
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
              <div slot="loading" class="loadStyle">
                <loading />
              </div>
            </van-list>
          </div>
        </van-tab>
      </van-tabs>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Vue from "vue";
import { Tab, Tabs, List, Loading } from "vant";
Vue.use(Tab)
  .use(Tabs)
  .use(List)
  .use(Loading);
import { getDetail } from "@/apiOptions/home_api.js";
import SearchInput from "./serchInput.vue";
import Footer from "@/components/foot/foot.vue";

import { mapState } from "vuex";
import loading from "@/components/loading";

export default {
  components: {
    SearchInput,
    Footer,
    loading
  },
  data() {
    return {
      active: 0,
      infoListVal: [],
      infoResult: {},

      oneTypeId: [],

      loading: false,
      finished: true,
      autoFlag: true,
      total: 0,

      typeIdList: [
        { value: "楼盘动态", id: 15 },
        { value: "大V点评", id: 16 },
        { value: "楼盘导购", id: 17 },
        { value: "楼盘评测", id: 19 },
        { value: "买房知识", id: 18 }
      ],

      typeId: 15,
      searchType: 2,
      articleId:'',

      page: 1,
      rows: 5
    };
  },

  methods: {
    goDetail(val){
      window.location.href ="/ad/infoDetail.html?id="+val;
    },
    loadList() {
      this.getinfoList();
    },
    SearchInputClick() {
      this.$router.push({
        path: "/infoSearch"
      });
    },
    //获取列表数据
    getinfoList() {
      console.log('q请求')
      console.log(this.typeId)
      console.log(this.searchType)
      getDetail("/api/search/cpc/RelationController/search", {
        cityCode: this.cityCode,
        pushPlatform: 2, //1 c-pc、2 c-m站 、3 c-app，4c-小程序，5b-app
        searchType: this.searchType, //搜索类型 1:百科,2:资讯
        typeId: this.typeId==18?'':this.typeId,
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

          if(this.articleId){
            this.infoListVal.forEach((item,index)=>{
              if(item.articleId == this.articleId){
                this.infoListVal.splice(index,1)
                this.infoListVal.unshift(item)
              }
            })
          }


          this.page = parseInt(res.pageNum) + 1;
          if (this.page > res.pages) {
            this.finished = true;
          }
        })
        .catch(err => {
          console.log("请求结果报错", err);
        });
    },
    oneTypeIdChange(val) {
      console.log(val)
      if (val === 18) {
        this.searchType = 1;
      } else {
        this.searchType = 2;
      }
      this.typeId = val;
      this.page = 1;
      this.infoListVal = [];
      this.getinfoList();
    },
  },
  computed: {
    //获取vuex中的cityCode
    ...mapState({
      cityCode: state => state.city.code
    })
  },
  watch: {},
  mounted() {},
  created() {
    this.infoListVal = [];
    this.articleId=this.$route.query.id;
    this.typeId=parseInt(this.$route.query.oneTypeId);
    if(this.typeId == 18){
      this.searchType=1
    }else{
      this.searchType=2
    }
    this.getinfoList();
  }
};
</script>
<style lang="scss" scoped>
.clamp2 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
/deep/.van-tab__text{
  padding:2px 0
}
/deep/.van-loading {
  padding: 20px 0;
}
.info {
  background: #fff;
  .infoAll {
    padding: 9px 12px;
    .infoBox {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      border-bottom: 1px #dedede solid;
      padding: 10px 0 7px;
      .left {
        width: 64%;
        .p1 {
          font-size: 16px;
          color: #333;
          font-weight: bold;
          line-height: 23px;
        }
        .p2 {
          font-size: 14px;
          color: #666;
          line-height: 20px;
          margin-top: 7px;
        }
        .p3 {
          font-size: 12px;
          color: #999;
          line-height: 16.5px;
          display: flex;
          flex-direction: row;
          margin-top: 10px;
          
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
        }
        span {
          font-size: 12px;
          color: #999;
          margin-top: 11px;
          text-align: right;
          display: block;
          i{font-size:10px;color:#C0C0C0;}
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
.loadStyle{  
  padding:20px 0;
}
}
</style>

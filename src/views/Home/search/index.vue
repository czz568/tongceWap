<!-- 首页头部搜索框 -->
<template>
   <div class='search_warp_inno'>
      <search-header v-model="searchValue" @handleSearchBtn='handleSearchBtn'></search-header>
      <searchContent :searchValue='searchValue' ref="searchContent" :searchAssociationData='searchAssociationData' :isShowSearchData='isShowSearchData' :searchAssociation='searchAssociation'></searchContent>
      <!-- <consultation-foot :isCollection='isCollection' @changeCollection='changeC'></consultation-foot> -->
   </div>
</template>

<script>
import Vue from 'vue';
import { mapState } from 'vuex';
import { Search, Icon } from 'vant';
import searchHeader from '@/views/Home/search/searchHeader';
import searchContent from '@/views/Home/search/searchContent';
import {getDetail} from '@/apiOptions/home_api.js';
Vue.use(Search).use(Icon)


export default {
components: {
   searchHeader,
   searchContent,
},
data() {
return {
   searchValue:'',
   searchAssociationData:[],
   isShowSearchData:false,


   isCollection:false
};
},
props:{

},
computed: {
   ...mapState({
      citycode:state=>state.city.code
   })
},
watch: {
   searchValue:function(newVal,oldVal){
      console.log(newVal,oldVal)
      if(newVal){
         this.searchAssociation(newVal);
         this.isShowSearchData = true
      }else{
         this.searchAssociationData = []
         this.isShowSearchData = false
      }
      
   }
},
methods: {
   //获取模糊查询列表
   searchAssociation(keyword){
      let param = {
         cityCode:this.citycode,
         keyword
      }
      getDetail("/api/building/capp/building/searchAssociation",param).then(res=>{
         console.log("请求热搜",res)
         this.searchAssociationData = res.buildingList
      }).catch(err=>{
         console.log("请求结果报错",err)
      })
   },
   handleSearchBtn(){
      let searchValue = this.searchValue
      this.$refs.searchContent.handleClick(searchValue)
   },
   changeC(isCollection){
      console.log(isCollection)
      this.isCollection = isCollection
   }
},
created() {
   
},
mounted() {

},
beforeCreate() {}, //生命周期 - 创建之前
beforeMount() {}, //生命周期 - 挂载之前
beforeUpdate() {}, //生命周期 - 更新之前
updated() {}, //生命周期 - 更新之后
beforeDestroy() {}, //生命周期 - 销毁之前
destroyed() {}, //生命周期 - 销毁完成
activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang='scss' scoped>
   .search_warp_inno{
      background-color: #ffffff;
      .map{
         font-size: 16px;
         line-height: 44px;
         width: 90px;
         font-weight: 700;
         overflow: hidden;
         display: flex;
         .van-icon-location{
            padding-left: 10px;
            line-height: inherit;
         }
         .city_name{
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            display: inline-block;
         }
      }
      .search{
         height: 30px;
         flex: 1;
         padding: 7px 10px 7px 0;
         .van-search{
            width: 100%;
            padding: 0;
            height: 30px;
            border-radius: 16px;
            line-height: 14px;
            .van-cell{
               height: 30px;
               line-height: 21px;
            }
            .van-search__content{
               border-radius: 36px;
            }
            .van-field__left-icon{
               height: 30px;
               line-height: 1;
            }
            .van-field__left-icon{
               line-height: 20px;
            }
            .van-field__body{
               height: 10px;
               line-height: 10px;
               .van-field__control{
                  height: 20px;
                  line-height: 20px;
               }
            }
         }
      }
   }
</style>
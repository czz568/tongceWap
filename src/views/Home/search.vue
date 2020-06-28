<!-- 首页头部搜索框 -->
<template>
   <div class='search_warp'>
      <div class="map" @click="gotoChangeCity"><van-icon size="14" name="location"/><span class="city_name">{{cityTitle}}</span></div>
      <div class="search">
         <van-search @click="toSearch" v-model="value" @blur="changeSearch" placeholder="请输入楼盘或区域" :clearable='false' disabled/>
      </div>
   </div>
</template>

<script>
import Vue from 'vue';
import { mapState } from 'vuex'
import { Search, Icon } from 'vant';
Vue.use(Search).use(Icon)
export default {
components: {},
data() {
return {
   value:this.SearchValue
};
},
props:{

},
computed: {
   ...mapState({
      cityTitle:state=>state.city.title
   })
},
watch: {},
methods: {
   changeSearch(){
      this.$emit('input',this.value)
   },
   gotoChangeCity(){
      this.$router.push({
         path:'/cityPosition',
      })
   },
   toSearch(){
      this.$router.push({
         path:'/search'
      })
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
   .pc .search_warp{
      width: 13.9rem;
    margin: auto;
   }
   .search_warp{
      display: flex;
      justify-content: space-between;
      height: 44px;
      border-bottom: 1px solid rgba(0,0,0,0.1);
      background-color: #ffffff;
      max-width:750PX;/*no*/ 
      margin:0 auto;
      // position: relative;
      // &::after{
      //    content: '';
      //    width: 100%;
      //    height: 0;
      //    position: absolute;
      //    border: 1px solid;
      //    bottom: -2px;
      //    left: 0px;
      //    border-color:  rgba(0,0,0,0.1) transparent transparent;
      // }
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
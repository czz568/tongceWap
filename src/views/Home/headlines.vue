<!-- 首页头条轮播 -->
<template>
    <div class='headlines_warp' v-if="InformationList.length">
        <div class="headlines_warp_bg">
            <div class="headlines_title">
                <img class="headlines_img" :src="headlinesUrl" alt="">
                <img class="headlines_bg_img" :src="headlinesBg" alt="">
            </div>
            <van-swipe class="my-swipe" :autoplay="3000" style="width:83%; paddingLeft:20px" vertical indicator-color="white">
                <van-swipe-item v-for="(item,index) in InformationList" :key="index" @click='toInfoDetail(item)'>
                    {{item.articleTitle}}
                </van-swipe-item>
                <template #indicator>
                    <div class="custom-indicator">
                    </div>
                </template>
            </van-swipe>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import { mapState, mapGetters } from 'vuex'
import { getDetail } from '@/apiOptions/home_api.js';
import { Swipe, SwipeItem, Lazyload } from 'vant';
Vue.use(Swipe).use(SwipeItem).use(Lazyload)
export default {
components: {

},
data() {
return {
    headlinesUrl:require('@/assets/img/headlines@2x.png'),
    headlinesBg:require('@/assets/img/headlines_slash@2x.png'),
    InformationList:[]
};
},
props:{
   
},
computed: {
    //获取vuex中的cityCode
    ...mapState({
        citycode:state=>state.city.code
    }),
    ...mapGetters(['cityCode'])
},
watch: {
    cityCode(newValue,oldValue){
        if(newValue.code  === oldValue.code)return;
        this.getTopEncyclopdia()
    }
},
methods: {
    getTopEncyclopdia(){
        let params={
            cityCode:this.citycode
        }
        getDetail('/api/encyclopedia/v1/encyclopedia/queryTopInformation',params).then(res=>{
            console.log('首页文章咨询数据',res)
            this.InformationList = res
        }).catch(err=>{
            console.log('首页文章咨询报错',res)
        })
    },
    toInfoDetail(obj){
        this.$router.push({
            path:'/information',
            query:{
                id: obj.id,
                oneTypeId: obj.oneTypeId
            }
        })
    }
},
created() {
    this.getTopEncyclopdia();
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
.headlines_warp{
    padding: 0 10px;
    padding-top: 20px;
    background-color: #ffffff;
    .headlines_warp_bg{
        border-radius: 7px;
        overflow: hidden;
        display: flex;
        border: 1px solid #EBEBEB;
    }
    .headlines_title{
        width: 55px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        background:rgba(0,164,255,.03);
        position: relative;
        .headlines_img{
            width: 34px;
            height: 17px;
        }
        .headlines_bg_img{
            height: 100%;
            width: 15px;
            position: absolute;
            right: -15px;
        }
    }
    .my-swipe{
        height: 40px;
        .van-swipe-item{
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            line-height: 40PX;
            height: 40px;
            font-size: 14px;
            color: #333333;
            line-height: 40px;
        }
    }
    .custom-indicator {
        display: none;
    }
}
</style>
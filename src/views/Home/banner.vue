<!-- 首页banner搜索框 -->
<template>
    <div class='banner_warp'>
        <div class="banner">
            <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white" v-if="images.length">
                    <van-swipe-item v-for="item in images" :key="item.id" :height="120">
                        <!-- <img v-lazy="" @click="handleImage(item)" :alt="item.advertName" /> -->
                        <!-- <van-image width="100%" height="100%" lazy-load :src="item.advertImage?item.advertImage:noImage" @click="handleImage(item)" :alt="item.advertName" > </van-image> -->
                        <!-- <div class="bannerImg" style="background:url(item.advertImage?item.advertImage:noImage);background-size:cover" @click="handleImage(item)"></div> -->
                        <div @click="handleImage(item)"  class="bannerImg" :style="{backgroundImage: 'url(' + (item.advertImage?item.advertImage:noImage) + ')', backgroundSize:'cover', backgroundRepeat: 'no-repeat',backgroundPosition: 'center'}" > </div>
                    </van-swipe-item>
                <!-- <template #indicator>
                    <div class="custom-indicator">
                    </div>
                </template> -->
            </van-swipe>
            <div style="width:100%;height:100%" v-else>
                <img v-lazy="noImage" alt="暂无banner图"/>
            </div>
        </div>
        <div class="introduce">
            <p><span class="iconfont">&#xe60e;</span>21年行业经验</p>
            <p><span class="iconfont">&#xe615;</span>370万服务用户</p>
            <p><span class="iconfont">&#xe62f;</span>年签约金额超2千亿</p>
            <p><span class="iconfont">&#xe613;</span>真实一房一价</p>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import { mapState, mapGetters } from 'vuex'
import {getHomeBanner} from '@/apiOptions/home_api.js';
import { Swipe, SwipeItem, Lazyload, Image as VanImage} from 'vant';
Vue.use(VanImage)
export default {
components: {
    [Swipe.name]:Swipe,
    [SwipeItem.name]:SwipeItem,
    [Lazyload.name]:Lazyload
},
data() {
return {
    images: [],
    noImage:require('../../assets/img/pic_default_small@2x.png')
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
        this.init()
    }
},
methods: {
    init(){
        let params={
            cityCode:this.citycode,
            pertainProduct:'5',
            pertainAddress:'7'
        }
        getHomeBanner("/api/base/capp/appStart/banner/list",params).then(res=>{
            console.log('获取首页banner',res)
            this.images = res.result;
        }).catch(err=>{
            console.log(err)
        })
    },
    handleImage(obj){
        if(obj.advertType == 1){
            if(obj.linkAddress != ''){
                window.location.href = obj.linkAddress
            }else{
                return false;
            }
        }else if(obj.advertType == 2){
            console.log('跳转楼盘详情',obj)
            if(obj.buildingId){
                let agreement = window.location.protocol
                let domain = window.location.host;
                window.location.href = `${agreement}//${domain}/dynamicPages/mstation/${obj.buildingId}.html`
            }else{
                return false;
            }
        }else if(obj.advertType == 3){
            console.log('跳转文章详情',obj)
            if(obj.articleId){
                window.location.href = `/ad/infoDetail.html?id=${obj.articleId}`
            }else{
                return false;
            }
            
            // this.$router.push({
            //     path:'/infoDetail',
            //     query:{
            //         id: obj.articleId
            //     }
            // })
        }
    }
},
created() {
    this.init()
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
.banner_warp{
    padding: 10px 10px 0px 10px;
    background-color: #ffffff;
    .banner{
        border-radius: 7px;
        overflow: hidden;
        height: 120px;
        .bannerImg{
            width:100%;
            height: 120px;
            display: block;
        }
        .banner_img{
            width: 100%;
        }
        img{
            width: 100%;
            height: 100%;
        }
    }
    .introduce{
        display: flex;
        justify-content: space-between;
        font-size: 9px;
        padding: 9px 5px;
        line-height: 12px;
        .iconfont{
            vertical-align: middle;
            font-size: 12px;
            margin-right: 3px;
        }
    }
    .van-swipe{
        height: 100%;
    }
    .my-swipe .van-swipe-item {
        color: #fff;
        font-size: 20px;
        line-height: 120px;
        text-align: center;
        // background-color: #39a9ed;
    }
    .custom-indicator {
        display: none;
    }
}
</style>
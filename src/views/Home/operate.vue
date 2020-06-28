<!--  -->
<template>
    <div class="operate_warp" v-if="ConfigurationList.length">
        <!-- 一个 -->
        <div class="main_body" v-if="ConfigurationList.length == 1">
            <div class="img_warp_1 img_public">
                <van-image
                    width="100%"
                    height="100%"
                    lazy-load
                    fit='fill'
                    :src="ConfigurationList[0].pictureUrl"
                    alt=''
                    @click="handleClick(ConfigurationList[0])"
                />
            </div>
        </div>
        <!-- 两个 -->
        <div class="main_body" v-if="ConfigurationList.length == 2">
            <div class="img_warp_12 img_public img_mg_right_10">
                <van-image
                    width="100%"
                    height="100%"
                    lazy-load
                    fit='fill'
                    :src="ConfigurationList[0].pictureUrl"
                    alt=''
                    @click="handleClick(ConfigurationList[0])"
                />
            </div>
            <div class="img_warp_12 img_public img_mg_right_10 clear_mg_right">
                <van-image
                    width="100%"
                    height="100%"
                    lazy-load
                    fit='fill'
                    :src="ConfigurationList[1].pictureUrl"
                    alt=''
                    @click="handleClick(ConfigurationList[1])"
                />
            </div>
        </div>

        <!-- 三个 -->
        <div class="main_body" v-if="ConfigurationList.length == 3">
            <div class="img_warp_3 img_public img_mg_right_10">
                <van-image
                    width="100%"
                    height="100%"
                    lazy-load
                    fit='fill'
                    :src="ConfigurationList[0].pictureUrl"
                    alt=''
                    @click="handleClick(ConfigurationList[0])"
                />
            </div>
            <div class="img_warp_3 img_public img_mg_right_10 clear_mg_right">
                <div style="height: 100%;display: flex;flex-direction: column;">
                    <div class="img_3_right_warp img_mg_bottom_10">
                        <van-image
                            width="100%"
                            height="100%"
                            lazy-load
                            fit='fill'
                            :src="ConfigurationList[1].pictureUrl"
                            alt=''
                            @click="handleClick(ConfigurationList[1])"
                        />
                    </div>
                    <div class="img_3_right_warp">
                        <van-image
                            width="100%"
                            height="100%"
                            lazy-load
                            fit='fill'
                            :src="ConfigurationList[2].pictureUrl"
                            alt=''
                            @click="handleClick(ConfigurationList[2])"
                        />
                    </div>
                    
                </div>
            </div>
        </div>
        <!-- 四个 -->
        <div class="main_body" v-if="ConfigurationList.length == 4">
            <div class="img_warp_4 img_public img_mg_right_10" style="width:33%">
                <van-image
                    width="100%"
                    height="100%"
                    lazy-load
                    fit='fill'
                    :src="ConfigurationList[0].pictureUrl"
                    alt=''
                    @click="handleClick(ConfigurationList[0])"
                />
            </div>
            <div class="img_warp_4 img_warp_45_right img_public img_mg_right_10 clear_mg_right">
                <div class="img_mg_bottom_10 flex_1 img_3_right_warp">
                    <van-image
                        class="img_mg_bottom_10"
                        width="100%"
                        height="100%"
                        lazy-load
                        fit='fill'
                        :src="ConfigurationList[1].pictureUrl"
                        alt=''
                        @click="handleClick(ConfigurationList[1])"
                    />
                </div>
                <div class="img_line_Two" style="height:40%">
                    <van-image
                        class="img_public img_mg_right_10"
                        width="100%"
                        height="100%"
                        lazy-load
                        fit='fill'
                        :src="ConfigurationList[2].pictureUrl"
                        alt=''
                        @click="handleClick(ConfigurationList[2])"
                    />
                    <van-image
                        class="img_public"
                        width="100%"
                        height="100%"
                        lazy-load
                        fit='fill'
                        :src="ConfigurationList[3].pictureUrl"
                        alt=''
                        @click="handleClick(ConfigurationList[3])"
                    />
                </div>
            </div>
        </div>
        <!-- 五个 -->
        <div class="main_body" v-if="ConfigurationList.length == 5">
            <div class="img_warp_5 img_public img_mg_right_10">
                <van-image
                    width="100%"
                    height="100%"
                    lazy-load
                    fit='fill'
                    :src="ConfigurationList[0].pictureUrl"
                    alt=''
                    @click="handleClick(ConfigurationList[0])"
                />
            </div>
            <div class="img_warp_5 img_warp_45_right img_public img_mg_right_10 clear_mg_right">
                <div class="img_mg_bottom_10 img_line_Two" style="height:50%">
                    <van-image
                        class="img_public img_mg_right_10"
                        width="100%"
                        height="100%"
                        lazy-load
                        fit='fill'
                        :src="ConfigurationList[1].pictureUrl"
                        alt=''
                        @click="handleClick(ConfigurationList[1])"
                    />
                    <van-image
                        class="img_public"
                        width="100%"
                        height="100%"
                        lazy-load
                        fit='fill'
                        :src="ConfigurationList[2].pictureUrl"
                        alt=''
                        @click="handleClick(ConfigurationList[2])"
                    />
                </div>
                <div class="img_line_Two" style="height:40%">
                    <van-image
                        class="img_public img_mg_right_10"
                        width="100%"
                        height="100%"
                        lazy-load
                        fit='fill'
                        :src="ConfigurationList[3].pictureUrl"
                        alt=''
                        @click="handleClick(ConfigurationList[3])"
                    />
                    <van-image
                        class="img_public"
                        width="100%"
                        height="100%"
                        lazy-load
                        fit='fill'
                        :src="ConfigurationList[4].pictureUrl"
                        alt=''
                        @click="handleClick(ConfigurationList[4])"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import { getDetail } from "@/apiOptions/home_api.js";
import { Image as VanImage, Lazyload } from 'vant';
Vue.use(VanImage).use(Lazyload)
export default {
    components: {
        
    },
    data() {
        return {
            ConfigurationList:[]
        };
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
            this.getOperationConfiguration()
        }
    },
    methods: {
        //获取首页运营位
        getOperationConfiguration(){
            let params={
                code: this.citycode,//this.cityCode,
                productType:'1'
            }
            getDetail('/api/base/bapp/operationConfiguration/getOperationConfiguration',params).then(res=>{
                console.log('首页运营位数据',res)
                this.ConfigurationList = res.list
            }).catch(err=>{
                console.log('首页运营位报错',err)
            })
        },
        handleClick(obj){
            if(obj.type == 1){
                //链接
                window.location.href = `${obj.typeValue}`
            }else if(obj.type == 2){
                //文章
                window.location.href = `/ad/infoDetail.html?id=${obj.articleId}`
                // this.$router.push({
                //     path:'/infoDetail',
                //     query:{
                //         id: obj.articleId
                //     }
                // })
            }else if(obj.type == 3){
                //楼盘
                let agreement = window.location.protocol
                let domain = window.location.host;
                window.location.href = `${agreement}//${domain}/dynamicPages/mstation/${obj.buildingId}.html`
            }else if(obj.type == 4){
                window.location.href = `/ad/infoDetail.html?id=${obj.id}&type=4`
                // return false
            }
        }
    },
    created() {
        this.getOperationConfiguration()
    },
    mounted() {},
    beforeCreate() {}, //生命周期 - 创建之前
    beforeMount() {}, //生命周期 - 挂载之前
    beforeUpdate() {}, //生命周期 - 更新之前
    updated() {}, //生命周期 - 更新之后
    beforeDestroy() {}, //生命周期 - 销毁之前
    destroyed() {}, //生命周期 - 销毁完成
    activated() {} //如果页面有keep-alive缓存功能，这个函数会触发
    };
</script>
<style lang='scss' scoped>
.operate_warp {
    padding: 0px 10px;
    padding-top: 20px;
    background-color: #ffffff;
    .main_body{
        display: flex;
        justify-content: space-between;
        // 公共样式
        .img_public{
            border-radius: 7px;
            overflow: hidden;
            // margin-right: 10px;
        }
        .img_mg_right_10{
            margin-right: 10px;
        }
        .clear_mg_right{
            margin-right: 0;
        }
        .img_mg_bottom_10{
            margin-bottom: 10px;
        }
        .clear_mg_bottom{
            margin-bottom: 0;
        }
        //一个
        .img_warp_1{
            height: 88px;
            width: 100%;
        }
        //两个
        .img_warp_12{
            height: 88px;
            width: 50%;
        }
        //三个
        .img_warp_3{
            height: 186px;
            width: 50%;
        }
        //四个
        .img_warp_4{
            height: 220px;
            display: flex;
            width: 30%;
            flex-direction: column;
        }
        //五个
        .img_warp_5{
            height: 220px;
            width: 30%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .img_line_Two{
            display: flex;
            justify-content: space-between;
            flex: 1;
        }
        .flex_1{
            flex: 1;
        }
        .img_warp_45_right{
            width: 70%;
            flex: 1;
        }
        .img_3_right_warp{
            height: 50%;
            border-radius: 7px;
            overflow: hidden;
        }
    }
}
</style>
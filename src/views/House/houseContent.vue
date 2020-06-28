<!-- 楼盘列表 -->
<template>
    <div class='content_warp'>
            <div class="NoSearchData_wrap" v-if="NoSearchData">
                <div class="NoSearchData">
                    <img src="@/assets/img/NoSearchData.png" alt="没有数据">
                    <p>没有符合条件的楼盘</p>
                </div>    
            </div>
            <ul v-else>
                <li class="list_item" v-for="item in SearchList" :key="item.buildingId" @click="toDetail(item.id)">
                    <div class="list_item_warp">
                        <div class="img_warp">
                            <van-image
                                lazy-load
                                fit="fill"
                                :show-loading='false'
                                :src="item.albumCoverPicture?item.albumCoverPicture:noImage"
                                :alt="item.buildingAlias"
                            >
                                <template v-slot:error><img src="../../assets/img/pic_default_small@2x.png" alt="加载失败"></template>
                            </van-image>
                        </div>
                        <div class="item_details">
                            <p class="details_title">
                                {{item.buildingAlias}}
                                <span class="label cl_B" v-if="!!item.propertyType">{{handlePropertyType(item.propertyType)}}</span>
                                <span class="label cl_Y">{{item.salesStatus == 1?'待售':item.salesStatus == 2?'在售':item.salesStatus == 3?'售罄':item.salesStatus == 4?'在租':''}}</span>
                            </p>
                            <p class="price_details">{{$formatter.AveragePrice(item.referenceAveragePriceType,item.referenceAveragePrice,item.referenceAveragePriceMax)}}</p>
                            <p class="address_details"><span class="mg_rt_5">{{item.areaName}} <span v-if="item.streetName">-</span>{{item.streetName}}</span>{{$formatter.formatArea(item.referenceBuildAreaMin, item.referenceBuildAreaMax)}}</p>
                            <div class="classify">
                                <p><span v-for="(item,index) in TagArr(item.buildingTag)" :key="index">{{item}}</span></p>
                            </div>
                        </div>
                    </div>
                    <p  class="recommend_mess"><img class="recommend_mess_img" src="../../assets/img/icon_advantage@2x.png" alt="楼盘卡片">{{item.buildingBrightSpot}}</p>
                </li>
            </ul>
            
            <!-- 热门推荐 -->
            <ul class="hot_recommend" v-if="HotRecommendList.length>0">
                <p class="hot_recommend_label">热门推荐</p>
                <li class="list_item" v-for="item in HotRecommendList" :key="item.buildingId" @click="toDetail(item.buildingId)">
                    <div class="list_item_warp">
                        <div class="img_warp">
                            <van-image
                                lazy-load
                                fit="fill"
                                :src="item.albumCoverPicture?item.albumCoverPicture:noImage"
                                :alt="item.buildingAlias"
                                
                            >
                                <template v-slot:error><img src="../../assets/img/pic_default_small@2x.png" alt="加载失败"></template>
                            </van-image>
                        </div>
                        <div class="item_details">
                            <p class="details_title">
                                {{item.buildingAlias}}
                                <span class="label cl_B" v-if="!!item.propertyType">{{handlePropertyType(item.propertyType)}}</span>
                                <span class="label cl_Y">{{item.salesStatus == 1?'待售':item.salesStatus == 2?'在售':item.salesStatus == 3?'售罄':item.salesStatus == 4?'在租':''}}</span>
                            </p>
                            <p class="price_details">{{$formatter.AveragePrice(item.referenceAveragePriceType,item.referenceAveragePrice,item.referenceAveragePriceMax)}}</p>
                            <p class="address_details"><span class="mg_rt_5">{{item.areaName}} <span v-if="item.streetName">-</span>{{item.streetName}}</span>{{$formatter.formatArea(item.referenceBuildAreaMin, item.referenceBuildAreaMax)}}</p>
                            <div class="classify">
                                <p><span v-for="(item,index) in TagArr(item.buildingTag)" :key="index">{{item}}</span></p>
                            </div>
                        </div>
                    </div>
                    <p  class="recommend_mess"><img class="recommend_mess_img" src="../../assets/img/icon_advantage@2x.png" alt="楼盘卡片">{{item.buildingBrightSpot}}</p>
                </li>
            </ul>
    </div>
</template>

<script>
import Vue from 'vue';
import { mapState, mapGetters } from 'vuex'
import foot from '@/components/foot/foot'
import {getDetail} from '@/apiOptions/home_api.js';
import { Image as VanImage, Lazyload, Toast } from 'vant';
Vue.use(VanImage).use(Lazyload).use(Toast)
export default {
components: {
    foot
},
data() {
return {
    pullup: false,
    pulldown: true,
    scrollToEndFlag: true,
    noImage:require('@/assets/img/pic_default_small@2x.png'),
    HotRecommendList:[],//热门推荐
    SearchList:[],//搜索列表
    NoSearchData:false,
    page:1,
    rows:2000
};
},
computed: {
    ...mapState({
        citycode:state=>state.city.code,
        areacode:state=>state.area.code,
    }),
    // ...mapGetters(['cityCode']),
},
watch: {
    citycode(newValue,oldValue){
        console.log(newValue)
        if(newValue  === oldValue)return;
        document.body.scrollTop=document.documentElement.scrollTop=0;
        this.getSearchList({},'new')
        this.getHotRecommend()
        this.$store.dispatch('saveArea',{code:'',title:''})
    }
},
methods: {
    init(){
        this.getSearchList()
        this.getHotRecommend()
    },

    //热门推荐
    getHotRecommend(){
        let param = {
            cityCode : this.citycode
        }
        getDetail('/api/building/pc/building/hotBuildingRecommendByAreaCode',param).then(res=>{
            console.log('热门推荐',res)
            this.HotRecommendList = res.list
        }).catch(err=>{
            console.log(err)
        })
    },
    //获取搜索的列表
    getSearchList(data={},flag){
        console.log(111111,data,flag)
        flag?this.currentDate = data:data = this.currentDate;
        if(this.$route.query.areaCode){ //楼盘详情的areacode
            this.$store.dispatch('saveArea',{code:this.$route.query.areaCode,title:this.$route.query.name})
        }
        if(this.$route.query.cityCode){ //楼盘详情 点击底部跳转的城市code
            this.$store.dispatch('saveCity',{code:this.$route.query.cityCode,title:this.$route.query.name})
            this.$tool.setStorage({storageCity: JSON.stringify({code:this.$route.query.cityCode,title:this.$route.query.name})})
            this.$store.dispatch('saveArea',{code:'',title:''})
        }
        console.log(6666666,data)
        if(this.$route.query.areaCode && !flag) {
            return false
        }
        let params = Object.assign({},data,{
            city:this.citycode,
            page:flag?1:this.page,
            rows:this.rows,
            buildingName:this.$route.query.areacode||flag?'':this.$route.query.name
        });
        console.log(this.$route.query.areacode,this.areacode,params,111112222)
        getDetail('/api/search/v1/building/search/buildingSearchBuildingListResult',params).then(res=>{
            console.log('搜索列表',res)
            this.SearchList = res.list
            if(res.total == 0){
                this.NoSearchData = true
            }else{
                if(!params.listSort){
                    Toast(`为你找到${res.total}个楼盘`);
                }
                this.NoSearchData = false
            }
        }).catch(err=>{
            console.log(err)
            this.NoSearchData = true
        })
    },
    //楼盘标签
    TagArr(str){
        console.log(typeof(str))
        let buildingtagArr = []
        if(str){
            if(str.indexOf(',') == -1){
                buildingtagArr[0]=str
            }else{
                buildingtagArr =  str.split(',');
            }
        }else{
            buildingtagArr =  []
        }
        return buildingtagArr
    },
    handlePropertyType(key){
        let newKey = ''
        if(key.length>1){
            newKey = key.substring(0,1)
        }else{
            newKey = key
        }
        return this.$formatter.switchName('propertyType',newKey)
    },
    toDetail(id){
        let agreement = window.location.protocol
        let domain = window.location.host;
        window.location.href = `${agreement}//${domain}/dynamicPages/mstation/${id}.html`
    },
},
created() {
    
},
mounted() {
    this.init()
}
}
</script>
<style lang='scss' scoped>
.content_warp{
    padding: 5px 10px 0px 10px;
    overflow: hidden;
    .list_item{
        padding: 15px 0;
        position: relative;
        &:not(:last-child)::after{
                position: absolute;
                box-sizing: border-box;
                content: ' ';
                pointer-events: none;
                top: -50%;
                right: -50%;
                bottom: -50%;
                left: -50%;
                border-bottom: 1px solid #ebedf0;
                -webkit-transform: scale(0.5);
                transform: scale(0.5);
            }
        .list_item_warp{
            display:flex;
            overflow: hidden;
            .img_warp{
                width: 105px;
                height: 85px;
                border-radius: 5px;
                overflow: hidden;
                .van-image{
                    height: 100%;
                    width: 100%;
                    img{
                        width: 100%;
                        height:100%;
                    }
                }
            }
            .item_details{
                padding-left: 10px;
                flex: 1;
                .details_title{
                    font-size: 16px;
                    line-height: 20px;
                    color: #333333;
                    font-weight: 700;
                    .label{
                        border-radius:2px;
                        font-size: 10px;
                        color: #ffffff;
                        // width: 24px;
                        padding: 0 2px;
                        height: 13px;
                        display: inline-block;
                        text-align: center;
                        line-height: 15px;
                        margin-left: 3px;
                        vertical-align: text-top;
                        margin-top: 2px;
                    }
                    .cl_B{
                        background-color: #00A4FF;
                        margin-right: 4px;
                        margin-left: 5px;
                    }
                    .cl_Y{
                        background-color: #FF8252;
                    }
                }

                .price_details{
                    font-size: 16px;
                    color: #FF664F;
                    line-height: 15px;
                    padding:8px 0 7px 0;
                    .price_unit{
                        font-size: 10px;
                        line-height: 15px;
                        margin-left: 2px;
                    }
                }

                .address_details{
                    font-size: 12px;
                    color: #666666;
                    line-height: 12px;
                    padding-bottom: 8px;
                    .mg_rt_5{
                        margin-right: 10px;
                    }
                }

                .classify{
                    font-size: 10px;
                    color: #999999;
                    overflow-y: hidden;
                    overflow-x: scroll;
                    height: 15px;
                    &::-webkit-scrollbar {display:none}
                    p{
                        height: 100%;
                        width: 100px;
                        display: flex;
                    }
                    span{
                        display: block;
                        float: left;
                        margin-right: 2px;
                        height: 15px;
                        line-height: 17px;
                        padding: 0 3px;
                        background-color: #F1F9FF;
                        border-radius:2px;
                        white-space: nowrap;
                    }
                }    
            }
        }

        .recommend_mess{
            margin: 10px 0 0 0;
            background-color: #FFF9F3;
            color: #ED9371;
            font-size: 10px;
            height: 18px;
            line-height: 18px;
            display: inline-block;
            margin-right: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            border-radius: 10px;
            padding-right: 10px;
            max-width: 95%;
            &_img{
                width: 14px;
                height: 14px;
                float: left;
                margin: 2px 4px 0 2px;
            }
        }
    }
    .hot_recommend{
        .hot_recommend_label{
            padding-top: 15px;
            font-size: 16px;
            color: #282828;
        }
    }
    .NoSearchData_wrap{
        .NoSearchData{
            padding: 56px 86px 40px 86px;
            img{
                width: 100%;
                height: 100%;
            }
            p{
                text-align: center;
                font-size: 14px;
                color: #CCCCCC;
                line-height: 14px;
            }
        }
    }
    
}
</style>

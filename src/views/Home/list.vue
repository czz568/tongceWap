<!-- 首页列表区域 -->
<template>
    <div :class="['detail_list',loading?'':'pd_bm']">
        <van-list
            v-model="loading"
            :finished="finished"
            loading-text=' '
            @load="getHomeList"
        > 
            <div>
                <div v-for="item in listDataLeft" :key="item.id">
                    <div class="project_msg project_msg_left" @click="toDetail(item)">
                        <div class="top_img">
                            <van-image
                                lazy-load
                                :show-loading='false'
                                fit="fill"
                                :src="item.albumCoverPicture?item.albumCoverPicture:noImage"
                            ></van-image>
                            <p class="img_play">
                                <span class="img_btn" v-if="item.vr != 0"><img src="@/assets/img/detail_VR.png" alt=""></span>
                                <span class="play_btn" v-if="item.video != 0"><img src="@/assets/img/index_video.png" alt=""></span>
                            </p>
                            <p class="project_label">
                                <span class="label cl_B" v-if="!!item.propertyType">{{handlePropertyType(item.propertyType)}}</span>
                                <span class="label cl_Y" v-if="!!item.salesStatus">{{item.salesStatus == 1?'待售':item.salesStatus == 2?'在售':item.salesStatus == 3?'售罄':item.salesStatus == 4?'在租':''}}</span>
                            </p>
                        </div>
                        <div class="price_msg">
                            <p class="project_name"><img :src="require('../../assets/img/icon_fire@2x.png')" style="width:11px;height:15px;marginRight:3px;verticalAlign: top;" v-if="item.mainPush!=0" />{{item.buildingAlias}}</p>
                            <p class="address">{{item.areaName}} <span v-if="item.streetName">-</span>{{item.streetName}}</p>
                            <ul class="classify">
                                <li><span v-for="(item,index) in TagArr(item.buildingTag)" :key="index">{{item}}</span></li>
                            </ul>
                            <p class="price_num">{{$formatter.AveragePrice(item.referenceAveragePriceType,item.referenceAveragePrice,item.referenceAveragePriceMax)}}</p>
                            <p class="cl_999">{{$formatter.formatTotalPrice(item.referenceTotalPriceMin,item.referenceTotalPriceMax)}}</p>
                            <p class="cl_999">{{$formatter.formatArea(item.referenceBuildAreaMin,item.referenceBuildAreaMax)}}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div v-for="item in listDataRight" :key="item.id">
                    <div class="project_msg project_msg_left" @click="toDetail(item)">
                        <div class="top_img">
                            <van-image
                                lazy-load
                                :show-loading='false'
                                fit="fill"
                                :src="item.albumCoverPicture?item.albumCoverPicture:noImage"
                            ></van-image>
                            <p class="img_play">
                                <span class="img_btn" v-if="item.vr != 0"><img src="@/assets/img/detail_VR.png" alt=""></span>
                                <span class="play_btn" v-if="item.video != 0"><img src="@/assets/img/index_video.png" alt=""></span>
                            </p>
                            <p class="project_label">
                                <span class="label cl_B" v-if="!!item.propertyType">{{handlePropertyType(item.propertyType)}}</span>
                                <span class="label cl_Y" v-if="!!item.salesStatus">{{item.salesStatus == 1?'待售':item.salesStatus == 2?'在售':item.salesStatus == 3?'售罄':item.salesStatus == 4?'在租':''}}</span>
                            </p>
                        </div>
                        <div class="price_msg">
                            <p class="project_name"><img :src="require('../../assets/img/icon_fire@2x.png')" style="width:11px;height:15px;marginRight:3px;verticalAlign: top;" v-if="item.mainPush!=0" />{{item.buildingAlias}}</p>
                            <p class="address">{{item.areaName}} <span v-if="item.streetName">-</span>{{item.streetName}}</p>
                            <ul class="classify">
                                <li><span v-for="(item,index) in TagArr(item.buildingTag)" :key="index">{{item}}</span></li>
                            </ul>
                            <p class="price_num">{{$formatter.AveragePrice(item.referenceAveragePriceType,item.referenceAveragePrice,item.referenceAveragePriceMax)}}</p>
                            <p class="cl_999">{{$formatter.formatTotalPrice(item.referenceTotalPriceMin,item.referenceTotalPriceMax)}}</p>
                            <p class="cl_999">{{$formatter.formatArea(item.referenceBuildAreaMin,item.referenceBuildAreaMax)}}</p>
                        </div>
                    </div>
            </div>
            </div>
            <div slot='loading'>
                <loading />
            </div>
        </van-list>
        <div v-if="listDataLeft.length==0 && listDataRight.length==0" class="noList">
                <img src="@/assets/img/noList.png" alt="" class="noList_img"><br/>
                <span class="noList_span">没有符合条件的楼盘</span>
        </div>
        
    </div>
</template>

<script>
// import Vue from 'vue';
import { mapState, mapGetters } from 'vuex'
import { getHomeListData } from '@/apiOptions/home_api.js';
import { Search, Icon, List, Toast } from 'vant';
import loading from '@/components/loading'
// Vue.use(Search).use(Icon).use(List)
export default {
components: {
    loading,
    [Search.name]:Search,
    [Icon.name]:Icon,
    [List.name]:List,
    [Toast.name]:Toast
},
data() {
return {
    listDataLeft:[],
    listDataRight:[],
    noImage:require('@/assets/img/pic_default_small@2x.png'),
    loading: false,
    finished: false,
    page:1,
    rows:10
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
        this.listDataLeft = [];
        this.listDataRight = [];
        this.getHomeList()
    }
},
methods: {
    //楼盘标签
    TagArr(str){
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
    getHomeList(data={},flag){
        flag?this.currentDate = data:data = this.currentDate;
        let params = Object.assign({},data,{
            city:this.citycode,
            page:flag?1:this.page,
            rows:this.rows
        });
        console.log(params,'列表传参')
        getHomeListData("/api/building/capp/building/buildingSearchBuildingListResult",params).then(res=>{
            console.log('首页列表数据',res)
            this.loading = false;
            if(res.list.length<1){
                this.listDataLeft = [];
                this.listDataRight = [];
                this.finished = true;
                this.loading = false;
                return;
            }
            let l=[],r=[];
            res.list.forEach((item,index)=>{
                if(index%2 == 0){l.push(item)}
                else r.push(item);
            })
            if(flag){
                this.listDataLeft = l;
                this.listDataRight = r;
                if(!params.listSort){
                    Toast(`为你找到${this.listDataLeft.length+this.listDataRight.length}个楼盘`)
                }
                if ((this.listDataLeft.length+this.listDataRight.length) >= Number(res.total)) {
                    this.finished = true;
                    this.loading = false;
                }else{
                    this.finished = false;
                }
            }else{
                this.listDataLeft = this.listDataLeft.concat(l);
                this.listDataRight = this.listDataRight.concat(r);
                if ((this.listDataLeft.length+this.listDataRight.length) >= Number(res.total)) {
                    this.finished = true;
                    this.loading = false;
                }else{
                    this.finished = false;
                }
            }
            this.page = res.nextPage;
            
        }).catch(err=>{
            this.finished = true;
            this.loading = false;
            console.log(err)
        })
    },
    toDetail(obj){
        let agreement = window.location.protocol
        let domain = window.location.host;
        window.location.href = `${agreement}//${domain}/dynamicPages/mstation/${obj.id}.html`
    },
    init(){
        this.getHomeList()
    }
},
}
</script>
<style lang='scss' scoped>
.pd_bm{
    padding-bottom: 0px !important;
}
.detail_list{
    padding-left: 5px;
    // padding-top: 5px;
    overflow: hidden;
    position: relative;
    padding-bottom: 60px;
    .noList{
        // height: 120px;
        padding: 36px 0 40px;
        background-color: white;
        text-align: center;
        .noList_img{
            height: 120px;
        }
        .noList_span{
            color: #CCCCCC;
        }
    }
    
    /deep/.van-list{
        column-count:2;
        column-gap: 0em;
        // background-color: white;
            .van-cell{
                padding: 0;
                background-color: #F8F8F8;
                break-inside: avoid;
            }
            .van-cell::after{
                content: '';
                border-bottom: 0;
            }
            .van-list__loading{
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0;
                height: 60px;
                line-height: 60px;
                background-color: #F8F8F8;
            }
    }
    
    .project_msg{
        padding: 0 5px 5px 0;
        width: auto;
        break-inside: avoid;
        .top_img{
            height: 180px;
            position: relative;
            /deep/.van-image{
                width: 100%;
                height: 100%;
                img{
                    // width: 100%;
                    border-top-left-radius: 0.213333rem;
                    border-top-right-radius: 0.213333rem;
                    // border-radius: 10px;
                }
            }
            img{
                width: 100%;
                height: 100%;
            }
            .img_play{
                position: absolute;
                top:8px;
                left: 8px;
                span{
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background-color: rgba(0,0,0,0.2);
                }
                .img_btn{
                    margin-right: 6px;
                }
            }
            .project_label{
                position: absolute;
                bottom: 4px;
                right: 4px;
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
                }
                .cl_B{
                    background-color: #00A4FF;
                    margin-right: 4px;
                }
                .cl_Y{
                    background-color: #FF8252;
                }
            }
        }
        .price_msg{
            padding:0 10px 12.5px 10px;
            background-color: #ffffff;
            border-bottom-right-radius: 4px;
            border-bottom-left-radius: 4px;
            overflow: hidden;
            .project_name{
                color: #333333;
                font-size: 14px;
                font-weight: 700;
                padding-top: 7px;
                line-height: 20px;
                
            }
            .address{
                font-size: 12px;
                color: #666666;
                line-height: 16px;
                margin-bottom: 5px;
            }
            .classify{
                font-size: 10px;
                color: #999999;
                overflow-y: hidden;
                overflow-x: scroll;
                &::-webkit-scrollbar {display:none}
                li{
                    height: 100%;
                    width: 100rem;
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
                    margin-bottom: 2.5px;
                }
            }    
            .price_num{
                color: #FF664F;
                font-size: 16px;
                line-height: 21px;
                margin-bottom: 3px;
                .price_unit{
                    font-size: 10px;
                    line-height: 15px;
                    margin-left: 2px;
                }
            }
            .cl_999{
                font-size: 12px;
                color: #999999;
                line-height: 17px;
            }
        }
    }
}
</style>
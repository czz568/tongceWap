<!-- 周边配套 -->
<template>
    <div class="Peripheral">
        <!-- <header-top title="周边配套"></header-top> -->
        <div class="spread_main">
            <div class="bmView" @click.stop="handleClickBm">
                <baidu-map class="spread_main_img" :center="location"   :zoom="zoom" @ready="handler" ak="onBnxFbt0v7s9fmhaEpgUktrhyK7duY0">
                    <!-- <bm-view class="map"></bm-view> -->
                    <!-- <bm-local-search  :auto-viewport="true"></bm-local-search> -->
                    <bm-overlay
                    pane="labelPane"
                    class="sample"
                    @draw="draw">
                        <div class="housemapImg">
                            <div class="mapSqure">
                                <div class="houseName">{{houseName}}</div>
                                <div class="houseAddress">{{houseAddress}}</div>
                            </div> <!--{{houseMess.buildingAlias}} -->
                            <i class="iconfont iconhouse_address draw_img"></i>
                        </div>
                    </bm-overlay>
                    <my-overlay
                        v-for="(item,index) in points" 
                        :position="{lng: item.point.lng, lat: item.point.lat}" 
                        :key="index"
                    >
                        <div @click.stop="changeCenter(item,index)">
                            <i class="iconfont iconWarp iconpoint" :style="{fontSize:item.fontSizeWarp,color:item.fontColor,zIndex:item.Zindex}">
                                <i :class="['iconfont', item.icon, 'content_icon']" :style="{fontSize:item.fontSizeCont}" ></i>
                            </i>
                        </div>
                    </my-overlay>
                </baidu-map>
            </div>
            <div class="spread_main_styles">
                <div class="spread_tab">   
                    <div v-for="(item,i) in housePeriphery.styleList" :key="i"  :class="['spread_tab_item',{tab_active:item.name == currentTab}]" @click="changeTab(item.name)">
                        <i :class="[ 'iconfont', 'icon_style', housePeriphery.styleList[i].icon ]"></i>
                        <span class="spread_tab_item_text">{{item.name}}</span>
                    </div>
                </div>
                
                <div v-if="isShowTab" class="currentTab">
                    <div v-for="(item) in housePeriphery.styleList" :key="item.name" class="tab_item_warp">
                        <div v-if="item.name == currentTab">
                            <div v-for="(itemT,idx) in  item.currentMess" :key="idx" class="busList" @click="handleCilckCurrentMess(itemT,idx)" :class='idx==selected?"selected":""'>
                                <p class="busList_text">
                                    <span class="busList_left">{{itemT.title}}</span>
                                    <span class="busList_center">({{itemT.address}})</span>
                                </p>   
                                <p>
                                    <span class="busList_right">
                                        {{itemT.distance}}m
                                    </span>
                                </p>
                            </div>
                        </div>
                        
                    </div>
                </div>
                
            </div>
            
        </div>
    </div>
</template>
<script>
import Vue from 'vue';
import { BaiduMap, BmView, BmOverlay, BmPointCollection, BmMarker } from 'vue-baidu-map';
// import headerTop from '@/components/header/header'
import myOverlay from "./myOverlay";
import { Tab, Tabs, Toast } from 'vant';
Vue.use(Tab).use(Tabs).use(Toast)
import { urlParse } from '../../common/js/util.js';
import {getDetail} from '@/apiOptions/home_api.js';
export default {
    components: {
        BaiduMap,
        BmView,
        BmOverlay,
        BmPointCollection,
        BmMarker,
        myOverlay,
        // headerTop
    },
    data() {
        return {
            location: {
                lat: 0,
                lng: 0
            },
            houselocation:{
                lat: 0,
                lng: 0
            },
            housePeriphery: {
                styleList: [
                    {
                        name:'公交',
                        icon:'iconicon_bus',
                        currentMess:[]
                    },
                    {
                        name:'地铁',
                        icon:'iconicon_subway',
                        currentMess:[]
                    },
                    {
                        name:'教育',
                        icon:'iconicon_education',
                        currentMess:[]
                    },
                    {
                        name:'银行',
                        icon:'iconicon_bank',
                        currentMess:[]
                    },
                    {
                        name:'医院',
                        icon:'iconicon_hospital',
                        currentMess:[]
                    },
                    {
                        name:'购物',
                        icon:'iconicon_shop',
                        currentMess:[]
                    },
                    {
                        name:'美食',
                        icon:'iconicon_food',
                        currentMess:[]
                    },
                    {
                        name:'健身',
                        icon:'iconicon_fitness',
                        currentMess:[]
                    },
                ],
                listMess: []
            },
            zoom: 15,
            currentTab:'公交',
            selected:null,
            isShowTab:true,//控制tab 列表的显示隐藏
            points:[],

            minZoom:14,
            maxZoom:18,
            lat:"31.421164",//纬度
            lng:"121.482319",//经度
            houseName:'',
            houseAddress:''
        };
    },
    
    computed: {
        
    },
    watch: {},
    methods: {
        handler ({BMap, map}) {
            // console.log(BMap, map)
            new BMap.Geolocation().getCurrentPosition(r => {
                    this.currentLatitude = r.latitude;
                    this.currentLongitude = r.longitude;
                });
            setTimeout(_ => {
                let that = this;
                this.$set(this.location, 'lat', this.currentPonitLat || this.lat)
                this.$set(this.location, 'lng', this.currentPonitlng || this.lng)
                this.$set(this.houselocation, 'lat', this.currentPonitLat || this.lat)
                this.$set(this.houselocation, 'lng', this.currentPonitlng || this.lng)
                // this.zoom = 15;
                map.setZoom(6)
                map.disableDragging();
                // //TODO: click 事件 移动端会被屏蔽
                // map.addEventListener("click", function (e) {
                //     // console.log(e)
                //     // console.log("该点的经纬度为：" + e + e.point.lng + " , " + e.point.lat);
                // });
        
                // TODO: 触摸移动时触发此事件 此时开启可以拖动。虽然刚初始化该地图不可以拖动，但是可以触发拖动事件。
                map.addEventListener("touchmove", function (e) {
                    map.enableDragging();
                });
                // TODO: 触摸结束时触发次此事件  此时开启禁止拖动
                map.addEventListener("touchend", function (e) {
                    map.disableDragging();
                });
                var local;
                var options = {
                onSearchComplete(results) {
                    // console.log(results,1111)
                    // 判断状态是否正确
                    that.mySearchCompleteCallback(results, BMap, map)
                    that.addPoints('公交')
                    }
                }
                this.$nextTick(_ => {
                    local = new BMap.LocalSearch(map, options);
                    local.searchNearby(['公交', '地铁', '教育', '银行', '医院', '购物', '美食', '健身'], new BMap.Point(this.location.lng, this.location.lat), 3000);
                    document.querySelector('.anchorBL').style.display = 'none'
                })
            }, 0)
        },
        draw ({el, BMap, map}) {
            const {lng, lat} = this.houselocation
            const pixel = map.pointToOverlayPixel(new BMap.Point(lng, lat))
            el.style.left = pixel.x - 20 + 'px'
            el.style.top = pixel.y - 20 + 'px'
        },
        mySearchCompleteCallback(LocalResult, BMap, map) {
            if (LocalResult.length < 1) return;
            for (var i = 0; i < LocalResult.length; i++) {
                if (LocalResult[i].Ir.length > 0) {
                var s = LocalResult[i].Ir;
                var keyword = LocalResult[i].keyword;
                this.addhousePeriphery(keyword, s, BMap, map)
                }
            }
            this.$set(this.housePeriphery, 'listMess', (this.housePeriphery.styleList[0] && this.housePeriphery.styleList[0].currentMess) || [])
        },
        addhousePeriphery(keyword, messList, BMap, map) {
            messList.forEach(item => {
                let d = map.getDistance(new BMap.Point(this.location.lng, this.location.lat), new BMap.Point(item.point.lng, item.point.lat))
                d = parseInt(d);
                if (d > 1000)d = (d / 1000).toFixed(1) + 'k'
                item.distance = d;
            })
            // this.housePeriphery.styleList.push({
            //         name: keyword,
            //         num: messList.length,
            //         currentMess: messList
            // })
            this.housePeriphery.styleList.map(itemT=>{
                if(keyword == itemT.name){
                    itemT.currentMess = messList || []
                }
            })
            this.isShowTab = true
        },
        changeTab(val){
            this.selected = null;
            this.points = [];
            this.currentTab = val;
            this.isShowTab = true;
            this.addPoints(val);
        },
        getIconFont(name){
            this.housePeriphery.styleList.forEach((item,index)=>{
                if(name == item.name){
                    return item.icon
                }
            })
        },
        //点击每一项添加背景色 + 定位到选中
        handleCilckCurrentMess(obj,idx){
            this.selected = idx;
            this.$set(this.location, 'lat', obj.point.lat)
            this.$set(this.location, 'lng', obj.point.lng)
            this.points.forEach(item=>{
                if(item.title == obj.title){
                    item.fontSizeWarp = '42px'
                    item.fontSizeCont = '20px'
                    item.fontColor= '#FF824B'
                    item.Zindex = '101'
                }else{
                    item.fontSizeWarp = '30px'
                    item.fontSizeCont = '15px'
                    item.fontColor= '#00A4FF'
                    item.Zindex = '100'
                }
            })
        },
        handleClickBm(){
            this.isShowTab = false
        },
        //points添加数据
        addPoints (cur) {
            let pointsT={}
            this.housePeriphery.styleList.forEach((item,index)=>{
                if(item.name == cur){
                    if(item.currentMess.length !== 0){
                        item.currentMess.forEach((itemT,index)=>{
                            pointsT = {
                                point:{
                                    lat:itemT.point.lat,
                                    lng:itemT.point.lng,
                                },
                                title:itemT.title,
                                icon:item.icon,
                                name:item.name,
                                fontSizeWarp:'30px',
                                fontSizeCont:'15px',
                                fontColor:'#00A4FF',
                                Zindex: '100'
                            }
                            this.points.push(pointsT)
                        })
                    }else{
                        this.isShowTab = false
                        Toast(`附近3公里内没有设施`)
                    }
                }
            })
        },
        //点击坐标更改中心点
        changeCenter(obj,index){
            this.isShowTab = true
            this.handleCilckCurrentMess(obj,index)
            this.$nextTick(()=>{
                let selectedOffsetTop = document.querySelector('.selected').offsetTop
                let spreadtabOffsetHeight = document.querySelector('.spread_tab').offsetHeight
                document.querySelector('.currentTab').scrollTop = (Number(selectedOffsetTop) - Number(spreadtabOffsetHeight))
            })
        }
    },
    beforeCreate(){
        for (var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i); //获取本地存储的Key
            if(key.indexOf("BMap")>-1){
                window.localStorage.removeItem(key)
            }
        }
    },
    created() {
        this.$nextTick(()=>{
            document.querySelector('.spread_main').style.height = (document.body.clientHeight - document.querySelector('.header').offsetHeight) + 'px'
            console.log(document.querySelector('.header').offsetHeight)
        })
        let l = this.$route.params.id;
        let textObj = this.$route.query
        this.lng = l.split('-')[0]
        this.lat = l.split('-')[1]
        this.houseName = textObj.buildingName;
        this.houseAddress = textObj.buildingUrl
        console.log(this.$route,23232323)
    },
    mounted() {
        
    }
}
</script>
<style lang='scss' scoped>
.anchorBL{
    display:none!important;
}
.Peripheral{
    width: 100%;
    // overflow: hidden;
    .spread_main{
        // height: 650px;
        .bmView{
            height: 100%;
        }
        .spread_main_img{
            height: 100%;
        }
    }
    .sample {
        position: absolute;
        z-index: 999;
    }
    .iconWarp{
        position: relative;
        .content_icon{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -60%);
            color: #ffffff;
        }
    }
    .draw_img{
        // width: 30px;
        // height: 30px;
        font-size: 30px;
        color: red;
    }
    .mapSqure{
        min-width: 95px;
        padding: 10px 20px;
        background-color: white;
        position: absolute;
        top: -70px;
        border-radius: 8px;
        left: -45px;
        color: #1B1833;
        font-size: 15px;
        text-align: center;
        line-height: 36px;
        white-space: nowrap;
        .houseName{
            font-size: 16px;
            font-weight: 700;
            line-height: 23px;
        }
        .houseAddress{
            font-size: 11px;
            line-height: 15px;
        }
    }
    .mapSqure::after{
        content: '';
        width: 0;
        height: 0;
        position: absolute;
        border: 12px solid;
        bottom: -23px;
        left: 50px;
        border-color:  #fff transparent transparent;
    }
    .ml3{
        margin-left: 15px;
    }
    .line{
        border-bottom: 1px solid #EFEFEF;
        margin: 14px 0;
    }
    .ml5{
        margin-left: 15px;
    }
    .mb5{
        margin-bottom: 15px;
    }
    .spread_main_styles{
        width: 100%;
        position: fixed;
        bottom: 0;
        background-color: #fff;
        max-width: 750PX;/*no*/
        margin:0 auto;
        .spread_tab{
            display: flex;
            justify-content: space-between;
            height: 54px;
            .spread_tab_item{
                display: flex;
                flex-direction: column;
                flex: 1;
                text-align: center;
                .icon_style{
                    font-size: 14px;
                    margin-top: 17px;
                }
                .spread_tab_item_text{
                    padding: 7px 0 ;
                    font-size: 10px;
                    line-height: 10px;
                }
            }
            
        }
        .currentTab{
            height: 200px;
            overflow-x: hidden;
            overflow-y: scroll;
            &::-webkit-scrollbar {display:none}
        }
    }
    .busList{
        padding: 12px 21px;
        display: flex;
        justify-content: space-between;
        &_text{
            display: flex;
            flex-direction: column;
        }
        &_left{
            color: #333333;
            font-weight: 700;
            font-size: 16px;
            line-height: 22px;
            display: inline-block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 280px;
        }
            &_center{
                color: #999999;
                font-size: 12px;
                line-height: 17px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                display: inline-block;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                width: 280px;
                padding-top: 6px;
            }
            &_right{
                float: right;
                color: #A9A8AE;
                font-size: 11px;
                line-height: 44px;
            }
    }
    .tab_active{
        color: #00A4FF;
    }
    .selected{
        background-color: #F0FAFF;
    }
}
</style>

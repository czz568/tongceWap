<!-- 首页头部搜索框 -->
<template>
    <div class='search_centent'>
        <!-- 搜索历史 -->
        <div class="main" v-show="!isShowSearchData">
            <div class="main_search search_history">
                <div v-show="historyData.length!=0">
                    <div class="history_top">
                        <p>搜索历史</p>
                        <i class="iconfont iconbtn_ashcan" @click="clearhistory"></i>
                    </div>
                    <div class="history_main clearfloat">
                        <span class="history_label" @click="handleClick(item,1,item)" v-for="(item,index) in historyData" :key='index'>{{item}}</span>
                    </div>
                </div>
            </div>
            <div class="main_search hot_search" v-if="HotSearchList.length >= 1">
                <div class="history_top">
                    <p>热搜榜</p>
                </div>
                <div class="history_main clearfloat">
                    <span @click="handleClick(item,1,item)" class="history_label" v-for="(item,index) in HotSearchList" :key='index'>{{item}}</span>
                </div>
            </div>
        </div>
        <!-- 模糊查询 -->
        <div class="main search_list" v-show="isShowSearchData">
            <ul>
                <li v-for="item in searchAssociationData" :key="item.id" @click="handleSearchList(item,2,item)">
                    <p class="title" v-html="pushHTML(searchValue,item.buildingAlias)">{{item.buildingAlias}}</p>
                    <p class="label"><span>{{item.areaName}}</span><span class="address">{{item.streetName}}</span></p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import { mapState } from 'vuex'
import { Search, Icon } from 'vant';
import {getDetail} from '@/apiOptions/home_api.js';
import tool from '@/plugins/tool.js';
Vue.use(Search).use(Icon)
export default {
components: {},
data() {
return {
    value:this.SearchValue,
    HotSearchList:[],
    historyData:[]
};
},
props:{
    //搜索到的数据列表
    searchAssociationData:{
        type:Array,
        default:()=>[]
    },
    //控制搜索历史显示隐藏
    isShowSearchData:{
        type:Boolean,
        default:false
    },
    //获取模糊查询列表
    searchAssociation:{
        type:Function,
        default:null
    },
    searchValue:{
        type:String,
        default:''
    }
},
computed: {
    ...mapState({
        citycode:state=>state.city.code
    })
},
watch: {},
methods: {
    onSearch(){
        this.$emit('input',this.value)
    },
    goBack(){
        this.$router.go(-1)
    },
    //获取热搜榜数据
    HotSearch(){
        getDetail("/api/building/capp/building/buildingSearchHotSearch",{city:this.citycode}).then(res=>{
            console.log("请求热搜",res)
            this.HotSearchList = res.result
        }).catch(err=>{
            console.log("请求结果报错",err)
        })
    },
    //获取本地存储的历史搜索
    getStorgeData(){
        let localstorage = this.$tool.getStorage('historySearch')
        let arr = []
        if(localstorage){
            arr = JSON.parse(localstorage) 
            this.historyData = arr.splice(0,10)
        }
    },
    //点击每个标签添加到localStorage
    handleClick(item,type,obj){
        console.log(item,'点击热搜和历史搜索获取到的数据')
        if(item !== ''){
            let localstorage = this.$tool.getStorage('historySearch')
            let arr = []
            if(localstorage){
                arr = JSON.parse(localstorage)
                this.removeArray(arr,item)
                arr.unshift(item)
            }else{
                arr.push(item)
            }
            this.$tool.setStorage({
                historySearch:JSON.stringify(arr)
            })
            this.getStorgeData()
            this.toHouseList(item,type,obj)
        }
        
    },
    
    handleSearchList(item){
        console.log(item,'模糊查询点击获取到的数据')
        this.handleClick(item.buildingName,2,item)
    },
    //清除历史搜索
    clearhistory(){
        this.$tool.clearStorage()
        this.historyData = []
    },
    //跳转楼盘列表页
    toHouseList(name,type,obj){
        console.log(obj,111111)
        if(type == 1){
            this.$router.push({
                path:'/houseList',
                query:{
                    name
                }
            })
        }else if(type == 2){
            let agreement = window.location.protocol
            let domain = window.location.host;
            window.location.href = `${agreement}//${domain}/dynamicPages/mstation/${obj.id}.html`;
            
        }
        
    },
    removeArray (arr,val) {
        let index = arr.indexOf(val);
        if (index > -1) {
            arr.splice(index, 1);
        }
    },
    pushHTML(text,str){
        let arr = str.split(`${text}`)
        console.log(arr)
        let newText = arr.join(`<span style='color:#00A4FF'>${text}</span>`)
        console.log(newText)
        return newText
    }
},
created() {
    this.HotSearch();
    this.getStorgeData();
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
    .search_centent{
        padding: 0 20px;
        .main_search{
            .history_top{
                display: flex;
                justify-content: space-between;
                font-size: 16px;
                font-weight: 700;
                line-height: 16px;
                padding: 20px 0;
                .iconbtn_ashcan{
                    font-size: 18px;
                }
            }
            .history_main{
                .history_label{
                    height: 32px;
                    line-height: 32px;
                    font-size: 14px;
                    color: #333333;
                    padding: 0 15px;
                    background-color: #F8F9FA;
                    display: inline-block;
                    float: left;
                    border-radius: 4px;
                    margin-right: 10px;
                    margin-bottom: 10px;
                }
            }
        }
        .search_list{
            padding-top: 5px;
            li{
                position: relative;
                .title{
                    font-size: 16px;
                    color: #333333;
                    line-height: 22px;
                    padding-top: 9px;
                }
                .label{
                    font-size: 14px;
                    color: #999999;
                    line-height: 20px;
                    padding-bottom: 9px;
                    .address{
                        display: inline-block;
                        margin-left: 4px;
                    }
                }
            }
            li::after{
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
            
        }
    }
        

</style>
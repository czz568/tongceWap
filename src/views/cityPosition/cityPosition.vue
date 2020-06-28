<template>
    <div class="cityPosition">
        <!-- <top-head title="城市选择" /> -->
        <!-- <div class="city-head Gps">
            <span class="city-title">GPS定位城市</span>
            <span class="city-current" @click="chooseCity(GpsaddressData)">{{GpsaddressData.title}}</span>
            <span class="location" @click="locationCity"><i class="iconfont iconshuaxin"></i>重新定位</span>
        </div> -->
        <div class="city-head">
            <span class="city-title">当前城市</span>
            <span class="city-current" @click="currentCity">{{city.title}}</span>
        </div>
        <van-index-bar class="index_bar" :index-list="indexList" highlight-color="#00A4FF">
            <van-index-anchor v-for="(item,index) in cityDts" :key="index" :index='item.initial'>
                <p class="label_Letter">{{item.initial}}</p>
                <van-cell
                @click="chooseCity(citem)"
                v-for="(citem) in item.list"
                :key="citem.code"
                :title="citem.title"
                />
            </van-index-anchor>    
        </van-index-bar>
    </div>
</template>

<script>
// import TopHead from '@/components/header/header'
import { getDetail } from '@/apiOptions/home_api.js';
import { mapState, mapAction, mapMutation } from 'vuex'
export default {
    data() {
        return {
            cityDts: [],
            indexList:[],
            GpsaddressData:{},
            cityList:[]//整合所有城市数据
        }
    },
    components:{
        // TopHead
    },
    computed: {
        //获取vuex中的cityCode
        ...mapState({
            city:state=>state.city
        }),
    },
    beforeRouteLeave(to, from, next){
    if(this.currentCity && this.currentCity.indexOf("大连")>-1){
        let url = location.host.indexOf("test")>-1?"https://daliantest.tospur.com/":'https://mdalian.tongcehaofang.com/'
        window.location.href=url+"#"+to.fullPath
    }else if(location.host.indexOf("dalian")>-1 && this.currentCity && this.currentCity.indexOf("大连")<0){
         let url = location.host.indexOf("test")>-1?"https://mtest.tospur.com/":'https://m.tongcehaofang.com/'
        window.location.href=url+"#"+to.fullPath+"?title="+this.currentCity+'&code='+ this.currentCode
    }else{
        next()
    }
      console.log(to,from,this.currentCity)
    },
    methods:{
        getonlineCity(){
            let self = this
            getDetail("/api/building/capp/building/onlineCity",{}).then(res=>{
                console.log("请求上线城市列表",res)
                Object.getOwnPropertyNames(res).forEach(function(key){
                    let obj = {}
                    obj.initial = key;
                    obj.list = res[key];
                    self.cityDts.push(obj)
                    self.indexList.push(key)
                    self.cityList.push(...res[key])
                })
            }).catch(err=>{
                console.log("请求上线城市列表结果报错",err)
            })
        },
        //切换城市
        chooseCity(obj){
            this.$store.dispatch('saveCity',obj);
            this.$tool.setStorage({storageCity: JSON.stringify(obj)})
            this.$tool.setSession({ischangeCity:true})
            // this.$store.dispatch('saveCityCode',obj.code);
            this.currentCity = obj.title;
            this.currentCode = obj.code;
            this.$router.go(-1);
        },
        currentCity(){
            this.$router.go(-1)
        },
        //重新定位
        locationCity(){
            let self = this
            this.$jsonp('//api.map.baidu.com/location/ip?ak=onBnxFbt0v7s9fmhaEpgUktrhyK7duY0&coor=bd09ll').then(res=>{
                let address = res.content.address
                if(address){
                    self.cityList.forEach(item=>{
                        if(address == item.title){
                            self.GpsaddressData = {...item}
                        }
                    })
                    console.log(self.GpsaddressData,res)
                }
            })
        }
    },
    created(){
        this.getonlineCity()
        // this.locationCity()
    },
    mounted(){
        
    }
}
</script>

<style lang="scss" scoped>
    .cityPosition{
        background-color: #F8F8F8;
        .city-head {
            padding: 14px 24px;
            background-color: #ffffff;
            .city-title {
                font-size: 17px;
                color:#333;
                font-weight: 700;
                display: inline-block;
                vertical-align: middle;
            }
            .city-current {
                display: inline-block;
                font-size: 14px;
                color: #222;
                background:rgba(244,244,244,1);
                border-radius:16px;
                padding: 9px 17px;
                vertical-align: middle;
                margin-left: 10px;
            }
        }
        .Gps{
            margin-bottom: 10px;
            padding-right: 12px;
            .iconbtn_unselected{
                vertical-align: middle;
                font-size: 14px;
                margin-right: 4px;
            }
            .location{
                font-size: 14px;
                padding: 9px 0;
                float: right;
            }
        }
        .index_bar {
            ::v-deep .van-index-anchor {
                background:#F8F8F8;
                font-size: 13px;
                color: #666;
                line-height: 30px;
                padding: 0;
            }
            ::v-deep .van-cell {
                padding: 15px 24px;
                font-size: 15px;
                color: #333333;
            }
            ::v-deep .van-index-bar__sidebar{
                color: #00A4FF;
                font-size: 12px;
                line-height: 20px;
                // height: 80%;
                display: flex;
                justify-content: space-between;
            }
            .label_Letter{
                padding: 0 24px;
                line-height: 30px;
                font-size: 13px;
                color: #666666;
                height: 30px;
            }
            
        }
        /deep/.van-index-bar__sidebar{
            .van-index-bar__index{
                padding: 4px 12px;
            }
        }
    }
</style>
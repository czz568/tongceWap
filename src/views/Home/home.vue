<!--  -->
<template>
  <div class="home_warp">
    <van-sticky>
    <div ref="he"><search v-model="searchValue" /></div>
    </van-sticky>
    <banner />
    <headlines class="headlines"/>
    <operate class="operate"></operate>
    <van-sticky :offset-top="screenTop">
    <Screen 
      class="Screen"
      @changeTab='changeTab'
      @screenChoose="screenChoose"
    ></Screen>
    </van-sticky>
    <home-list ref="homeList"></home-list>
    <Footer :isShowStatement="false"></Footer>
    <coupon-cord></coupon-cord>
    <van-dialog v-model="showChangeCity" show-cancel-button width='90%' @confirm="changeCity" @cancel="cancelChangeCity">
      <div class="dialog_main_text">您当前的位置在<span class="font_W_600">{{crrentAddress}}</span><br/>是否切换到<span class="font_W_600">{{crrentAddress}}</span>?</div> 
    </van-dialog>
    <!-- <message /> -->
  </div>
</template>

<script>
import Vue from 'vue'
import { getDetail } from "@/apiOptions/home_api.js";
import { Sticky, Dialog } from 'vant'
import search from "./search";
import banner from "./banner";
import HomeList from "./list";
import operate from './operate'
import headlines from './headlines'
import Footer from "@/components/foot/foot.vue";
import message from "@/components/msg/message.vue";
import Screen from "../../components/screen/screen.vue";
import couponCord from "@/components/couponCord";
Vue.use(Sticky).use(Dialog)
export default {
  components: {
    search,
    banner,
    HomeList,
    Footer,
    message,
    Screen,
    operate,
    headlines,
    couponCord,
  },
  data() {
    return {
      show: false,
      searchValue: "",
      ScreenOffsetTop:0,
      crrentAddress:'',
      showChangeCity:false,
      cityList:[],
      GpsaddressData:null,
      screenTop:43
    };
  },
  computed: {},
  watch: {},
  methods: {
    showPopup() {
      this.show = true;
    },
    screenChoose(data){
      console.log(data);
      this.$refs.homeList.getHomeList(data,"new")
    },
    //点击筛选条件页面滚动
    changeTab(bl){
      let operateOffsetHeight = 0
      let headlinesOffsetHeight = 0
      if(document.querySelector('.operate') != null){
        operateOffsetHeight = document.querySelector('.operate').offsetHeight
      }
      if(document.querySelector('.headlines') != null){
        headlinesOffsetHeight = document.querySelector('.headlines').offsetHeight
      }
      let self = this
      let windowScrollTop = self.ScreenOffsetTop + operateOffsetHeight + headlinesOffsetHeight
      console.log(operateOffsetHeight,headlinesOffsetHeight,windowScrollTop)
      window.scrollTo({
        top:windowScrollTop,
        behavior:'smooth'
      })
    },
    //获取本地存储的定位城市
    getStorageCity(){
      let self = this
      if(this.$tool.getStorage('storageCity')){
        let StorageCity = JSON.parse(this.$tool.getStorage('storageCity'))
        this.$store.dispatch('saveCity',StorageCity)
        //获取当前定位城市定位
        this.$jsonp('//api.map.baidu.com/location/ip?ak=onBnxFbt0v7s9fmhaEpgUktrhyK7duY0&coor=bd09ll').then(res=>{
          self.crrentAddress = res.content.address
          if(self.crrentAddress){
            // console.log(res.content.address,!self.$tool.getSession('ischangeCity'),11223344)
            if(!self.$tool.getSession('ischangeCity')){
              if(res.content.address != StorageCity.title){
                self.cityList.forEach(item=>{
                    if(self.crrentAddress == item.title){
                        self.GpsaddressData = {...item}
                        self.showChangeCity = true
                    }
                })
              }
            }
            
          }
        })
      }else{
        this.$store.dispatch('saveCity',{code: "310100000",pinyinInitial:"S",title: "上海市"})
        this.$tool.setStorage({storageCity: JSON.stringify({code: "310100000",pinyinInitial:"S",title: "上海市"})})
        this.$tool.setSession({ischangeCity:true})
      }
    },
    //切换城市
    changeCity(){
      console.log(this.GpsaddressData,111111)
      if(this.GpsaddressData !==null){
        this.$store.dispatch('saveCity',this.GpsaddressData)
        this.$tool.setStorage({storageCity: JSON.stringify(this.GpsaddressData)})
        this.$tool.setSession({ischangeCity:true})
      }
    },
    cancelChangeCity(){
      this.$tool.setSession({ischangeCity:true})
    },
    getonlineCity(){
        let self = this
        getDetail("/api/building/capp/building/onlineCity",{}).then(res=>{
            Object.getOwnPropertyNames(res).forEach(function(key){
              self.cityList.push(...res[key])
            })
            this.getStorageCity()
        }).catch(err=>{
            console.log("请求上线城市列表结果报错",err)
        })
    },
  },
  created(){
    this.getonlineCity();
    // this.getStorageCity();
    this.$nextTick(()=>{
      if(this.ScreenOffsetTop == 0){
        // let operateOffsetHeight = document.querySelector('.operate').offsetHeight
        let ScreenOffsetTop = document.querySelector('.Screen').offsetTop
        let ScreenOffsetHeight = document.querySelector('.Screen').offsetHeight
        let WindowTop = Number(ScreenOffsetTop)-Number(ScreenOffsetHeight) + 10
        console.log(ScreenOffsetTop,ScreenOffsetHeight,WindowTop)
        this.ScreenOffsetTop = WindowTop
      }
    })
  },
  mounted(){
    if(document.querySelector("body").classList.contains('pc')){
      this.screenTop = 60
    }
    let hei = this.$refs.he.offsetHeight
    console.log('hei')
    this.screenTop = hei-2;
    console.log(hei)
  }
};
</script>
<style lang='scss' scoped>
.home_warp {
  background-color: #f8f8f8;
  .dialog_main_text{
    padding: 30px 35px;
    line-height: 30px;
    color: #666666;
    text-align: center;
    .font_W_600{
      font-weight: 700;
      color: #000000;
    }
  }
}
</style>
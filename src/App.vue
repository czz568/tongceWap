<template>
  <div id="app">
    <loading v-if="isLoading" :isLoading="isLoading"></loading>
    <top-header v-show="isshowTopHeader&&!wxFlag" :title="pOption.title"/>
    <router-view />
  </div>
</template>

<script>
import { mapAction,mapState } from 'vuex';
import TopHeader from '@/components/header/header.vue';
import loading from "@/components/loading/index.vue";
export default {
  name: 'App',
  components:{
    TopHeader,
    loading
  },
  data(){
    return{
      pOption:{},
      wxFlag:true,
      isshowTopHeader:false
    }
  },
  computed: {
        //获取vuex中的cityCode
        ...mapState({
            isLoading:state=>state.isLoading
        }),
    },
  created() {
        if(this.$tool.getStorage('M-token')){
          this.$store.dispatch('saveUserInfo',{Token:this.$tool.getStorage('M-token')});
        }
        this.$router.beforeResolve((to, from, next) => {
          this.setPageOption(to);
            next()
        })
        this.isWeixin()
        this.getStorageCity()
        this.checkChannel();
        this.baiduPosition();
  },
  mounted() {
    // 判断是否App端
    window['appPushToken'] = () => {
      this.isshowTopHeader = false
    };

  },
  methods:{
    setPageOption(to) { //设置头部名
        this.pOption = this.$pOption[to.name];
        if (typeof this.pOption.title === "function") {
          this.Title = document.title = this.pOption.title.call(this, to);
        } else {
          if (this.pOption.children) {
            this.pOption = this.pOption.children[to.params.children];
          }
          this.Title = document.title = this.pOption.title || "同策好房";
        }
        //判断是否展示头部组件
        if( this.pOption.name !=='Home' && this.pOption.name!=='search' && this.pOption.name !== 'houseList' && this.pOption.name !== 'videoPlayer'&& this.pOption.name !== 'error'){
          this.isshowTopHeader = true
        }else{
          this.isshowTopHeader = false
        }
      },
      isWeixin() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
          this.wxFlag = true;
          this.$store.dispatch('saveIsShowHead',false)
        } else {
          this.$store.dispatch('saveIsShowHead',true)
          this.wxFlag = false;
        }
      },
      checkChannel(){
         var ua = navigator.userAgent,
         isWindowsPhone = /(?:Windows Phone)/.test(ua),
         isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
         isAndroid = /(?:Android)/.test(ua),
         isFireFox = /(?:Firefox)/.test(ua),
         isChrome = /(?:Chrome|CriOS)/.test(ua),
         isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
         isPhone = /(?:iPhone)/.test(ua) && !isTablet,
         isPc = !isPhone && !isAndroid && !isSymbian;
         let os =  {
             isTablet: isTablet,
             isPhone: isPhone,
             isAndroid: isAndroid,
             isPc: isPc
         };	
        if (os.isTablet || os.isPc) {
          document.querySelector("html").style.width="750px";
          document.querySelector("html").style.margin="auto";
          document.querySelector("body").classList.add("pc")
          // let iWidth = document.documentElement.clientWidth;
	        // document.getElementsByTagName('html')[0].style.fontSize = 100 * iWidth / 750 + 'px'; 
        } 
      },
      //获取本地存储的定位城市
    getStorageCity(){
      let self = this;
      if(location.host.indexOf("dalian")>-1){
         this.$store.dispatch('saveCity',{code: "210200000",pinyinInitial:"D",title: "大连市"})
         this.$tool.setStorage({storageCity: JSON.stringify({code: "210200000",pinyinInitial:"D",title: "大连市"})})
         this.$tool.setSession({ischangeCity:true})
      }else if(this.$tool.getUrlParams('code') || this.$tool.getUrlParams('cityCode')){
        let code = this.$tool.getUrlParams('code') || this.$tool.getUrlParams('cityCode') ,title = this.$tool.getUrlParams('title') || this.$tool.getUrlParams('name');
           this.$store.dispatch('saveCity',{code,title})
           this.$tool.setStorage({storageCity: JSON.stringify({code,title})})
           this.$tool.setSession({ischangeCity:true});
           let host = location.hash.match(/\/(.+?)\?/);
           host = host?host[1]:"/"
           this.$router.replace({path:host})
      }
      else if(this.$tool.getStorage('storageCity')){
        let StorageCity = JSON.parse(this.$tool.getStorage('storageCity'));
        this.$store.dispatch('saveCity',StorageCity);
      }else{
        this.$store.dispatch('saveCity',{code: "310100000",pinyinInitial:"S",title: "上海市"})
        this.$tool.setStorage({storageCity: JSON.stringify({code: "310100000",pinyinInitial:"S",title: "上海市"})})
        this.$tool.setSession({ischangeCity:true})
      }
    },
    baiduPosition(){
     if(this.$tool.getUrlParams("hmsr")){
        this.$tool.setStorage({"hmsr":JSON.stringify({
           value:this.$tool.getUrlParams("hmsr"),
           time:new Date().getTime(),
           expires:24*60*60*1000
        })});
        this.$tool.setStorage({"hmpl":JSON.stringify({
          value:this.$tool.getUrlParams("hmpl"),
          time:new Date().getTime(),
          expires:24*60*60*1000
        })})
      }

    //站点追踪
        var bp = document.createElement('script');
        var curProtocol = window.location.protocol.split(':')[0];
        if (curProtocol === 'https') {
            bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';
        }
        else {
            bp.src = 'http://push.zhanzhang.baidu.com/push.js';
        }
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(bp, s);
    }
  }
}
</script>

<style>
 @import './common/css/reset.css';
#app{height: 100%;}
</style>

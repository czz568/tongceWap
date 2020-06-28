//当前是路由配置
import {api} from './apiOption.js'

// const getStepsEffect = function (to, from) {
//   let steps = this.userInfo.steps, isOld, verify;
//   if (!steps) return false;
//   verify = this.$pOption[to.name].verify || {};
//   if (!verify.wizard) return false;
//   isOld = this.isBeforeStep(from.name, {name: to.name});
//   return isOld ? "left" : 'right';
// };
const OPTION = [
  {
    path: '/',
    redirect: '/Home'
  },
  {
    title: "首页",
    path: '/Home',
    name: 'Home',
    component: () => import(/* webpackChunkName: "Home" */'@/views/Home/home.vue'),
  },
  {
    title: "登录",
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "Home" */'@/views/login/login.vue'),
  },
  {
    title: "楼盘列表",
    path: '/houseList',
    name: 'houseList',
    component: () => import(/* webpackChunkName: "Home" */'@/views/House/houseList.vue'),
  },
  {
    title: "楼盘详情页",
    path: '/houseDetail',
    name: 'houseDetail',
    component: () => import(/* webpackChunkName: "House" */'@/views/House/houseDetail.vue'),
  },
  {
    title: "商业贷款",
    path: '/calculator',
    name: 'calculator',
    component: () => import(/* webpackChunkName: "House" */'@/views/calculator/calculator.vue'),
  },
  // {
  //   title: "楼盘详情",
  //   path: '/houseDetails',
  //   name: 'houseDetails',
  //   component: () => import(/* webpackChunkName: "House" */'@/views/houseDetails/houseDetails.vue'),
  // },
  {
    title: "户型列表",
    path: '/houseTypeList/:buildingId',
    name: 'houseTypeList',
    component: () => import(/* webpackChunkName: "House" */'@/views/houseTypeList/houseTypeList.vue'),
  },
  {
    title: "户型详情",
    path: '/houseTypeDetails/:buildingId/:houseTypeId',
    name: 'houseTypeDetails',
    component: () => import(/* webpackChunkName: "Home" */'@/views/houseTypeDetails/houseTypeDetails.vue'),
  },
  {
    title: "楼盘动态",
    path: '/propertyDynamic/:buildingId',
    name: 'propertyDynamic',
    component: () => import(/* webpackChunkName: "Home" */'@/views/propertyDynamic/propertyDynamic.vue'),
  },
  {
    title: "优秀管家",
    path: '/majordomoList/:buildingId',
    name: 'majordomoList',
    component: () => import(/* webpackChunkName: "Home" */'@/views/majordomoList/majordomoList.vue'),
  },
  {
    title: "城市选择",
    path: '/cityPosition',
    name: 'cityPosition',
    component: () => import(/* webpackChunkName: "House" */'@/views/cityPosition/cityPosition.vue'),
  },
  {
    title: "我的卡券",
    path: '/myCard',
    name: 'myCard',
    component: () => import(/* webpackChunkName: "My" */'@/views/myCard/myCard.vue'),
  },
  {
    title: "资讯搜索",
    path: '/infoSearch',
    name: 'infoSearch',
    component: () => import(/* webpackChunkName: "Info" */'@/views/information/infoSearch.vue'),
  },
  {
    title: "资讯详情",
    path: '/infoDetail',
    name: 'infoDetail',
    component: () => import(/* webpackChunkName: "Info" */'@/views/infoDetail/infoDetail.vue'),
  },
  {
    title: "资讯",
    path: '/information',
    name: 'information',
    component: () => import(/* webpackChunkName: "Info" */'@/views/information/information.vue'),
  },
  {
    title: "搜索",
    path: '/search',
    name: 'search',
    component: () => import(/* webpackChunkName: "House" */'@/views/Home/search/index.vue'),
  },
  {
    title: "楼盘相册",
    path: '/housePhoto/:buildingId',
    name: 'housePhoto',
    component: () => import(/* webpackChunkName: "Home" */'@/views/housePhoto/housePhoto.vue'),
  },
  {
    title: "视频播放",
    path: '/videoPlayer',
    name: 'videoPlayer',
    component: () => import(/* webpackChunkName: "Home" */'@/views/housePhoto/newVideoPlayer.vue'),
  },
  {
    title: "周边配套",
    path: '/peripheral/:id',
    name: 'peripheral',
    component: () => import(/* webpackChunkName: "House" */'@/views/Peripheral/index.vue'),
  },
  {
    title: "404",
    path: '*',
    name: 'error',
    component: () => import(/* webpackChunkName: "House" */'@/views/errorTo404/index.vue'),
  },
]


const pageOption = function () {
  this.cache = OPTION;
};
pageOption.prototype.add = function (option) {
  this.cache.concat(option);
};
pageOption.prototype.getOption = function () {
  var option = {}, name;
  for (let i = 0; i < this.cache.length; i++) {
    if ((name = this.cache[i].name)) {
      option[name] = this.cache[i];
    }
  }
  return option;
};
const PO = new pageOption();


export const POInstall = {
  install(vue) {
    vue.prototype.$pOption = PO.getOption();
    vue.prototype.$api = api;
  },
};
export const pOption = PO.cache;

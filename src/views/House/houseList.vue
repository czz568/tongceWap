<!--  -->
<template>
    <div class='houseList' :style="{'paddingBottom':isShowFootAPP?'65px':'0'}">
        <!-- <span class="iconfont iconicon_point"></span>
        这是楼盘详情页 -->
        <van-sticky>
            <list-head class="head_mg_50" :cityposition='true' :showaction='true' :isDisabled='true' :searchValue='name' @goBacksearch="goBacksearch"></list-head>
            <Screen
                @screenChoose="screenChoose"
            ></Screen>
        </van-sticky>
        <house-content ref="houseList"></house-content>
        <foot :isShowStatement="false" @Newhouse='Newhouse'></foot>
        <!-- <message/> -->
        <foot-app @closeFootAPP="closeFootAPP" v-if="isShowFootAPP"></foot-app>

    </div>
</template>

<script>
import Vue from 'vue'
import ListHead from '@/views/Home/search/searchHeader.vue'
import houseContent from '@/views/House/houseContent'
import foot from '@/components/foot/foot'
import message from '@/components/msg/message'
import footApp from './footApp'
import Screen from "@/components/screen/screen.vue";
import { Sticky } from 'vant'
Vue.use(Sticky)
export default {
components: {
    ListHead,
    Screen,
    houseContent,
    foot,
    message,
    footApp,

},
data() {
return {
    name:this.$route.query.name,
    isShowFootAPP:true
};
},
computed: {},
watch: {},
methods: {
    goBacksearch(){
        this.$router.replace({
            path:'/search',
        })
    },
    screenChoose(data){
        console.log(96369,data);
        this.$refs.houseList.getSearchList(data,"new")
    },
    closeFootAPP(val){
        console.log(val)
        this.isShowFootAPP = val
    },
    //当前页点击上海新房
    Newhouse(){
        this.$refs.houseList.getSearchList()
    }
},
created() {
    console.log(this.$route.query)
},
mounted() {

},
}
</script>
<style lang='scss' scoped>
.houseList{
    background-color: #ffffff;
    /deep/.head_mg_50{
        .search{
            margin-right: 50px;
        }
    }
}
</style>

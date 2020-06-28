<!-- 去同策好房APP -->
<template>
<div class='Open_App'>
    <div class="App_main">
        <div>
            <p class="top_text">去同策好房APP</p>
            <p class="btm_text">获取更多一房一价楼盘</p>
        </div>
        <button class="open_now" @click="openApp">立即打开</button> 
        <i class="iconfont iconbtn_close close_btn" @click="closeApp"></i> 
    </div>
</div>
</template>

<script>
import Vue from 'vue';
import { Button } from 'vant'
Vue.use(Button);
export default {
components: {},
data() {
return {

};
},
computed: {},
watch: {},
methods: {
    closeApp(){
        this.$emit('closeFootAPP',false)
    },
    openApp(){
        console.log('打开APP')
        this.$tool.downloadIfWeixin()
        
    }
},
created() {

},
mounted() {

},
beforeCreate() {}, 
beforeMount() {}, 
beforeUpdate() {}, 
updated() {}, 
beforeDestroy() {}, 
destroyed() {},
activated() {}, 
}
</script>
<style lang='scss' scoped>
.Open_App{
    width: 100%;
    background:rgba(255,255,255,1);
    box-shadow:0px -8px 12px 0px rgba(0,0,0,0.05);
    padding: 12.5px 10px 12.5px 15px;
    position: fixed;
    bottom: 0;
    .App_main{
        padding: 1px 0;
        padding-left: 42.5px;
        background: url(../../assets/img/logo@2x.png) no-repeat;
        background-size: 35px 35px;
        height: 35px;
        display: flex;
        justify-content: space-between;
        position: relative;
        .top_text{
            line-height: 16px;
            font-size: 16px;
            color: #282828;
        }
        .btm_text{
            line-height: 11px;
            font-size: 11px;
            color: #999999;
            padding-top: 6px;
        }
        .open_now{
            color: #fff;
            border-radius: 30px;
            padding: 7.5px 15px;
            background-color: #00A4FF;
            border: 0;
            font-size: 15px;
            margin-right: 50px;
        }
        .close_btn{
            display: block;
            font-size: 11px;
            color: #D1D1D1;
            position: absolute;
            top: -4px;
            right: 25px;
        }
    }
    
}
</style>
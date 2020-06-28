<!-- 首页头部搜索框 -->
<template>
    <div class='search_header'>
        <div class="search">
            <i class="goback iconfont iconbtn_return" @click="goBack"></i>
            <div class="an_search_warp" @click="goBacksearch">
                <van-search
                    v-model="value"
                    :show-action='showaction'
                    placeholder="请输入楼盘或区域"
                    :clearable='false'
                    @input='handleChangeValue'
                    :disabled="isDisabled"
                    >
                    <template #action v-if="cityposition">
                        <div class="map" @click.stop="gotoChangeCity($event)"><van-icon size="14" name="location"/><span class="city_name">{{cityTitle}}</span></div>
                    </template>
                    <template #action v-else>
                        <div @click="onSearch">搜索</div>
                    </template>
                </van-search>

            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import { mapState } from 'vuex'
import { Search, Icon } from 'vant';
Vue.use(Search).use(Icon)
export default {
components: {},
data() {
return {
    value:this.searchValue
};
},
props:{
    showaction:{
        type:Boolean,
        default:()=>{
            return true
        }
    },
    isDisabled:{
        type:Boolean,
        default:()=>{
            return false
        }
    },
    searchValue:{
        type:String,
        default:()=>{
            return ''
        }
    },
    cityposition:{
        type:Boolean,
        default:()=>{
            return false
        }
    }
},
computed: {
    ...mapState({
        cityTitle:state=>state.city.title
    })
},
watch: {},
methods: {
    onSearch(){
            this.$router.push({
                path:'/houseList',
                query:{
                    name:this.value
                }
            })
            this.$emit('handleSearchBtn',this.value)
    },
    handleChangeValue(){
        this.$emit('input',this.value)
    },
    goBacksearch(){
        this.$emit('goBacksearch')
    },
    goBack(){
        if(this.cityposition){
            this.$router.go(-1)
        }else{
            this.$router.push({
                path:'/home',
            })
        }
    },
    gotoChangeCity(){
        this.$router.push({
            path:'/cityPosition',
        })
    },
},
created() {
    
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
    .search_header{
        display: flex;
        justify-content: space-between;
        height: 44px;
        background-color: #ffffff;
        width: 100%;
        .search{
            height: 30px;
            flex: 1;
            padding: 7px 10px 7px 0;
            position: relative;
            .van-search{
                width: 100%;
                padding: 0;
                height: 30px;
                border-radius: 16px;
                line-height: 14px;
                .van-cell{
                height: 30px;
                line-height: 21px;
                }
                .van-search__content{
                border-radius: 36px;
                width:275px;
                }
                .van-field__left-icon{
                height: 30px;
                line-height: 1;
                }
                .van-field__left-icon{
                line-height: 20px;
                }
                .van-field__body{
                height: 10px;
                line-height: 10px;
                .van-field__control{
                    height: 20px;
                    line-height: 20px;
                }
                }
            }
            .goback{
                position: absolute;
                left: 10px;
                width: 30px;
                height: 30px;
                text-align: center;
                line-height: 30px;
                display: inline-block;
            }
            .an_search_warp{
                padding-left: 50px;
                .van-search__action{
                    font-size: 14px;
                    color: #00A4FF;
                    padding: 0 2px 0 10px;
                }
                .map{
                    color: #000;
                    font-size: 16px;
                }
            }
        }
    }

</style>
<template>
  <div class="infoSearch">
    <van-search
      v-model="value"
      show-action
      placeholder="请输入搜索关键词"
      @input="onSearchChange"
      :autofocus='autoFlag'
      
    >
      <template #action>
        <div @click="onSearch" class="serBtn">搜索</div>
      </template>
    </van-search>
  </div>
</template>

<script>
import Vue from "vue";
import { Search } from "vant";
Vue.use(Search);
export default {
  components: {},
  props:['autoFlag'],
  data() {
    return {
      value: "",
      
    };
  },

  methods: {
    onSearchChange(){
      this.$emit("seVal", this.value);
    },
    onSearch() {
      this.$emit("seClick", this.value);
    }
  }
};
</script>
<style lang="scss" scoped>
.infoSearch {
  padding-top:12px;
  .serBtn {
    width: 64px;
    height: 44px;
    line-height: 44px;
    background-color: #00a4ff;
    color: #fff;
    font-size: 14px;
    text-align: center;
    border-radius: 4px;
  }
  /deep/.van-search__content {
    height: 44px;
    line-height: 44px;
    align-items: center;
    border-radius: 4px;
  }
  /deep/.van-search{
    padding-top:0;
    padding-bottom:0;
  }
}
</style>

<template>
  <div class="star">
    <div class="icon iconfont iconicon_share_star_normal" :class="{iconstar_gray: Number(star) > 0}"></div>
    <div class="icon iconfont iconicon_share_star_normal" :class="{iconstar_gray: Number(star) > 1}"></div>
    <div class="icon iconfont iconicon_share_star_normal" :class="{iconstar_gray: Number(star) > 2}"></div>
    <div class="icon iconfont iconicon_share_star_normal" :class="{iconstar_gray: Number(star) > 3}"></div>
    <div class="icon iconfont iconicon_share_star_normal" :class="{iconstar_gray: Number(star) > 4}"></div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        starNum: 0
      }
    },
    props: {
      star: {
        type: String,
        default: '0'
      }
    },
    computed: {
    },
    mounted() {
      console.log(this.star)
      // console.log(Number(this.star).toFixed(0))
      this.starNum = Number(this.star).toFixed(0);
    }
  }

</script>
<style lang="scss" scoped>
  .star{
    display: inline-block;
    vertical-align: top;
    padding: 0 5px;
    .iconfont{
      display: inline-block;
      color: #BCC4CA;
      &.iconstar_gray{
        color: #FFCC06;
      }
    }
  }
</style>

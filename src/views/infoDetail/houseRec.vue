<template>
  <div class="houseRec">
    <ul>
      <li class="list_item" v-for="item in hotListVal" :key="item.buildingId" @click="buildingClick(item)">
        <div class="list_item_warp">
          <div class="img_warp">
            <van-image lazy-load :show-loading="false" :src="item.albumCoverPicture"></van-image>
          </div>
          <div class="item_details">
            <p class="details_title">
              {{item.buildingName}}
              <span
                class="label cl_B"
              >{{$tool.propertyTypeFlag(item.propertyType)}}</span>
              <span class="label cl_Y">{{$tool.salesStatusFlag(item.salesStatus)}}</span>
            </p>

            <p
              class="price_details"
              v-if="(!item.referenceAveragePrice && !item.referenceAveragePriceMax)"
            >均价待定</p>
            <p class="price_details" v-else>
              <span v-show="item.referenceAveragePrice">{{item.referenceAveragePrice}}</span>
              <span v-show="(item.referenceAveragePrice && item.referenceAveragePriceMax)">~</span>
              <span v-show="item.referenceAveragePriceMax">{{item.referenceAveragePriceMax}}</span>
              <span class="price_unit">元/㎡</span>
            </p>
            <p class="address_details">
              {{item.areaName}}
              <span v-if="item.streetName">-</span>
              {{item.streetName}}
              建面约
              <span
                v-show="item.referenceBuildAreaMin"
              >{{item.referenceBuildAreaMin}}</span>
              <span v-show="(item.referenceBuildAreaMin && item.referenceBuildAreaMax)">-</span>
              <span v-show="item.referenceBuildAreaMax">{{item.referenceBuildAreaMax}}</span>㎡
            </p>
            <div class="classify">
              <p>
                <span>{{item.buildingBrightSpot}}</span>
              </p>
            </div>
          </div>
        </div>
        <p class="recommend_mess">
          <img class="recommend_mess_img" src="../../assets/img/icon_advantage@2x.png" alt />
          {{item.buildingBrightSpot}}
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
import Vue from "vue";
import { Image as VanImage, Lazyload, Toast } from "vant";
Vue.use(VanImage)
  .use(Lazyload)
  .use(Toast);

export default {
  components: {},
  props: ["hotList"],
  data() {
    return {
      hotListVal: this.hotList
    };
  },
  methods: {
    TagArr(str) {
      let buildingtagArr = [];
      if (str) {
        if (str.indexOf(",") == -1) {
          // buildingtagArr =  buildingtagArr.push(str)
          buildingtagArr[0] = str;
        } else {
          buildingtagArr = str.split(",");
        }
      } else {
        buildingtagArr = [];
      }
      return buildingtagArr;
    },
    buildingClick(item){
      window.location.href = window.location.protocol+"//"+window.location.host+"/dynamicPages/mstation/"+item.buildingId+".html";
      if (window.android != null) {
        window.android.goBuildingDetial(item.buildingId);
      } else {
        window.webkit.messageHandlers.goBuildingDetial.postMessage(item.buildingId);
      }
    }
    
  },
  watch: {
    //正确给 cData 赋值的 方法
    hotList: function(newVal, oldVal) {
      this.hotListVal = newVal;
      console.log("this.hotListVal");
      console.log(this.hotListVal);
    }
  },
  created() {}
};
</script>
<style lang="scss" scoped>
.houseRec {
  ul {
    li {
      padding: 20px 0;
      position: relative;
      &::after {
        position: absolute;
        box-sizing: border-box;
        content: " ";
        pointer-events: none;
        top: -50%;
        right: -50%;
        bottom: -50%;
        left: -50%;
        border-bottom: 0.026667rem solid #ebedf0;
        transform: scale(0.5);
      }
      
    }
  }
  ul li:last-child::after{
        content:none;
      }
}
.list_item_warp {
  display: flex;
  .img_warp {
    width: 105px;
    height: 85px;
    border-radius: 5px;
    overflow: hidden;
    .van-image {
      height: 100%;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .item_details {
    padding-left: 10px;
    flex: 1;
    .details_title {
      font-size: 16px;
      line-height: 20px;
      color: #333333;
      font-weight: 700;
      .label {
        border-radius: 2px;
        font-size: 10px;
        color: #ffffff;
        // width: 24px;
        padding: 2px 2px;
        height: 13px;
        display: inline-block;
        text-align: center;
        line-height: 13px;
        margin-left: 3px;
      }
      .cl_B {
        background-color: #00a4ff;
        margin-right: 4px;
        margin-left: 5px;
      }
      .cl_Y {
        background-color: #ff8252;
      }
    }

    .price_details {
      font-size: 16px;
      color: #ff664f;
      line-height: 15px;
      padding: 8px 0 7px 0;
      .price_unit {
        font-size: 10px;
        line-height: 15px;
        margin-left: 2px;
      }
    }

    .address_details {
      font-size: 12px;
      color: #666666;
      line-height: 12px;
      padding-bottom: 8px;
    }

    .classify {
      font-size: 10px;
      color: #999999;
      overflow-y: hidden;
      overflow-x: scroll;
      &::-webkit-scrollbar {
        display: none;
      }
      p {
        height: 100%;
        // width: 500px;
      }
      span {
        display: block;
        float: left;
        margin-right: 2px;
        margin-bottom: 2px;
        height: 15px;
        line-height: 15px;
        padding: 3px 4px;
        background-color: #f1f9ff;
        border-radius: 2px;
      }
    }
  }
}
.recommend_mess {
  margin: 10px 0 0 0;
  background-color: #fff9f3;
  color: #ed9371;
  font-size: 10px;
  height: 18px;
  line-height: 18px;
  display: inline-block;
  padding-right: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-radius: 10px;
  width: 90%;
  &_img {
    width: 14px;
    height: 14px;
    float: left;
    margin: 2px 4px 0 2px;
  }
}
</style>

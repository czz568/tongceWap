<template>
  <div class='app' @focusout="inputBlur" @focusin="inputFocus">
    <ScrollX class="navTabWrap" v-if="this.singlePageIndex === 0" direction="horizontal">
      <div class="tabList" :class="{'showTabCls': showTabCls}">
        <div class="item" v-for="(item, index) in tabList" :key="index" :class="{active: item.active}" @click="changeTab(item, index)" v-if="item.show">{{item.name}}</div>
      </div>
    </ScrollX>
    <div class="wrap">
      <div class="wrap0" v-if="showWrap0">
        <div class="topTxt">
          <div class="topBtn">
            <div class="topBtnItem" v-for="(item, index) in loanTypeList" @click="loanTypeChange(item)" :key="index" :class="{active: item.active}">
              {{item.name}}
            </div>
          </div>
          <div class="topTxt01">
            <div class="topTxt01_item">
              <span>每月月供参考(元)</span>
              <div class="priceDiv"><div class="f1">{{topLoanNum.repayments.left}}</div>. <div class="f2">{{topLoanNum.repayments.right}}</div></div>
            </div>
            <div class="topTxt01_item" v-show="loanData.loanType === 2">
              <span>每月递减(元)</span>
              <div class="priceDiv"><div class="f1">{{topLoanNum.abatement.left}}</div>. <div class="f2">{{topLoanNum.abatement.right}}</div></div>
            </div>
          </div>
          <div class="topTxt02">
          <span class="topTxt02_item">
            <span>支付利息(元)</span>
            <div class="priceDiv"><div class="f1">{{topLoanNum.interest.left}}</div>. <div class="f2">{{topLoanNum.interest.right}}</div></div>
          </span>
            <span class="topTxt02_item">
            <span>还款总额(元)</span>
            <div class="priceDiv"><div class="f1">{{topLoanNum.totalRepayment.left}}</div>. <div class="f2">{{topLoanNum.totalRepayment.right}}</div></div>
          </span>
          </div>
        </div>
        <div class="iptWrap">
          <div class="iptScroll">
            <div class="iptItem border_1px">
              <div class="tit">计算方式</div>
              <div class="ipt rigArr" @click="selType">{{typeList.txt}} <i class="iconfont iconbtn_arrow"></i></div>
            </div>
            <div class="iptItem border_1px" v-show="typeList.value === 2">
              <div class="tit">房屋总价(万)</div>
              <div class="ipt"><input type="text" placeholder="请输入金额" v-model="loanData.total"></div>
            </div>
            <div class="iptItem border_1px" v-show="typeList.value === 2">
              <div class="tit">贷款比例</div>
              <div class="ipt rigArr" @click="selRatio">{{ratioList.txt}} <i class="iconfont iconbtn_arrow"></i></div>
            </div>
            <div class="iptItem border_1px" v-show="tabIndex !== 2">
              <div class="tit">贷款总额(万)</div>
              <div class="ipt"><input type="text" placeholder="请输入金额" v-model="loanData.loanTotal"></div>
            </div>
            <div class="iptItem border_1px">
              <div class="tit">贷款年限(年)</div>
              <div class="ipt rigArr" @click="selYear">{{yearList.txt}} <i class="iconfont iconbtn_arrow"></i></div>
            </div>
            <div class="iptItem border_1px" v-show="tabList[1].wrap || tabList[2].wrap">
              <div class="tit">公积金年利率</div>
              <div class="ipt rigArr" @click="selFundRate">{{fundRateList.txt}} <i class="iconfont iconbtn_arrow"></i></div>
            </div>
            <div class="iptItem border_1px" v-show="tabList[2].wrap">
              <div class="tit">公积金贷款金额(万)</div>
              <div class="ipt"><input type="text" placeholder="请输入金额" v-model="loanData.fundTotal"></div>
            </div>
            <div class="iptItem border_1px" v-show="tabList[0].wrap || tabList[2].wrap">
              <div class="tit">商贷年利率</div>
              <div class="ipt rigArr" @click="selRate">{{rateList.txt}} <i class="iconfont iconbtn_arrow"></i></div>
            </div>
            <div class="iptItem border_1px" v-show="tabList[2].wrap">
              <div class="tit">商业贷款金额(万)</div>
              <div class="ipt"><input type="text" placeholder="请输入金额"  v-model="loanData.rateTotal"></div>
            </div>
            <div class="iptTip">贷款利率仅供计算使用，实际交易利率细则由银行评估</div>
          </div>
        </div>
      </div>
      <div class="wrap3" v-if="tabList[3].wrap">
        <div class="topTxt">
          <div class="topTxt02">
          <span class="topTxt02_item">
            <span>房屋总价(元)</span>
            <div class="priceDiv"><div class="f1">{{topAbilityNum.total.left}}</div>. <div class="f2">{{topAbilityNum.total.right}}</div></div>
          </span>
            <span class="topTxt02_item">
            <span>房屋单价(元/m²)</span>
            <div class="priceDiv"><div class="f1">{{topAbilityNum.price.left}}</div>. <div class="f2">{{topAbilityNum.price.right}}</div></div>
          </span>
          </div>
        </div>
        <div class="iptWrap">
          <div class="iptScroll">
            <div class="iptItem border_1px">
              <div class="tit">现有首付金额(万)</div>
              <div class="ipt"><input type="text" placeholder="请输入金额" v-model="abilityData.payment"></div>
              <div class="iptItemTip">(可用于购房的现金、存款和筹借资金等的总和)</div>
            </div>
            <div class="iptItem border_1px">
              <div class="tit">每月购房支出(元)</div>
              <div class="ipt"><input type="text" placeholder="请输入金额" v-model="abilityData.loan"></div>
              <div class="iptItemTip">(建议每月还贷金额不要超过月收入的50%)</div>
            </div>
            <div class="iptItem border_1px">
              <div class="tit">期望贷款年限(年)</div>
              <div class="ipt rigArr" @click="selAbilityYear">{{abilityYearList.txt}}<i class="iconfont iconbtn_arrow"></i></div>
            </div>
            <div class="iptItem border_1px">
              <div class="tit">期望购房面积(m²)</div>
              <div class="ipt"><input type="text" placeholder="请输入面积" v-model="abilityData.size"></div>
            </div>
            <div class="iptTip">该评估结果按照同策好房自有模型估算，结果仅供参考！</div>
          </div>
        </div>
      </div>
      <div class="wrap4" style="display:none;">
        <div class="topTxt">
          <div class="topTxt01">
            <div class="topTxt01_item">
              <span>税费合计(元)</span>
              <div class="priceDiv"><div class="f1">{{topTaxationNum.total.left}}</div>. <div class="f2">{{topTaxationNum.total.right}}</div></div>
            </div>
            <div class="topTxt01_item">
              <span>契税(元)</span>
              <div class="priceDiv"><div class="f1">{{topTaxationNum.deedTax.left}}</div>. <div class="f2">{{topTaxationNum.deedTax.right}}</div></div>
            </div>
          </div>
          <div class="topTxt02">
          <span class="topTxt02_item">
            <span>维修基金(元)</span>
            <div class="priceDiv"><div class="f1">{{topTaxationNum.maintenanceFund.left}}</div>. <div class="f2">{{topTaxationNum.maintenanceFund.right}}</div></div>
          </span>
            <span class="topTxt02_item">
            <span>权属登记费(元)</span>
            <div class="priceDiv"><div class="f1">{{topTaxationNum.ownership.left}}</div>. <div class="f2">{{topTaxationNum.ownership.right}}</div></div>
          </span>
          </div>
        </div>
        <div class="iptWrap">
          <div class="iptScroll">
            <div class="iptItem border_1px">
              <div class="tit">住宅类型</div>
              <div class="ipt rigArr" @click="selHousingType">{{housingTypeList.txt}} <i class="iconfont iconbtn_arrow"></i></div>
            </div>
            <div class="iptItem border_1px">
              <div class="tit">房屋面积(m²)</div>
              <div class="ipt"><input type="text" placeholder="请输入面积" v-model="taxationData.size"></div>
            </div>
            <div class="iptItem border_1px">
              <div class="tit">房屋总价(万)</div>
              <div class="ipt"><input type="text" placeholder="请输入金额" v-model="taxationData.total"></div>
            </div>
            <div class="iptItem border_1px">
              <div class="tit">是否首次购房</div>
              <div class="ipt">
                <van-switch v-model="taxationData.first" />
              </div>
            </div>
            <div class="iptTip">以上结果仅供参考，具体以实际缴纳金额为准。</div>
          </div>
        </div>
      </div>
    </div>
    <!-- <ul class='tabs'>
            <li class='tab-list'>web前端</li>
            <li class='tab-list'>web前端</li>
            <li class='tab-list'>web前端</li>
            <li class='tab-list'>web前端</li>
            <li class='tab-list'>web前端</li>
            <li class='tab-list'>web前端</li>
            <li class='tab-list'>web前端</li>
            <li class='tab-list'>web前端</li>
        </ul>
        <div>我是内容</div> -->
  </div>
</template>
<script>
  import Vue from 'vue';
  import { Switch } from 'vant'
  Vue.use(Switch);

  // import 'cube-ui/lib/cube.min.css';

  // import * as Picker from 'cube-ui' 
  // Vue.use(Picker)


  // import { Picker } from 'cube-ui'
 
  import Cube from 'cube-ui' // 一般直接放在这个位置
  Vue.use(Cube)



  // import Scroll from '../../components/scroll/scroll';
  import ScrollX from '../../components/scroll/scroll_x';
  import { debounce, deepCopy, setTitle, urlParse } from '../../common/js/util.js';
  import { calculate, MoneyFormat } from './toolCalc.js';
  import { mapActions, mapGetters } from 'vuex';
  export default {
    data () {
      return {
        showTabCls: false,
        singlePageIndex: 0,
        tabIndex: 0,
        topLoanNum: {
          repayments: {
            left: '0',
            right: '00'
          },
          abatement: {
            left: '0',
            right: '00'
          },
          interest: {
            left: '0',
            right: '00'
          },
          totalRepayment: {
            left: '0',
            right: '00'
          }
        },
        topTaxationNum: {
          total: {
            left: '0',
            right: '00'
          },
          deedTax: {
            left: '0',
            right: '00'
          },
          maintenanceFund: {
            left: '0',
            right: '00'
          },
          ownership: {
            left: '0',
            right: '00'
          }
        },
        topAbilityNum: {
          total: {
            left: '0',
            right: '00'
          },
          price: {
            left: '0',
            right: '00'
          }
        },
        tabList: [
          {name: '商业贷款', active: true, wrap: true, value: 1, show: true},
          {name: '公积金贷款', active: false, wrap: false, value: 2, show: true},
          {name: '组合贷款', active: false, wrap: false, value: 3, show: true},
          {name: '购房能力评估', active: false, wrap: false, value: 4, show: true}
          // {name: '税费计算', active: false, wrap: false, value: 5, show: true}
        ],
        curTab: 1,
        loanTypeList: [
          {name: '等额本息', active: true, value: 1},
          {name: '等额本金', active: false, value: 2}
        ],
        loanData: {
          comprise: 1, // 贷款方式： 1商业贷款；2公积金贷款；3组合贷款
          loanType: 1, // 1为等额本息   2为等额本金
          total: '', // 房屋总价
          ratio: 4.9, // 贷款比例
          loanTotal: this.$route.query.loanTotal, // 贷款总额
          year: 30, // 贷款年限
          fundRate: 3.25, // 公积金年利率
          fundTotal: '', // 公积金贷款金额
          rate: 4.9, // 商贷年利率
          rateTotal: '', // 商业贷款金额
          calculationTheWay: 1
        },
        taxationData: {
          type: 1, // 住宅类型 1为普通住宅   2为非普通住宅
          size: '', // 房屋面积
          total: '', // 房屋总价
          first: true // 是否为首套房
        },
        abilityData: {
          payment: '', // 首付支出
          loan: '', // 贷款支出
          year: 20, // 贷款年限
          size: '' // 期望购房面积
        },
        typeList: {
          value: 1,
          txt: '贷款总额',
          show: false,
          list: [
            {value: 1, text: '贷款总额'},
            {value: 2, text: '房屋总价'}
          ]
        },
        yearList: {
          value: 30,
          txt: '30',
          show: false,
          list: [
            {value: 30, text: '30年'},
            {value: 25, text: '25年'},
            {value: 20, text: '20年'},
            {value: 15, text: '15年'},
            {value: 10, text: '10年'},
            {value: 5, text: '5年'}
          ]
        },
        abilityYearList: {
          value: 20,
          txt: '20年(240期) ',
          show: false,
          list: []
        },
        rateList: {
          value: 4.9,
          txt: '4.9%',
          show: false,
          list: [
            {value: 3.43, text: '7折'},
            {value: 3.68, text: '7.5折'},
            {value: 3.92, text: '8折'},
            {value: 4.17, text: '8.5折'},
            {value: 4.41, text: '9折'},
            {value: 4.655, text: '9.5折'},
            {value: 4.9, text: '最新基准率'},
            {value: 5.15, text: '1.05倍'},
            {value: 5.39, text: '1.1倍'},
            {value: 5.88, text: '1.2倍'},
            {value: 6.37, text: '1.3倍'}
          ]
        },
        ratioList: {
          value: 3,
          txt: '3成',
          list: [
            {value: 1, text: '1成'},
            {value: 2, text: '2成'},
            {value: 3, text: '3成'},
            {value: 4, text: '4成'},
            {value: 5, text: '5成'},
            {value: 6, text: '6成'},
            {value: 7, text: '7成'},
            {value: 8, text: '8成'},
            {value: 9, text: '9成'}
          ]
        },
        fundRateList: {
          value: 3.25,
          txt: '3.25%',
          list: [
            {value: 3.25, text: '最新基准利率'},
            {value: 3.58, text: '1.1倍'},
            {value: 3.9, text: '1.2倍'}
          ]
        },
        housingTypeList: {
          value: 1,
          txt: '普通住宅',
          list: [
            {value: 1, text: '普通住宅'},
            {value: 2, text: '非普通住宅'}
          ]
        }
      };
    },
    computed: {
      showWrap0() {
        return this.tabList[0].wrap || this.tabList[1].wrap || this.tabList[2].wrap
      },
      ...mapGetters([
        'loanDataV'
      ])
    },
    components: {
      // Scroll,
      ScrollX,
      // Picker
    },
    created () {
      this.calcLoanData()
      setTitle('商业贷款');
      // queryByCityCode({'cityCode': '310100000'}).then(data => {
      //   this.yearList.list = data.loanTerm;
      //   this.ratioList.list = data.paymentRatio;
      //   this.rateList.list = data.bankRate;
      // });
      // 获取单页面
      this.singlePageIndex = urlParse().sp ? urlParse().sp : 0
      if (this.singlePageIndex !== 0) {
        let item = this.tabList[this.singlePageIndex]
        this.changeTab(item, this.singlePageIndex)
      } else {
        this.tabList[3].show = false;
      }

      // this.normalTabList()
      // console.log(this.singlePageIndex)

      for (let i = 1; i < 31; i++) {
        let curMonth = i * 12
        this.abilityYearList.list.push({
          value: i,
          text: i + '年 ' + '(' + curMonth + '期)'
        })
      }
      this.loanDataCache = deepCopy(this.loanData)
      const _this = this
      // 房屋总价
      this.$watch('loanData.total', debounce((newQuery) => {
        _this.calcLoanData();
      }, 200))
      // 贷款总额
      this.$watch('loanData.loanTotal', debounce((newQuery) => {
        _this.calcLoanData();
      }, 200))
      // 公积金贷款金额
      this.$watch('loanData.fundTotal', debounce((newQuery) => {
        _this.calcLoanData();
      }, 200))
      // 商业贷款金额
      this.$watch('loanData.rateTotal', debounce((newQuery) => {
        _this.calcLoanData();
      }, 200))
      // 房屋总价
      this.$watch('loanData.total', debounce((newQuery) => {
        _this.calcRatioLoan();
      }, 200))
      // 税费计算
      this.$watch('taxationData.total', debounce((newQuery) => {
        _this.calcTaxation();
      }, 200))
      this.$watch('taxationData.size', debounce((newQuery) => {
        _this.calcTaxation();
      }, 200))
      this.$watch('taxationData.first', debounce((newQuery) => {
        _this.calcTaxation();
      }, 200))
      // 购房能力计算
      this.$watch('abilityData.payment', debounce((newQuery) => {
        _this.calcAbility();
      }, 200))
      this.$watch('abilityData.loan', debounce((newQuery) => {
        _this.calcAbility();
      }, 200))
      this.$watch('abilityData.size', debounce((newQuery) => {
        _this.calcAbility();
      }, 200))
    },
    methods: {
       inputBlur(e) {
        // 首先，判断触发事件的目标元素是否是input输入框，我们只关注输入框的行为。
        if (e && e.target && e.target.tagName && e.target.tagName.toLowerCase() === 'input') {
            // 输入框失去焦点，要把iOS键盘推出页面的滚动部分还原。即将页面滚动到视窗顶部对齐
            console.log('设置timer')
            this.timer = setTimeout(() => {
                console.log('timer触发')
                window.scrollTo(0,0);
            }, 0)
        }
      },
      inputFocus(e) {
            // 如果focus，则移除上一个输入框的timer
          if (e && e.target && e.target.tagName && e.target.tagName.toLowerCase() === 'input') {
              clearTimeout(this.timer);
          }
      },
      normalTabList() {
        this.tabList.forEach((arrItem) => {
          arrItem.active = false
          arrItem.wrap = false
        });
      },
      changeTab(item, index) {
        setTitle(item.name)
        this.tabIndex = index
        this.normalTabList();
        item.active = true;
        item.wrap = true;
        this.loanData.comprise = this.curTab = item.value
        this.loanData.loanType = 1
        if (Number(index) === 2) {
          // console.log(1111);
          this.loanData.loanTotal = ''
        }
        if (this.curTab === 1 || this.curTab === 2 || this.curTab === 3) {
          this.calcLoanData()
        }
        //  切换标签，若当前没有计算过，用初始缓存的数据
      },
      loanTypeChange(item) {
        this.loanTypeList.forEach((arrItem) => {
          arrItem.active = false
        });
        item.active = true
        this.loanData.loanType = item.value
        this.calcLoanData()
      },
      // 计算方式切换
      selType() {


        if (!this.typePicker) {
          this.typePicker = this.$createPicker({
            title: '计算方式',
            data: [this.typeList.list],
            onSelect: this.selTypeOk
          });
        }
        this.typePicker.show();
      },
      selTypeOk(selectedVal, selectedIndex, selectedText) {
        this.typeList.value = selectedVal[0]
        this.loanData.calculationTheWay = selectedVal[0]
        this.typeList.txt = selectedText[0]
        this.calcLoanData()
      },
      // 切换年限
      selYear() {
        if (!this.yearPicker) {
          this.yearPicker = this.$createPicker({
            title: '贷款年限',
            data: [this.yearList.list],
            onSelect: this.selYearOk
          });
        }
        this.yearPicker.show();
      },
      selYearOk(selectedVal, selectedIndex, selectedText) {
        this.loanData.year = this.yearList.value = selectedVal[0]
        this.yearList.txt = selectedVal[0]
        this.calcLoanData()
      },
      //  切换商业利率
      selRate() {
        if (!this.ratePicker) {
          this.ratePicker = this.$createPicker({
            title: '贷款年利率',
            data: [this.rateList.list],
            onSelect: this.selRateOk
          });
        }
        this.ratePicker.show();
      },
      selRateOk(selectedVal, selectedIndex, selectedText) {
        this.loanData.rate = this.rateList.value = selectedVal[0]
        this.rateList.txt = selectedVal[0] + '%'
        this.calcLoanData()
      },
      //  切换贷款比例
      selRatio() {
        if (!this.ratioPicker) {
          this.ratioPicker = this.$createPicker({
            title: '贷款比例',
            data: [this.ratioList.list],
            onSelect: this.selRatioOk
          });
        }
        this.ratioPicker.show();
      },
      selRatioOk(selectedVal, selectedIndex, selectedText) {
        this.loanData.ratio = this.ratioList.value = selectedVal[0]
        this.ratioList.txt = selectedText[0]
        this.calcRatioLoan()
      },
      // 根据房屋总价计划贷款
      calcRatioLoan() {
        if (this.loanData.total !== 0) {
          this.loanData.loanTotal = (this.loanData.total * (this.loanData.ratio / 10)).toFixed(2);
          this.calcLoanData()
        }
      },
      //  切换公积金贷款比例
      selFundRate() {
        if (!this.fundRatePicker) {
          this.fundRatePicker = this.$createPicker({
            title: '公积金贷款',
            data: [this.fundRateList.list],
            onSelect: this.selFundRateOk
          });
        }
        this.fundRatePicker.show();
      },
      selFundRateOk(selectedVal, selectedIndex, selectedText) {
        this.loanData.fundRate = this.fundRateList.value = selectedVal[0]
        this.fundRateList.txt = selectedVal[0] + '%'
        this.calcLoanData()
      },
      // 计算贷款
      calcLoanData() {
        console.log(this.loanData)
        let data = calculate(this.loanData)
        console.log(data)
        let saveData = {
          loanData: this.loanData,
          endValue: data
        }
        console.log(saveData)
        console.log('saveData')
        let copyData = deepCopy(saveData);
        this.saveLoanDataRtn(copyData);
        this.topLoanNum.repayments = data.repayments
        this.topLoanNum.abatement = data.abatement
        this.topLoanNum.interest = data.interest
        this.topLoanNum.totalRepayment = data.totalRepayment
      },
      // 选择住宅类型
      selHousingType() {
        if (!this.housingTypePicker) {
          this.housingTypePicker = this.$createPicker({
            title: '住宅类型',
            data: [this.housingTypeList.list],
            onSelect: this.selHousingTypeOk
          });
        }
        this.housingTypePicker.show();
      },
      selHousingTypeOk(selectedVal, selectedIndex, selectedText) {
        this.taxationData.type = this.housingTypeList.value = selectedVal[0]
        this.housingTypeList.txt = selectedText[0]
        this.calcTaxation()
      },
      // 选择贷款期数
      selAbilityYear() {
        if (!this.abilityYearPicker) {
          this.abilityYearPicker = this.$createPicker({
            title: '期望贷款年限',
            data: [this.abilityYearList.list],
            onSelect: this.selAbilityYearOk
          });
        }
        this.abilityYearPicker.show();
      },
      selAbilityYearOk(selectedVal, selectedIndex, selectedText) {
        this.abilityData.year = this.abilityYearList.value = selectedVal[0]
        this.abilityYearList.txt = selectedText[0]
        this.calcAbility()
      },
      // 计算税费
      calcTaxation() {
        // 计算房屋总价
        let totalHouse = this.taxationData.total * 10000;
        // 计算维修基金
        let maintenanceFund = totalHouse * 0.03;
        // 计算契税
        let deedTax = 0;
        if (this.taxationData.type === 1) {
          if (this.taxationData.first) {
            if (this.taxationData.size < 90) {
              deedTax = totalHouse * 0.01;
            } else if (this.taxationData.size >= 90 && this.taxationData.size < 140) {
              deedTax = totalHouse * 0.015;
            } else {
              deedTax = totalHouse * 0.03;
            }
          } else {
            deedTax = totalHouse * 0.015;
          }
        } else {
          deedTax = totalHouse * 0.03;
        }
        // 计算税费总价
        let total = deedTax + maintenanceFund + 80;
        this.topTaxationNum.ownership.left = 80
        this.topTaxationNum.total = MoneyFormat(total)
        this.topTaxationNum.deedTax = MoneyFormat(deedTax)
        this.topTaxationNum.maintenanceFund = MoneyFormat(maintenanceFund)
      },
      // 计算购房能力
      calcAbility() {
        // A = 现有首付金额/30%；
        // 其中：i：当前对应贷款年限的月利率；
        // n：当前贷款期限的月数；
        // 如果A>=B，则，房屋总价=B；
        // 如果A<B，则，房屋总价 = A
        // B = 现有首付金额+每月购房支出*(（1+i）^n -1)/(i*(1+i)^n)
        if (!this.abilityData.payment || !this.abilityData.size || !this.abilityData.loan) {
          return false;
        }
        let rate = 0.049
        if (this.abilityData.year === 1) {
          rate = 0.0435
        } else if (this.abilityData.year > 1 && this.abilityData.year <= 5) {
          rate = 0.0475
        }
        rate = rate / 12
        let months = this.abilityData.year * 12
        let totalA = this.abilityData.payment * 10000 / 0.3
        console.log('months::' + months)
        console.log('rate::' + rate)
        console.log('this.abilityData.loan::' + this.abilityData.loan)
        let rate1 = 1 + rate
        let months1 = months - 1
        console.log('rate1::' + rate1)
        console.log('months1::' + months1)
        // let totalB = this.abilityData.payment * 10000 + this.abilityData.loan * (Math.pow(1 + rate, months - 1)) / (rate * Math.pow(1 + rate, months))
        let totalB = this.abilityData.payment * 10000 + this.abilityData.loan * (Math.pow(rate1, months1)) / (rate * Math.pow(rate1, months))
        let total = totalA >= totalB ? totalB : totalA
        let price = total / this.abilityData.size
        console.log('totalA:::' + totalA)
        console.log('totalB:::' + totalB)
        console.log('total:::' + total)
        this.topAbilityNum.total = MoneyFormat(total)
        this.topAbilityNum.price = MoneyFormat(price)
      },
      ...mapActions([
        'saveLoanDataRtn'
      ])
    },
    watch: {
      loanDataV(newVal) {
        this.loanData = newVal;
        this.tabList[3].show = false;
        // this.tabList[4].show = false;
      }
    }
  }

</script>
<style lang="scss">
  .cube-picker-choose{
    height: 44px;
    .cube-picker-cancel{
      height: 44px;
      line-height: 44px;
      font-size: 16px;
    }
    .cube-picker-confirm{
      color: #00A5FF;
      height: 44px;
      line-height: 44px;
      font-size: 16px;
    }
  }
</style>
<style lang="scss" scoped >
  .app{
    width: 100%;
    // height: 100%;
    background-color: #fff;
  }
  .navTabWrap {
    width: 100%;
    //  left: 12px;
    //  right: 12px;
    display: inline-block;
    position: relative;
    .tabList{
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      white-space: nowrap;
      line-height: 40px;
      padding-left: 12px;
      padding-right: 12px;
      color: #333333;
      &.showTabCls{
        .item {
          width: 33%;
        }
      }
      .item{
        width: auto;
        padding-left: 12px;
        padding-right: 12px;
        display: inline-block;
        &.active{
          color: #00A5FF;
          position: relative;
          &:before{
            content: ' ';
            position: absolute;
            bottom: 3px;
            border-radius: 20px;
            background: #00A5FF;
            width: 14px;
            height: 4px;
            left: 50%;
            margin-left: -7px;
          }
        }
      }
    }
  }
  .topTxt{
    background-color: #00A4FF;
    text-align: left;
    color: #fff;
    height: auto;
    overflow: hidden;
    // padding-bottom: 40px;
    .topTxt01{
      padding-top: 25px;
      padding-bottom: 22px;
      height: auto;
      overflow: hidden;
      .topTxt01_item{
        width: 50%;
        box-sizing: border-box;
        float: left;
        padding-left: 24px;
        &:last-child{
          padding-top: 5px;
          padding-left: 12px;
          .priceDiv{
            .f1{
              font-size: 18px;
            }
            .f2{
              font-size: 11px;
            }
          }
        }
        span{
          font-size: 13px;
          padding-bottom: 10px;
          display: block;
        }
        .priceDiv{
          font-size: 14px;
          display: inline-block;
          .f1{
            display: inline-block;
            font-size: 25px;
          }
          .f2{
            display: inline-block;
            font-size: 15px;
          }
        }
      }
    }
    .topTxt02{
      position: relative;
      height: auto;
      padding-bottom: 22px;
      overflow: hidden;
      clear: both;
      &:before{
        position: absolute;
        content: ' ';
        height: 35px;
        width: 1px;
        top: 0;
        left: 50%;
        background: rgba(255, 255,255, 0.4);
      }
      .topTxt02_item{
        width: 50%;
        box-sizing: border-box;
        float: left;
        padding-left: 24px;
        &:last-child{
          padding-left: 12px;
        }
        span{
          font-size: 13px;
          padding-bottom: 9px;
          display: block;
        }
        .priceDiv{
          font-size: 13px;
          display: inline-block;
          .f1{
            display: inline-block;
            font-size: 18px;
          }
          .f2{
            display: inline-block;
            font-size: 11px;
          }
        }
      }
    }
  }
  .iptWrap{
    // position: fixed;
    // bottom: 0;
    width: 100%;
    background: #fff;
    box-shadow:0px -4px 20px 0px rgba(0,0,0,0.06);
    overflow: hidden;
    max-width: 750PX;/*no*/
      margin:0 auto;
    .iptScroll{
      width: 100%;
      // position: fixed;
      // bottom: 0;
      max-width: 750PX;/*no*/
      margin:0 auto;
      .iptItem{
        display: flex;
        font-size: 16px;
        line-height: 50px;
        margin: 0 24px;
        color: #222222;
        border-bottom: 1px solid #EEEEEE;
        .tit{
          flex: 0 0 120px;
          width: 120px;
        }
        .ipt{
          flex: 1;
          text-align: right;
          input{
            text-align: right;
            padding-right: 20px;
            width: 100%;
            box-sizing: border-box;
            color: #C8CAD6;
            background-color: transparent;
            color: #222;
          }
          .iconfont{
            width: 20px;
            text-align: right;
            font-size: 12px;
            float: right;
            line-height: 50px;
            vertical-align: top;
            color: #D7D4D7;
          }
          .cube-switch{
            float: right;
            margin-top: 10px;
          }
        }
      }
      .iptTip{
        font-size: 13px;
        padding: 14px 24px;
        line-height: 24px;
        color: #888888;
      }
    }
  }
  .topBtn{
    width: 210px;
    height: 30px;
    line-height: 30px;
    background: #fff;
    margin: 0 auto;
    box-shadow:0px 2px 8px 0px rgba(0,0,0,0.05);
    border-radius:0px 0px 22px 22px;
    clear: both;
    position: relative;
    &:before{
      content: ' ';
      background: #C8C8C7;
      width: 1px;
      height: 13px;
      position: absolute;
      top: 8px;
      left: 50%;
    }
    .topBtnItem{
      font-size: 15px;
      width: 50%;
      float: left;
      color: #6A6F70;
      text-align: center;
    }
    .active{
      color: #00A5FF;
    }
  }
  .wrap0{
    .tit{
      flex: 0 0 180px!important;
      width: 180px!important;
    }
  }
  .wrap3{
    .topTxt{
      padding-top: 35px;
      padding-bottom: 40px;
    }
    .tit{
      flex: 0 0 140px!important;
      width: 140px!important;
    }
    .iptItem{
      flex-direction: row;
      flex-wrap: wrap;
    }
    .iptItemTip{
      font-size: 12px;
      display: inline-block;
      color: #FF8252;
      background: #FFF3EE;
      padding:0 7px;
      margin-top: -5px;
      margin-bottom: 4px;
      border-radius: 10px;
      line-height: 20px;
      position: relative;
      &:before{
        width: 0;
        height: 0;
        content: ' ';
        position: absolute;
        border-style: solid;
        border-width: 5px;
        border-color: transparent transparent #FFF3EE transparent;
        top: -10px;
        left: 35px;
      }
    }
  }
  .wrap0 .iptWrap{top: 230px;}
  .wrap0 .iptScroll{top: 240px;}
  .wrap1 .iptWrap{top: 230px;}
  .wrap1 .iptScroll{top: 240px;}
  .wrap2 .iptWrap{top: 230px;}
  .wrap2 .iptScroll{top: 240px;}
  .wrap3 .iptWrap{top: 140px;}
  .wrap3 .iptScroll{top: 150px;}
  .wrap4 .iptWrap{top: 200px;}
  .wrap4 .iptScroll{top: 210px;}
</style>
<style>
    *{ margin: 0; padding: 0; box-sizing: border-box; }
    body{ background-color: #f9f9f9; }
    ul,li{ list-style: none; }
    .tabs{
        width: 100%;
        overflow-x: scroll;
        display: -webkit-box;
        display: flex;
        -webkit-flex-wrap:nowrap;
        flex-wrap:nowrap;
        -webkit-justify-content:space-between;
        justify-content:space-between;
    }
    .tab-list{
        padding: 0 10px;
        text-align: center;
        -webkit-flex:1 0 auto;
        flex:1 0 auto;
    }

    </style>


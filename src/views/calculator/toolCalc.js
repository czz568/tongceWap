/**
 * 本息还款的月还款额
 * @param lilv 年利率
 * @param total 贷款总额
 * @param month 贷款总月份
 * @returns {number}
 */
const getMonthMoney1 = function (lilv, total, month) {
    let lilvMonth = lilv / 12; // 月利率
    return total * lilvMonth * Math.pow(1 + lilvMonth, month) / (Math.pow(1 + lilvMonth, month) - 1);
};

/**
 * 本金还款的月还款额
 * @param lilv 年利率
 * @param total 贷款总额
 * @param month 贷款总月份
 * @param curMonth 贷款当前月0～length-1
 * @returns {number}
 */
const getMonthMoney2 = function (lilv, total, month, curMonth) {
    let lilvMonth = lilv / 12; // 月利率
    let benjinMoney = total / month;
    return (total - benjinMoney * curMonth) * lilvMonth + benjinMoney;
};

export function MoneyFormat(money) {
  if (money && money != null) {
    money = String(money);
    let left = money.split('.')[0];
    let right = money.split('.')[1];
    right = right ? (right.length >= 2 ? right.substr(0, 2) : right + '0') : '00';
    let temp = left.split('').reverse().join('').match(/(\d{1,3})/g);
    // console.log((Number(money) < 0 ? '-' : '') + temp.join(',').split('').reverse().join('') + '.' + right)
    return {
      left: (Number(money) < 0 ? '-' : '') + temp.join(',').split('').reverse().join(''),
      right: right
    }
  } else if (money === 0) {
    return {
      left: '0',
      right: '00'
    }
  } else {
    return {
      left: '',
      right: ''
    }
  }
}

export function calculate(params) {
    let loanType = params.loanType || 1; // 还款方式：1为本息，2为本金
    // let houseTotal = params.houseTotal || 0; // 房屋总价
    // let ajcs = params.ajcs || 7; // 按揭成数
    let rateTotal = params.rateTotal || 0; // 商业贷款金额
    let fundTotal = params.fundTotal || 0; // 公积金贷款金额
    let year = params.year || 20; // 按揭年数
    let busiRate = params.rate || 0; // 商业贷款利率
    let fundRate = params.fundRate || 0; // 公积金贷款利率
    let comprise = params.comprise || 1; // 贷款方式
    let singleRate = comprise === 1 ? busiRate : fundRate; // 单一贷款利率
    let total = params.loanTotal || 0; // 贷款总额，转换成元
    let calculationTheWay = params.calculationTheWay; // 计算方式
    // calcedDkType = comprise;
    // calced = true;
    // 计算结果
    let data = {};
    let month = year * 12;
    data.year = year;
    data.loanType = loanType;
    data.month = month; // 显示贷款月数
    let allTotal2 = 0;
    // let monthMoney2 = '', allTotal2 = 0;
    if (comprise === 3) { // 组合型
        // 贷款总额 单位元
        if (Number(calculationTheWay) === 1) {
          data.loanTotal = (parseFloat(params.fundTotal) + parseFloat(params.rateTotal)) * 10000;
        } else {
          data.loanTotal = total * 10000;
        }
        let lilvSd = busiRate / 100; // 得到商贷利率
        let lilvGjj = fundRate / 100; // 得到公积金利率
        if (loanType === 1) { // 1.等额本息
            // 月均还款（单位：元）
            data.averageMonthlyRepayments = getMonthMoney1(lilvSd, rateTotal * 10000, month) + getMonthMoney1(lilvGjj, fundTotal * 10000, month); // 调用函数计算

            // 还款总额（单位：元）
            data.totalRepayment = data.averageMonthlyRepayments * month;
            // 支付利息 = 还款总额 - 贷款总额
            data.interest = data.totalRepayment - data.loanTotal;
            data.repayments = data.averageMonthlyRepayments;
        } else { // 2. 等额本金
            let monthMoneyArr = [];
            // 月均金额
            for (let i = 0; i < month; i++) {
                let huankuan = getMonthMoney2(lilvSd, rateTotal * 10000, month, i) + getMonthMoney2(lilvGjj, fundTotal * 10000, month, i);
                allTotal2 += huankuan;
                huankuan = Math.round(huankuan * 100) / 100;
                monthMoneyArr[i + 1] = huankuan;
            }
            // 每月递减金额
            data.abatement = ((monthMoneyArr[1] - monthMoneyArr[month]) / (month - 1)).toFixed(2);
            // 首月还款
            data.firstMonthRepayment = monthMoneyArr[1];
            // 还款总额
            data.totalRepayment = allTotal2;
            // 支付利息
            data.interest = data.totalRepayment - data.loanTotal;
            data.repayments = data.firstMonthRepayment;
        }
    } else { // 非组合型
        let lilv = singleRate / 100; // 得到利率
        // 贷款总额 单位元
        data.loanTotal = total * 10000;

        if (loanType === 1) { // 1.等额本息
            // 月均还款
            let monthMoney1 = getMonthMoney1(lilv, data.loanTotal, month);
            // 调用函数计算
            data.averageMonthlyRepayments = Math.round(monthMoney1);
            // 还款总额
            data.totalRepayment = monthMoney1 * month;
            // 支付利息
            data.interest = data.totalRepayment - data.loanTotal;
            data.repayments = data.averageMonthlyRepayments;
        } else { // 2. 等额本金
            let monthMoneyArr = [];
            // 月均金额
            for (let j = 0; j < month; j++) {
                // 调用函数计算: 本金月还款额
                let huankuan2 = getMonthMoney2(lilv, data.loanTotal, month, j);
                allTotal2 += huankuan2;
                huankuan2 = Math.round(huankuan2 * 100) / 100;
                monthMoneyArr[j + 1] = huankuan2;
            }
            // 每月递减
            data.abatement = ((monthMoneyArr[1] - monthMoneyArr[month]) / (month - 1)).toFixed(2);
            // 首月还款
            data.firstMonthRepayment = monthMoneyArr[1];
            // 还款总额
            data.totalRepayment = allTotal2;
            // 支付利息
            data.interest = data.interest = data.totalRepayment - data.loanTotal;
            data.repayments = data.firstMonthRepayment;
        }
    }
    data.averageMonthlyRepayments = MoneyFormat(data.averageMonthlyRepayments)
    data.repayments = MoneyFormat(data.repayments)
    data.totalRepayment = MoneyFormat(data.totalRepayment)
    data.interest = data.interest >= 0 ? MoneyFormat(data.interest) : MoneyFormat(0)
    data.abatement = MoneyFormat(data.abatement)
    data.firstMonthRepayment = MoneyFormat(data.firstMonthRepayment)
    data.comprise = comprise;
    return data;
};

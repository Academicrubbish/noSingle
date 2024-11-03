export function nowtime(fmt) {
    //用于拿到当前日期
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    //2.获取
    let o = {
        'M+': date.getMonth() + 1,
        // 月份
        'd+': date.getDate(),
        // 日
        'h+': date.getHours(),
        // 小时
        'm+': date.getMinutes(),
        // 分
        's+': date.getSeconds() // 秒
    };

    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str));
        }
    }
    return fmt;
}
function padLeftZero(str) {
    return ('00' + str).substr(str.length);
}
/*函数节流*/
export function throttle(fn, interval) {
    var enterTime = 0; //触发的时间
    var gapTime = interval || 300; //间隔时间，如果interval不传，则默认300ms
    return function () {
        var that = this;
        var backTime = new Date(); //第一次函数return即触发的时间
        if (backTime - enterTime > gapTime) {
            fn.call(that, arguments);
            enterTime = backTime; //赋值给第一次触发的时间，这样就保存了第二次触发的时间
        }
    };
}

/*函数防抖*/
export function debounce(fn, interval = 1000) {
    var timer;
    return function () {
        clearTimeout(timer);
        var that = this;
        var args = arguments; //保存此处的arguments，因为setTimeout是全局的，arguments不是防抖函数需要的。
        timer = setTimeout(function () {
            fn.call(that, args);
        }, interval);
    };
}

/* 获取随机长度随机排序的字符串 */
export function getRandomString(len) {
    //定义随机字符串 变量
    let _charStr = 'abacdefghjklmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ0123456789';
    let min = 0;
    let max = _charStr.length - 1;
    let _str = ''; //判断是否指定长度，否则默认长度为15
    len = len || 15;
    //循环生成字符串
    for (i = 0, void 0; i < len; i++) {
        var i;
        var index;
        index = (function (randomIndexFunc, i) {
            return randomIndexFunc(min, max, i, randomIndexFunc);
        })(function (min, max, i, _self) {
            let indexTemp = Math.floor(Math.random() * (max - min + 1) + min);
            let numStart = _charStr.length - 10;
            if (i == 0 && indexTemp >= numStart) {
                indexTemp = _self(min, max, i, _self);
            }
            return indexTemp;
        }, i);
        _str += _charStr[index];
    }
    return _str;
}

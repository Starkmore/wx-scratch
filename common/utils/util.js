const CONFIG = require('config.js');
const baseUrl = CONFIG.baseUrl;

const TOKEN = require('token.js');

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function commonDateAgo(str){
    if(!str)return;
    var now = new Date().getTime(),
        past = Date.parse(str.replace(/-/gi,"/")),
        diffValue = now - past,
        result='',
        minute = 1000 * 60,
        hour = minute * 60,
        day = hour * 24,
        month = day * 30,
        year = month * 12,
        _year = diffValue/year,
        _month =diffValue/month,
        _week =diffValue/(7*day),
        _day =diffValue/day,
        _hour =diffValue/hour,
        _min =diffValue/minute;

    if(_year>=1) result=parseInt(_year) + "年前";
    else if(_month>=1) result=parseInt(_month) + "个月前";
    else if(_week>=1) result=parseInt(_week) + "周前";
    else if(_day>=1) result=parseInt(_day) +"天前";
    else if(_hour>=1) result=parseInt(_hour) +"个小时前";
    else if(_min>=1) result=parseInt(_min) +"分钟前";
    else result="刚刚";
    return result;
}

function timer(time){
  if (!time) return;
  var result = '',
      minute = parseInt(time/60),
      second = time%60;
  if (minute >= 1) result = minute +'分  ';
  if (second >= 10) result = result + second + '秒';
  if (second < 10) result = result + '0' + second + '秒';
  return result
}

function request(url, argc, method, succb, failcb) {
    // var openid = wx.getStorageSync('openid')
    let _token = TOKEN.getToken(),reg = /public\//;
    if (_token){
        argc.token = _token
    }wx.request({
        url: baseUrl + url,
        method: method,
        header:CONFIG.header[reg.test(url) ? 1 : 2],
        data: argc,
        success: function (res) {
            succb(res)
        },
        fail: function (res) {
            failcb(res)
        }
    });
}


// Promise 封装
function promise(body) {
    return new Promise((resolve,reject)=>{
        body(resolve,reject);
    });
}

// wx.request 二次封装
function proRequest(obj) {
    let reg = /public\//;
    obj.data.token = wx.getStorageSync('token');
    promise((resolve,reject)=>{
        wx.request({
            url:`${baseUrl+obj.url}`,
            method:obj.method || 'GET',
            header:CONFIG.header[reg.test(obj.url) ? 1 : 2],
            data:obj.data,
            success(res) {
                if (res.statusCode === 200 && res.data.code === '2000'){
                    resolve(res.data);
                }else {
                    reject(res);
                }
            },
            error(res) {
                reject(res);
            },
            complete:obj.complete
        });
    }).then(res => {
        obj.success(res);
    }).catch(res => {
        obj.err(res);
    });
}

// wx.navigator 二次封装
function navigator(obj) {
    console.log(obj.method)
}



function getDataDiff(startTime,endTime){
  var sTime = new Date(startTime); 
  var eTime = new Date(endTime);
 return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(1000 * 60));
}


module.exports = {
  formatTime: formatTime,
  commonDateAgo:commonDateAgo,
  timer: timer,
  request: request,
  getDataDiff: getDataDiff,
  promise:promise,
  proRequest:proRequest,
  navigator:navigator,
};

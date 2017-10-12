const CONFIG = require('config.js');
const baseUrl = CONFIG.baseUrl;
function setToken(token){
  var setTokenTime = new Date(Date.now())
  setTokenTime = setTokenTime.getTime()
  wx.setStorageSync('setTokenTime', setTokenTime)
  wx.setStorageSync('token', token)
}

function getToken(){
  var time = wx.getStorageSync('setTokenTime')
  var token = wx.getStorageSync('token')
  var user_state = wx.getStorageSync('user_state')
  if (!isOverTime(time)){
    getUserCode(function(code){
      wx.request({
        url: baseUrl + 'wx/authorize',
        data: {
          code: code
        },
        method: 'POST',
        success: function (res) {
          if (res.data.code == 2000) {
            var data = res.data.data
            wx.setStorageSync('base_url', data.base_url);
            wx.setStorageSync('plate_id', data.plate_id);
            wx.setStorageSync('user_state', data.user_state);
            wx.setStorageSync('auth_state_flag', 0);
            wx.setStorageSync('user_id', data.user_id);
            wx.setStorageSync('auth_state', data.auth_state);
            setToken(data.token)
          }else{
            token = false,
              user_state = 0
          }
        }
      })
    })
  }
  return token
}

function isOverTime(time){
  var curTime = new Date(Date.now())
  curTime = curTime.getTime()
  var timeNum = 7*24*60*60*1000
  if ((curTime - time) >= timeNum){
    return false
  }else{
    return true
  }
}

function getUserCode(cb){
  wx.login({
    success: function (res) {
      typeof cb == "function" && cb(res.code)
    }
  })
}

function isAuth(_type){
  let jump_type = _type|1;
  let user_state = wx.getStorageSync('user_state');
  if (!user_state) {
    getUserCode(function (code) {
      wx.request({
        url: baseUrl + 'wx/authorize',
        data: {
          code: code
        },
        method: 'POST',
        success: function (res) {
          if (res.data.code == 2000) {
            var data = res.data.data
            wx.setStorageSync('base_url', data.base_url);
            wx.setStorageSync('plate_id', data.plate_id);
            wx.setStorageSync('user_state', data.user_state);
            wx.setStorageSync('auth_state_flag', 0);
            wx.setStorageSync('user_id', data.user_id);
            wx.setStorageSync('auth_state', data.auth_state);
            setToken(data.token);
            user_state = data.user_state;
            if (user_state != 2) {
              wx.redirectTo({
                url: '../account-bind/account-bind?index=' + jump_type,
              })
            }
          }
        }
      })
    })
  } else {
    if (user_state != 2) {
      wx.redirectTo({
        url: '../account-bind/account-bind?index=' + jump_type,
      })
    }
  }
}

module.exports = {
  setToken: setToken,
  getToken: getToken,
  getUserCode: getUserCode,
  isAuth: isAuth
};
/*
index 首页，service 服务，personal 我的，help-list 顺路
address 我的地址，account-bind 绑定手机号，cert 认证，help-detail 顺路详情，help-order 顺路订单，personal-info 个人信息页面 personal-publish 我的发布，publish-help 发布顺路求助，publish-service 发布服务，service-list 服务列表 ，service-order我的服务订单 ,personal-wallet 我的钱包, dg-packet 动感红包,supermarket 超市/食堂 ，shoporder-check 超市食堂确认订单页, shoporder-waite 超市食堂订单等待, 
*/

var config = require('./common/utils/config');

//app.js
App({
  onLaunch: function (options) {
      // 获取转发信息
      this.globalData.shareTicket = options.shareTicket || '';
  },
  getUserInfo: function (cb) {
    var that = this;
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.session_key = res.data.session_key;
              that.globalData.userInfo = res.userInfo;
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  getSystemInfo: function (cb) {
    let that = this;
    if (this.globalData.systemInfo) {
      typeof cb == "function" && cb(this.globalData.systemInfo)
    } else {
      //调用信息接口
      wx.getSystemInfo({
        success: function (res) {
          that.globalData.systemInfo = res;
          typeof cb == "function" && cb(that.globalData.systemInfo);
        }
      });
    }
  },
  getUserCode: function (cb) {
    var that = this;
    // if (this.globalData.code) {
    //   typeof cb == "function" && cb(this.globalData.code)
    // } else {
    //   //调用登录接口
    wx.login({
      success: function (res) {
        that.globalData.code = res.code;
        typeof cb == "function" && cb(that.globalData.code)
      }
    })
    // }
  },
  globalData: {
      userInfo: null,
      systemInfo: null,
      code: null,
      shareTicket:'',                 // 转发信息
      session_key:'',                 // 存储session_key
  },
  onHide:function(){
  }
});
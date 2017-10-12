
// var openid = wx.getStorageSync('openid')

/***
 * @class
 * 表示登录过程中发生的异常
 */
var LoginError = (function () {
  function LoginError(type, message) {
    Error.call(this, message);
    this.type = type;
    this.message = message;
  }

  LoginError.prototype = new Error();
  LoginError.prototype.constructor = LoginError;

  return LoginError;
})();

/**
 * 微信登录，获取 code 和 encryptData
 */
var getWxLoginResult = function getLoginCode(callback) {
  wx.login({
    success: function (loginResult) {
      wx.getUserInfo({
        success: function (userResult) {
          callback(null, {
            code: loginResult.code,
            encryptedData: userResult.encryptedData,
            iv: userResult.iv,
            userInfo: userResult.userInfo,
          })
        },

        fail: function (userError) {
          var error = new LoginError('ERR_WX_GET_USER_INFO', '获取微信用户信息失败，请检查网络状态')
          error.detail = userError
          callback(error, null)
        },
      })
    },

    fail: function (loginError) {
      var error = new LoginError('ERR_WX_LOGIN_FAILED', '微信登录失败，请检查网络状态')
      error.detail = loginError
      callback(error, null)
    },
  })
};




/**
 * Created by xuan on 2017/6/8.
 */
const {proRequest} = require('./wxUtils');

module.exports = function(obj,callback){
    return {
        title:obj.title,
        path:obj.url,
        success: function(res) {
            wx.showToast({
                title: '转发成功',
                icon: 'success',
                duration: 2000
            });
        },
        fail: function(res) {}
    }
};
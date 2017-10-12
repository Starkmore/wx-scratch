/**
 * Created by xuan on 2017/6/1.
 */
const CONFIG = require('config.js');
const BASE_URL = CONFIG.baseUrl;
const MyPromise = require('promise-8k');
const app = getApp();
const TOKEN = require('token');

class wxUtils{
    constructor(){
        this.checkCache = this.checkCache.bind(this);
        this.proRequest  = this.proRequest.bind(this);
        this.proUpLoadImage = this.proUpLoadImage.bind(this);
    }

    // Promise 封装
    promise(cb) {
        return new MyPromise((resolve,reject)=>{
            cb(resolve,reject);
        });
    }

    // checkCache
    checkCache(){
        let that = this;
        let token = TOKEN.getToken();
        let confirmToken = token;
        let promise = that.promise((resolve,reject)=>{
            if (!confirmToken){
                app.getUserCode(function (code) {
                    that.proRequest({
                        url:'wx/authorize',
                        method:'POST',
                        data:{
                            code: code
                        }
                    }).then(res=>{
                        let storageArr = ['token','base_url','plate_id','user_state','user_id','auth_state'];
                        storageArr.map(item=>{
                            wx.setStorageSync(item,res.data[item]);
                        });
                        wx.setStorageSync('auth_state_flag', 0);

                        app.getSystemInfo(function (systemInfo) {
                            wx.setStorage({
                                key:'systemInfo',
                                data:systemInfo
                            });
                        });

                    }).then(res=>{
                        return that.proRequest({url:'wx/userInfo'})
                    }).then(res=>{
                        wx.setStorageSync('userInfo',res.data);
                        resolve(res);
                    }).catch(res=>{
                        reject(res);
                    });
                });
            }else {
                resolve();
            }
        });
        return promise;
    }

    /**
     * 二次封装 wx.request
     *
     * @param obj {Object}
     *
     *      @for url --> url地址
     *      @for customUrl --> 自定义地址（全地址不包括base_url）
     *      @for method --> 发送类型
     *      @for data --> 携带参数
     *      @for complete --> 必执行回调
     *
     * @returns {Promise} resolve
     */
    proRequest(obj) {
        let sendData = {};

        let token = TOKEN.getToken(),reg = /public\//;
        if (token){
            if (obj.data) sendData = obj.data;
            sendData.token = token;
        }else {
            sendData = obj.data;
        }

        let promise = this.promise((resolve,reject)=>{
            wx.request({
                url:obj.customUrl ? obj.customUrl : `${BASE_URL+obj.url}`,
                method:obj.method || 'GET',
                header:CONFIG.header[reg.test(obj.url) ? 1 : 2],
                data:sendData,
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
        });

        return promise;
    }
    /**
     * 二次封装 wx.uploadFile
     *
     * @param obj {Object}
     *      @for filePath --> 上传文件资源的路径
     *      @for url --> 上传地址
     *      @for name --> 文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
     *      @for formdata --> 携带参数
     *      @for complete --> 必执行回调
     *
     * @returns {Promise} resolve
     */
    proUpLoadImage(obj){
        let promise = this.promise((resolve,reject)=>{
            wx.uploadFile({
                url: obj.customUrl ? obj.customUrl : `${BASE_URL+obj.url}`,
                filePath: obj.filePath,
                name: obj.name,
                formData: obj.formData,
                success: function (res) {
                    if (res.statusCode === 200){
                        resolve(res);
                    }else {
                        reject(res)
                    }
                },
                error(res) {
                    reject(res);
                },
                complete:obj.complete
            });
        });

        return promise;
    }

    /**
     * 二次封装 wx.navigator
     *
     * @param obj {Object}
     *      @for method --> 路由类型
     *      @for url --> 路由地址
     *      @for data --> 携带参数
     *      @for success --> 成功回调
     *      @for fail --> 失败回调
     *      @for complete --> 必执行回调
     *      @for delta --> 如果是 navigateBack,返回的页面层数
     *
     * @returns {Promise} resolve
     */
    navigator(obj){
        if (obj.method !== 'navigateBack'){
            wx[(obj.method)?obj.method:'navigateTo']({
                url:urlEncode(obj.url,obj.data),
                success(res) {
                    obj.success && obj.success(res);
                },
                fail(res){
                    obj.fail && obj.fail(res);
                },
                complete(res){
                    obj.complete && obj.complete(res);
                }
            });
        }else {
            wx[obj.method]({
                delta:(obj.delta)?obj.delta:1
            });
        }

    }

    /**
     * 二次封装 wx.showLoading
     *
     * @param obj {Object}
     *      @for title --> 标题文字
     *      @for mask --> 遮罩层
     *      @for success --> 成功回调
     *      @for fail --> 失败回调
     *      @for complete --> 必执行回调
     * @returns {Promise} resolve
     */
    wxLoginOpen(obj){
        wx.showLoading({
            title: !!obj && obj.title || '加载中...',
            mask: !!obj && obj.mask || true,
            success(){
                obj && obj.success && obj.success();
            },
            fail(){
                obj && obj.fail && obj.fail();
            },
            complete(){
                obj && obj.complete && obj.complete();
            }
        })
    }

    /**
     * 二次封装 wx.hideLoading
     */
    wxLoginClose(){
        wx.hideLoading();
    }



}



/**
 * 对象转url
 *
 * param 将要转为URL参数字符串的对象
 * key URL参数字符串的前缀
 * encode true/false 是否进行URL编码,默认为true
 *
 * return URL参数字符串
 */

function urlEncode(url,param) {
    if (typeof  url !== 'string')return '';

    let paramStrArr = [];
    for(let i in param){
        paramStrArr.push(`${i}=${param[i]}`);
    }
    return `${url+(paramStrArr.length>0?'?':'')+paramStrArr.join('&')}`;
}


module.exports = new wxUtils();
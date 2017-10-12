// scratch.js
const { checkCache, promise, proRequest, navigator, wxLoginOpen, wxLoginClose } = require('../../common/utils/wxUtils');
const rss = require('../../common/utils/wx-rss');
var utils = require('../../common/utils/util.js');
var config = require('../../common/utils/config')
var token = require('../../common/utils/token.js');
var app = getApp();
const ctx = wx.createCanvasContext('myCanvas')
Page({
  data: {
    tipsData2: {                      // 询问框
      title: '提 示',
      content: '',
      btn: [{ name: '确定', func: 'bindTipsWindowClose2' }],
      showModel: false,
      
    },
    move: true,
    img:'',
  },
  // 提示框切换显示隐藏
  toggleTipsWindowHidden2(obj) {
    let tipsData2 = this.data.tipsData2;
    let copy = Object.assign(tipsData2, obj);
    this.setData({
      tipsData2: copy
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let  that=this;
    utils.request('wx/checkLottery', {}, 'GET', function (res) {
             if(res.data.code=='2000'){ 
             }else if(res.data.code=='4000'){
               that.toggleTipsWindowHidden2({ showModel: true, content: res.data.msg })
               that.setData({
                   move:false,
               })
             }

       });
  },
  bindTipsWindowClose2: function () {
    this.toggleTipsWindowHidden2({ showModel: false });

  },
  startX: 0, //保存X坐标轴变量
  startY: 0, //保存X坐标轴变量
  onReady: function () {
    let that = this;
    utils.request('wx/checkLottery', {}, 'GET', function (res) {
      if (res.data.code == '2000') {
        ctx.setFillStyle('#BEBEBE')
        ctx.fillRect(0, 0,400, 207)
        ctx.draw()
      } else if (res.data.code == '4000') {
        if (res.data.data.win == '1'){
          that.setData({
            img: 'http://dgan.img.didoxy.com/2017083010197544_05.png'
          })

        } else if (res.data.data.win == '2'){
          that.setData({
            img: 'http://dgan.img.didoxy.com/2017083010197544_06.png'
          })

        } else {
          that.toggleTipsWindowHidden2({ showModel: true, content: res.data.msg })
        }
                 
      }

    });
  },
  //抽奖变量设置：
  setScratch:0,
  touchStart: function (e) {
    let that = this;
    if(this.data.move==true){
      var startX1 = e.changedTouches[0].x
      var startY1 = e.changedTouches[0].y
      ctx.save();  //保存当前坐标轴的缩放、旋转、平移信息
      ctx.beginPath() //开始一个路径 
      ctx.clearRect(startX1, startY1, 25, 25);
      ctx.restore();  //恢复之前保存过的坐标轴的缩放、旋转、平移信息
      if (this.setScratch == 0) {
       utils.request('wx/userLottery', {}, 'GET', function (res) {
          if (res.data.code == '2000') {
            if (res.data.data.win == '1') {
              that.setScratch = 1;
              that.setData({
                img: 'http://dgan.img.didoxy.com/2017083010197544_05.png',
                
              })
            } else if (res.data.data.win == '2') {
                  that.setScratch = 1;
                  that.setData({
                    img: 'http://dgan.img.didoxy.com/2017083010197544_06.png'
                  })
            }
          }
        });
      }
    } 
  },
  touchMove: function (e) {
    if (this.data.move == true) {
      var startX1 = e.changedTouches[0].x
      var startY1 = e.changedTouches[0].y
      ctx.save();  //保存当前坐标轴的缩放、旋转、平移信息
      ctx.moveTo(this.startX, this.startY);  //把路径移动到画布中的指定点，但不创建线条
      ctx.clearRect(startX1, startY1, 25, 25);  //添加一个新点，然后在画布中创建从该点到最后指定点的线条
      ctx.restore()  //恢复之前保存过的坐标轴的缩放、旋转、平移信息
      this.startX = startX1;
      this.startY = startY1;
    //只是一个记录方法调用的容器，用于生成记录绘制行为的actions数组。context跟<canvas/>不存在对应关系，一个context生成画布的绘制动作数组可以应用于多个<canvas/>
    }
   wx.drawCanvas({
      canvasId: 'myCanvas',
      reserve: true,
      actions: ctx.getActions() // 获取绘图动作数组
    })
  },
  touchEnd:function(){
  }
})
// pages/video/video.js
var app=getApp();
//引入这个插件，使html内容自动转换成wxml内容
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },
  gotopro:function(e){
    var id=e.currentTarget.dataset.id;
    if(id>0){
      wx.navigateTo({
        url: '../product/detail?productId=' + id
      })
    }else{
      wx.showToast({
        title: '该商品未上架！',
      })
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that=this;
      var id=options.id;
      wx.request({
        url: app.d.ceshiUrl + '/Api/Video/detail',
        method: 'post',
        data: {
          id:id
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          //--init data 
          var status = res.data.status;
          var content = res.data.err.content;
          if (status == 1) {
            var info = res.data.err;
            WxParse.wxParse('content', 'html', content, that, 3);
            wx.setNavigationBarTitle({
              title: info.name,
            })
            that.setData({
              info: info
            });
          } else {
            wx.showToast({
              title: res.data.err,
              duration: 2000,
            });
          }
        },
        error: function (e) {
          wx.showToast({
            title: '网络异常！',
            duration: 30000,
          });
        }
      });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
// pages/real_name/real_name.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.loadinfo();
  },
  loadinfo: function () {
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Applyshop/applysubmitinfo',
      method: 'post',
      data: {},
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data
        var status = res.data.status;
        if (status == 1) {
          console.log(res.data.respondData);
          that.setData({
            guanggao: res.data.respondData.guanggao,
            content: res.data.respondData.content
          })
        } else {
          wx.showToast({
            title: res.data.message,
          })
        }
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 30000
        });
      }
    })
  },
  geren:function(){
    wx.redirectTo({
      url: '../name/name?rztype=geren',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  qiye:function (e){
    wx.redirectTo({
      url: '../name/name?rztype=qiye',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  content: function () {
    var that = this;
    wx.showModal({
      title: '实名认证协议',
      content: that.data.content,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
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
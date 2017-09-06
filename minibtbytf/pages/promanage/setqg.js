// pages/promanage/setqg.js
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
  bindStart: function (e) {
    this.setData({
      startDate: e.detail.value
    })
  },
  bindEnd: function (e) {
    this.setData({
      endDate: e.detail.value
    })
  },
  onLoad: function (options) {
    var that = this;
    var proid = options.id;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Product/getqg',
      method: 'post',
      data: {
        uid: app.globalData.userInfo.id,
        proid: proid,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.status == 1) {
          var info = res.data.err;
          that.setData({
            info: info,
            startDate: info.startDate,
            endDate: info.endDate
          });
        }
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 30000
        });
      },
    })
  },
  setqg: function (e) {
    var that = this;
    var qtype = e.currentTarget.dataset.type;
    console.log(that.data.startDate);
    console.log(that.data.endDate);
    if (!that.data.startDate || !that.data.endDate) {
      wx.showToast({
        title: '请设置日期!',
      })
      return false;
    }
    wx.request({
      url: app.d.ceshiUrl + '/Api/Product/setqg',
      method: 'post',
      data: {
        uid: app.globalData.userInfo.id,
        proid: that.data.info.id,
        pro_type: qtype,
        start: that.data.startDate,
        end: that.data.endDate
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.status == 1) {
          if (qtype == 2) {
            wx.showToast({
              title: '设置成功',
            })
          } else {
            wx.showToast({
              title: '取消成功',
            })
          }
          setTimeout(function () {
            wx.navigateBack({

            })
          }, 2000)
        } else {
          wx.showToast({
            title: res.data.err,
          })
        }
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 30000
        });
      },
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
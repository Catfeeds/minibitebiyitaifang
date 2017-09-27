// pages/video/video.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:2
  },

  video: function (e) {
    var id=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../video/video?id='+id
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var cat_id = options.cat_id;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Video/index',
      method: 'post',
      data: {
        cat_id: cat_id,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data 
        var status = res.data.status;
        if (status == 1) {
          var list = res.data.list;
          that.setData({
            cat_id: cat_id,
            list: list
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
  getMore: function (e) {
    var that = this;
    var page = that.data.page;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Video/index',
      method: 'post',
      data: {
        page:page,
        cat_id: that.data.cat_id,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data 
        var status = res.data.status;
        if (status == 1) {
          var list = res.data.list;
          that.setData({
            list: that.data.list.concat(list),
            page: page+1
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
    var cat_id = this.data.cat_id;
    return {
      title: '资讯锦集',
      path: '/pages/vid/vid?cat_id=' + cat_id
    }
  }
})
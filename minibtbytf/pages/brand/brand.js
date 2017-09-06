// pages/brand/brand.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:2
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that=this;
      wx.request({
        url: app.d.ceshiUrl + '/Api/Category/brand',
        method: 'post',
        data: {
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          // //--init data        
          var data = res.data;
          if (data.status == 1) {
            that.setData({
              list:res.data.list
            })
          } else {
            wx.showToast({
              title: data.err,
              duration: 2000
            });
          }
        },
        fail: function () {
          // fail
          wx.showToast({
            title: '网络异常！',
            duration: 30000
          });
        }
      });
  },
  getMore: function (options) {
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Category/brand',
      method: 'post',
      data: {
        page:that.data.page
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        // //--init data
        var data=res.data;        
        var list = res.data.list;
        if (data.status == 1) {
          that.setData({
            list: res.data.list.concat(list)
          })
        } else {
          wx.showToast({
            title: data.err,
            duration: 2000
          });
        }
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 30000
        });
      }
    });
  },
  gotopro:function (e){
    var brand_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../listdetail/listdetail?brand_id=' + brand_id
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
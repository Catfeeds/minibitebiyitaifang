// pages/classify/classify.js
var app = getApp();
Page({
  data: {
    // 供求
    gongqiu: [],
  },
  jieshao: function (e) {
    console.log(e.currentTarget.dataset.title)
    wx.navigateTo({
      url: '../synopsis/synopsis?title=' + e.currentTarget.dataset.title,
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    var uid = app.globalData.userInfo.id;
    wx.request({
      url: app.d.ceshiUrl + '/Api/User/shop_supply',
      method: 'post',
      data: { uid: uid },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        if (status == 1) {
          var list = res.data.list;
          that.setData({
            gongqiu: list,
          });
        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 30000
        });
      },
    })
  },

  //取消
  cancels: function (e) {
    var that = this;
    var uid = app.globalData.userInfo.id;
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '是否确定取消？',
      success: function (res) {
        res.confirm && wx.request({
          url: app.d.ceshiUrl + '/Api/User/gongying_del',
          method: 'post',
          data: {
            uid: uid,
            id: id,
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            var status = res.data.status;
            if (status == 1) {
              wx.showToast({
                title: res.data.err,
                duration: 2000
              });
              that.onLoad();
            } else {
              wx.showToast({
                title: res.data.err,
                duration: 2000
              });
            }
          },
          fail: function (e) {
            wx.showToast({
              title: '网络异常！',
              duration: 30000
            });
          }
        });
      }
    });
  },

  calling: function (e) {
    var phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone, //此号码为真实电话号码
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})
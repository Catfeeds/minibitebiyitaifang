// pages/classify/classify.js
var app = getApp();
Page({
  data:{
    // 供求
    gongqiu:[],
  },

  jieshao:function(e){
    console.log(e.currentTarget.dataset.title)
    wx.navigateTo({
      url: '../synopsis/synopsis?title='+e.currentTarget.dataset.title,
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    var uid = app.globalData.userInfo.id;
    wx.request({
      url: app.d.ceshiUrl + '/Api/User/my_qiu',
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
          url: app.d.ceshiUrl + '/Api/User/up_state',
          method: 'post',
          data: {
            uid: uid,
            id: id,
            ztype: 'qx'
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            var status = res.data.status;
            if (status == 1) {
              wx.showToast({
                title: '操作成功！',
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
  //取消
  del: function (e) {
    var that = this;
    var uid = app.globalData.userInfo.id;
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '是否确定取消？',
      success: function (res) {
        res.confirm && wx.request({
          url: app.d.ceshiUrl + '/Api/User/qiugou_del',
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
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {
    return {
      title: '我的需求',
      // desc: '精品资讯尽在其中!',
      path: '/page/qiugou'
    }
  },
})
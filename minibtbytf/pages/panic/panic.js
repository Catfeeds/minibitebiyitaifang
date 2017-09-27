// pages/panic/panic.js
var app = getApp();
Page({
  data:{
    pro:[],
    page:0
  },
   like:function(e){
    console.log(e.currentTarget.dataset.state);
    var state = e.currentTarget.dataset.state;
    if(state==1){
      wx.showToast({
          title: '抢购还未开始！',
          duration: 3000
        });
        return false;
    }else if(state==2){
      wx.showToast({
          title: '抢购已经结束！',
          duration: 3000
        });
        return false;
    }else if(state==3){
      wx.showToast({
          title: '商品已经被抢光了！',
          duration: 3000
        });
        return false;
    }
    var pid = e.currentTarget.dataset.pid;
    wx.navigateTo({
      url: '../order/pay?buynum=1&productId='+pid,
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
    //ajax请求数据
    wx.request({
      url: app.d.ceshiUrl + '/Api/Product/panic',
      method:'post',
      data: {page:that.data.page},
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var list = res.data.pro;
        that.setData({
          pro: list
        })
      },
      fail: function(e){
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
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
      title: '限时抢购',
      // desc: '精品资讯尽在其中!',
      path: '/pages/panic/panic'
    }
  },
})
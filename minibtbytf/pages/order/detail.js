var app = getApp();
// pages/order/detail.js
Page({
  data:{
     array: ['类型', '身份证', '手机号',],
     index: 0,
    orderId:0,
    orderData:{},
    proData:[],
  },
  bindPickerChange: function (e) {
     console.log('picker发送选择改变，携带值为', e.detail.value)
     this.setData({
        index: e.detail.value
     })
  },
  onLoad:function(options){
    this.setData({
      orderId: options.orderId,
    })
    this.loadProductDetail();
  },
  loadProductDetail:function(){
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Order/order_details',
      method:'post',
      data: {
        order_id: that.data.orderId,
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {

        var status = res.data.status;
        if(status==1){
          var pro = res.data.pro;
          var ord = res.data.ord;
          that.setData({
            orderData: ord,
            proData:pro
          });
        }else{
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
      },
      fail: function () {
          // fail
          wx.showToast({
            title: '网络异常！',
            duration: 2000
          });
      }
    });
  },

})
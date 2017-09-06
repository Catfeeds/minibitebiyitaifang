var app = getApp();
// pages/order/detail.js
Page({
  data:{
    array: ["待发货","待收货","已收货","交易完成","交易关闭"],
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
  submit: function(e){
    var fdata = e.detail.value;
    var that = this;
    wx.showModal({
      title: '注意！',
      content: '状态一旦更改，将无法倒退！确定提交吗？',
      success: function (res) {
        if (res.confirm) {
            console.log('用户点击确定')
            if (!fdata.kuaidi_name || !fdata.kuaidi_num) {
              wx.showToast({
                title: '请填写快递信息再进行提交！',
              })
              return false;
            }
            wx.request({
              url: app.d.ceshiUrl + '/Api/Order/change_order',
              method: "post",
              data: {
                orderid: that.data.orderData.id,
                uid: app.globalData.userInfo.id,
                status: that.data.index,
                kuaidi_name: fdata.kuaidi_name,
                kuaidi_num:fdata.kuaidi_num
              },
              header: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
                if (res.data.status == 1) {
                  wx.showToast({
                    title: res.data.err,
                  })
                  setTimeout(function () {
                    wx.navigateBack({});
                  }, 2000);
                } else {
                  wx.showToast({
                    title: res.data.err,
                  })
                }
              },
              fail: function (e) {
                wx.showToast({
                  title: '网络异常！',
                  duration: 30000
                });
              },
            })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
     }
    })

  }

})
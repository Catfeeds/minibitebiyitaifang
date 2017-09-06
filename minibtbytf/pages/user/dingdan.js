// pages/user/dingdan.js
//index.js  
//获取应用实例  
var app = getApp();
var common = require("../../utils/common.js");
Page({  
  data: {  
    winWidth: 0,  
    winHeight: 900,  
    // tab切换  
    currentTab: 0,  
    isStatus:'pay',//10待付款，20待发货，30待收货 40、50已完成
    page:2,
    refundpage:2,
    orderList0:[],
    orderList1:[],
    orderList2:[],
    orderList3:[],
    orderList4:[],
    orderId:0
  },  
  onLoad: function(options) {  
    this.initSystemInfo();
    this.setData({
      currentTab: parseInt(options.currentTab),
      isStatus:options.otype
    });

    if(this.data.currentTab == 4){
      this.loadReturnOrderList();
    }else{
      this.loadOrderList();
    }
  },  
  getOrderStatus:function(){
    return this.data.currentTab == 0 ? 1 : this.data.currentTab == 2 ?2 :this.data.currentTab == 3 ? 3:0;
  },

//取消订单
removeOrder:function(e){
    var that = this;
    var orderId = e.currentTarget.dataset.orderId;
    wx.showModal({
      title: '提示',
      content: '你确定要取消订单吗？',
      success: function(res) {
        res.confirm && wx.request({
          url: app.d.ceshiUrl + '/Api/Order/orders_edit',
          method:'post',
          data: {
            id: orderId,
            type:'cancel',
          },
          header: {
            'Content-Type':  'application/x-www-form-urlencoded'
          },
          success: function (res) {
            //--init data
            var status = res.data.status;
            if(status == 1){
              wx.showToast({
                title: '操作成功！',
                duration: 2000
              });
              that.loadOrderList();
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

      }
    });
  },

  //确认收货
recOrder:function(e){
    var that = this;
    var orderId = e.currentTarget.dataset.orderId;
    wx.showModal({
      title: '提示',
      content: '你确定已收到宝贝吗？',
      success: function(res) {
        res.confirm && wx.request({
          url: app.d.ceshiUrl + '/Api/Order/orders_edit',
          method:'post',
          data: {
            id: orderId,
            type:'receive',
          },
          header: {
            'Content-Type':  'application/x-www-form-urlencoded'
          },
          success: function (res) {
            //--init data
            var status = res.data.status;
            if(status == 1){
              wx.showToast({
                title: '操作成功！',
                duration: 2000
              });
              that.loadOrderList();
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

      }
    });
  },

  loadOrderList: function(){
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Order/index',
      method:'post',
      data: {
        uid:app.d.userId,
        order_type:that.data.isStatus,
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data        
        var status = res.data.status;
        var list = res.data.ord;
        switch(that.data.currentTab){
          case 0:
            that.setData({
              orderList0: list,
              winHeight: 900,
            });
            break;
          case 1:
            that.setData({
              orderList1: list,
              winHeight: 900,
            });
            break;  
          case 2:
            that.setData({
              orderList2: list,
              winHeight: 900,
            });
            break;
          case 3:
            that.setData({
              orderList3: list,
              winHeight: 900,
            });
            break;
          case 4:
            that.setData({
              orderList4: list,
              winHeight: 900,
            });
            break;  
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

loadReturnOrderList:function(){
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Order/order_refund',
      method:'post',
      data: {
        uid:app.d.userId,
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data        
        var data = res.data.ord;
        var status = res.data.status;
        if(status==1){
          that.setData({
            orderList4: data,
            winHeight: 900,
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

//获取更多
getMore: function (e) {
  var that = this;
  var winHeight = that.data.winHeight;
  var page = that.data.page;
  wx.request({
    url: app.d.ceshiUrl + '/Api/Order/get_more',
    method: 'post',
    data: {
      uid: app.d.userId,
      order_type: that.data.isStatus,
      page: that.data.page,
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      var list = res.data.ord;
      if (list == '') {
        wx.showToast({
          title: '没有更多数据！',
          duration: 2000
        });
        return false;
      }
      var len = (list.length)*120;
      var status = res.data.status;
      switch (that.data.currentTab) {
        case 0:
          that.setData({
            orderList0: that.data.orderList0.concat(list),
            winHeight: winHeight + len,
          });
          break;
        case 1:
          that.setData({
            orderList1: that.data.orderList1.concat(list),
            winHeight: winHeight + len,
          });
          break;
        case 2:
          that.setData({
            orderList2: that.data.orderList2.concat(list),
            winHeight: winHeight + len,
          });
          break;
        case 3:
          that.setData({
            orderList3: that.data.orderList3.concat(list),
            winHeight: winHeight + len,
          });
          break;
        case 4:
          that.setData({
            orderList4: that.data.orderList4.concat(list),
            winHeight: winHeight + len,
          });
          break;
      }
      //that.initProductData(data);
      that.setData({
        page: page + 1,
      });
      //endInitData
    },
    fail: function (e) {
      wx.showToast({
        title: '网络异常！',
        duration: 2000
      });
    }
  })
},

//退款获取更多
getMore2: function (e) {
  var that = this;
  var winHeight = that.data.winHeight;
  var page = that.data.refundpage;
  wx.request({
    url: app.d.ceshiUrl + '/Api/Order/get_refund_more',
    method: 'post',
    data: {
      uid: app.d.userId,
      page: that.data.refundpage,
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      var list = res.data.ord;
      if (list == '') {
        wx.showToast({
          title: '没有更多数据！',
          duration: 2000
        });
        return false;
      }
      var len = (list.length) * 120;
      //that.initProductData(data);
      that.setData({
        orderList4: that.data.orderList4.concat(list),
        refundpage: page + 1,
        winHeight: winHeight + len,
      });
      //endInitData
    },
    fail: function (e) {
      wx.showToast({
        title: '网络异常！',
        duration: 2000
      });
    }
  })
},
  
  // returnProduct:function(){
  // },
  initSystemInfo:function(){
    var that = this;  
  
    wx.getSystemInfo( {
      success: function( res ) {  
        that.setData( {  
          winWidth: res.windowWidth,  
          winHeight: res.windowHeight  
        });  
      }    
    });  
  },
  bindChange: function(e) {  
    var that = this;  
    that.setData( { currentTab: e.detail.current });  
  },  
  swichNav: function(e) {  
    var that = this;  
    if( that.data.currentTab === e.target.dataset.current ) {  
      return false;  
    } else { 
      var current = e.target.dataset.current;
      that.setData({
        currentTab: parseInt(current),
        isStatus: e.target.dataset.otype,
        page:2
      });

      //没有数据就进行加载
      switch(that.data.currentTab){
          case 0:
            !that.data.orderList0.length && that.loadOrderList();
            break;
          case 1:
            !that.data.orderList1.length && that.loadOrderList();
            break;  
          case 2:
            !that.data.orderList2.length && that.loadOrderList();
            break;
          case 3:
            !that.data.orderList3.length && that.loadOrderList();
            break;
          case 4:
            that.data.orderList4.length = 0;
            that.loadReturnOrderList();
            break;
        }
    };
  },
  /**
   * 微信支付订单
   */
  // payOrderByWechat: function(event){
  //   var orderId = event.currentTarget.dataset.orderId;
  //   this.prePayWechatOrder(orderId);
  //   var successCallback = function(response){
  //     console.log(response);
  //   }
  //   common.doWechatPay("prepayId", successCallback);
  // },

  payOrderByWechat: function (e) {
    var that = this;
    var order_id = e.currentTarget.dataset.orderid;
    var order_sn = e.currentTarget.dataset.ordersn;

    if (!order_sn || !order_id){
      wx.showToast({
        title: "订单异常!",
        duration: 2000,
      });
      return false;
    }
    that.setData({
      orderId: order_id
    });
    wx.request({
      url: app.d.ceshiUrl + '/Api/Pay/dowxpay',
      data: {
        order_id: order_id,
        order_sn: order_sn,
        uid: app.d.userId,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }, // 设置请求的 header
      success: function (res) {
        if (res.data.status == 1) {
          var order = res.data.success;
          wx.requestPayment({
            timeStamp: order.timeStamp,
            nonceStr: order.nonceStr,
            package: order.package,
            signType: 'MD5',
            paySign: order.paySign,
            success: function (res) {
              wx.showToast({
                title: "支付成功!",
                duration: 2000,
              });
              setTimeout(function () {
                wx.navigateTo({
                  url: '../user/dingdan?currentTab=1&otype=deliver',
                });
              }, 2500);
            },
            fail: function (res) {
              wx.showToast({
                title: res,
                duration: 3000
              })
            }
          })
        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
      },
      fail: function (e) {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
  },

  onShow: function () {
    if (this.data.currentTab == 4) {
      this.loadReturnOrderList();
    } else {
      this.loadOrderList();
    }
  },


})
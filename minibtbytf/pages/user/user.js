// pages/user/user.js
var app = getApp()
Page( {
  data: {
    userInfo: {},
    orderInfo:{},
    projectSource: 'https://github.com/liuxuanqiang/wechat-weapp-mall',
    userListInfo:'',
  },
  onLoad: function () {
      var that = this
      //调用应用实例的方法获取全局数据
      app.getUserInfo(function(userInfo){
        //更新数据
        that.setData({
          userInfo:userInfo,
          loadingHidden: true
        })
      });  
      that.loadOrderStatus();
  },
  onShow:function(){
    var that=this;
    that.loadOrderStatus();
    wx.request({
      url: app.d.ceshiUrl + '/Api/Renzheng/checkrz',
      method: 'post',
      data: {
        uid: app.globalData.userInfo.id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data        
        var status = res.data.status;
        if (status == 1) {
          that.setData({
            rzinfo: res.data.respondData
          });
          that.loadShopOrder();
        } 
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 30000
        });
      }
    });
  },
  loadShopOrder:function (e){
    var that=this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/User/getShopOrderNum',
      method: "post",
      data: {
        uid:app.globalData.userInfo.id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
          if(res.data.status==1){
            that.setData({
              shopOrder: res.data.err
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
  },
  loadOrderStatus:function(){
    //获取用户订单数据
    var that = this;
    console.log(app.d.userId);
    console.log(app.globalData.userInfo);
    wx.request({
      url: app.d.ceshiUrl + '/Api/User/getorder',
      method:'post',
      data: {
        userId: app.globalData.userInfo.id,
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data        
        var status = res.data.status;
        if(status==1){
          that.setData({
            orderInfo:res.data.orderInfo,
            shop_status:res.data.shop_status
          });
        }else{
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
      },
      error:function(e){
        wx.showToast({
          title: '网络异常！',
          duration: 30000
        });
      }
    });
  },

})
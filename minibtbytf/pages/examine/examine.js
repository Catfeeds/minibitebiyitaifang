// pages/examine/examine.js
var app = getApp();
var uploadFileUrl = app.d.ceshiUrl + "/Api/Renzheng/uploadimg";
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var rztype = options.rztype;
    that.setData({
      rztype: rztype
    })
    wx.request({
      url: app.d.ceshiUrl + '/Api/Renzheng/readinfo',
      method: 'post',
      data: {
        uid: app.globalData.userInfo.id,
        dtype: "submit",
        rztype:that.data.rztype
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.status == 1) {
          var fdata = res.data.respondData;
          if (rztype=="geren"){
            that.setData({
              rztypename: fdata.rztypename,
              linkman: fdata.linkman,
              tel: fdata.tel,
              idc_id: fdata.idc_id,
              shopname: fdata.shopname
            })
          }else if(rztype=="qiye"){
            that.setData({
              rztypename: fdata.rztypename,
              linkman: fdata.linkman,
              tel: fdata.tel,
              idc_id: fdata.idc_id,
              qiyename: fdata.qiyename,
              qiyefrname: fdata.qiyefrname,
              shopname: fdata.shopname
            })
          }
          
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
  fan:function(){
    var that=this;
    var rztype=that.data.rztype;
     wx.redirectTo({
       url: '../renzheng/renzheng?rztype='+rztype,
       success: function(res) {},
       fail: function(res) {},
       complete: function(res) {},
     })
  },
  gotoqiye: function (e) {
    var that = this;
    var rztype = that.data.rztype;
    wx.redirectTo({
      url: '../rzqiye/rzqiye?rztype=' + rztype,
    })
  },
  gotogeren: function (e) {
    var that = this;
    var rztype = that.data.rztype;
    wx.redirectTo({
      url: '../renzheng/renzheng?rztype=' + rztype,
    })
  },
  gotodianpu: function (e) {
    var that = this;
    var rztype = that.data.rztype;
    wx.redirectTo({
      url: '../rzshop/rzshop?rztype=' + rztype,
    })
  },
  gotoshenhe: function (e) {
    var that = this;
    var rztype = that.data.rztype;
    wx.redirectTo({
      url: '../examine/examine?rztype=' + rztype,
    })
  },
  checkfree:function (e){
    var that=this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Renzheng/check_is_free',
      method: 'post',
      data: {
        uid: app.globalData.userInfo.id,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if(res.data.status==1){
          var is_free=res.data.respondData.is_free;
          
          if(is_free==1){
            //免费
            var showcontent ="实名认证付款金额：免费";
          }else{
            //收费
            var showcontent = "实名认证付款金额：￥" + res.data.respondData.fee;
          }
          wx.showModal({
            title: '是否提交审核？',
            content: showcontent,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定');
                if(is_free==1){
                  that.forfree();
                }else{
                  that.markorder();
                }
                
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })

        }else{
          wx.showToast({
            title: res.data.message,
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
  forfree: function (e) {
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Renzheng/forfree',
      method: 'post',
      data: {
        uid: app.globalData.userInfo.id,
        rztype: that.data.rztype
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if(res.data.status==1){
          wx.showToast({
            title: "提交成功",
            duration: 2000
          })
          setTimeout(function () {
            wx.navigateBack();
          }, 2500)
        }else{
          wx.showToast({
            title: res.data.message,
            duration: 2000
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
  markorder:function (e){
    var that=this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Renzheng/markrzorder',
      method: 'post',
      data: {
        uid: app.globalData.userInfo.id,
        rztype: that.data.rztype
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if(res.data.status==1){
          //微信支付
          that.dopay(res.data.respondData.ordersn);
        }else{
          wx.showToast({
            title: res.data.message,
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
  dopay:function(ordersn){
    var that=this;
    var ordersn=ordersn;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Renzheng/dopay',
      method: 'post',
      data: {
        uid: app.globalData.userInfo.id,
        rztype: that.data.rztype,
        ordersn: ordersn
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.status == 1) {
          //微信支付
          that.wxpay(res.data.respondData);
        } else {
          wx.showToast({
            title: res.data.message,
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
  wxpay:function (order){
    var order=order;
    wx.requestPayment({
      timeStamp: order.timeStamp,
      nonceStr: order.nonceStr,
      package: order.package,
      signType: 'MD5',
      paySign: order.paySign,
      success: function (res) {
        wx.showToast({
          title: '支付成功!',
          duration:2000
        })
        setTimeout(function(){
          wx.switchTab({
            url: '../user/user',
          })
        },2500)
      },
      fail: function (res) {
        wx.showToast({
          title: res,
          duration: 3000
        })
      }
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
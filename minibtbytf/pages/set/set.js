var app = getApp();
var common = require("../../utils/common.js");
Page({
  data: {
    checkboxItems: [
      { name: 'USA', value: '我已了解并阅读了' },
    ],
    items: [
      { name: 'USA', value: '￥' ,checked:true},
    ],
    content: '',
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  modalTap: function () {
    var that=this;
    
    wx.showModal({
      title: '保证金说明',
      content: that.data.content,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 表单
  reg: function (e) {
    console.log(e.detail.value);
    var that=this;
    var formdata=e.detail.value;
    if (that.data.checkboxItems[0].checked == true) {
      if(formdata.money>=1000){
          that.markorder(formdata.money);
      }else{
        wx.showToast({
          title: '保证金最低1000元.',
        })
      }
    } else {
      wx.showToast({
        title: '请阅读缴纳保证金说明并同意！',
        duration: 3000
      });
    }
  },
  checkboxChange: function (e) {
    var checked = e.detail.value
    var changed = {}

    console.log(this.data.checkboxItems[0].name)
    if (checked.indexOf(this.data.checkboxItems[0].name) !== -1) {
      changed['checkboxItems[0].checked'] = true
    } else {
      changed['checkboxItems[0].checked'] = false
    }
    this.setData(changed)
    console.log(changed)
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    var that = this;
    that.loadinfo();
  },
  loadinfo: function () {
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Renzheng/caution_money_info',
      method: 'post',
      data: {uid:app.globalData.userInfo.id},
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data
        var status = res.data.status;
        if (status == 1) {
          console.log(res.data.respondData);
          that.setData({
            guanggao: res.data.respondData.guanggao,
            content: res.data.respondData.content,
            shopmoney: res.data.respondData.shopmoney
          })
        } else {
          wx.showToast({
            title: res.data.message,
          })
        }
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 30000
        });
      }
    })
  },
  markorder: function (money){
    var that=this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Renzheng/markorder',
      method: 'post',
      data: {
        //uid:uid,pid:pro_id,aid:addr_id,sid:shop_id,buff:buff,num:num,price_yh:price_yh,p_price:p_price,price:z_price,type:pay_type,yunfei:yun_id,cart_id:cart_id,remark:ly
        uid: app.globalData.userInfo.id,
        price: money,//总价
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data        
        var data = res.data;
        console.log(data);

        if (data.status == 1) {
          //创建订单成功
          wx.showToast({
            title: '下单成功!',
            duration:2000,
          })
          that.wxpay(money,data.respondData.order_id);
        } else {
          wx.showToast({
            title: "下单失败!",
          })
        }
      },
    });
  },
  wxpay: function(money,orderid){
    wx.request({
      url: app.d.ceshiUrl + '/Api/Renzheng/dowxpay',
      data: {
        order_id: orderid,
        uid: app.globalData.userInfo.id,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }, // 设置请求的 header
      success: function (res) {
        if (res.data.status == 1) {
          var order = res.data.success;
          console.log(order);
          wx.requestPayment({
            timeStamp: order.timeStamp,
            nonceStr: order.nonceStr,
            package: order.package,
            signType: 'MD5',
            paySign: order.paySign,
            success: function (res) {
              wx.showToast({
                title: "支付成功!",
              })
            },
            fail: function () {
              wx.showToast({
                title: "支付失败!",
              })
            }
          })
        }
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  refund:function (){
    wx.showToast({
      title: '请联系客服进行此项操作！谢谢！',
      duration:5000,
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  }
})
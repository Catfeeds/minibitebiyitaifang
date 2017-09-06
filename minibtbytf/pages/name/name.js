// pages/name/name.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    geren:false,
    qiye: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var rztype = options.rztype;
    that.setData({
      rztype:rztype
    })
  },
  renzheng:function(){
    var that=this;
    var rztype=that.data.rztype;
    if(rztype=="geren"){
      wx.redirectTo({
        url: '../renzheng/renzheng?rztype='+rztype,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }else if(rztype=="qiye"){
      wx.redirectTo({
        url: '../rzqiye/rzqiye?rztype='+rztype,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
     
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
      
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
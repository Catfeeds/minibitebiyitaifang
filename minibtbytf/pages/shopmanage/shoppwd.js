// pages/shopmanage/shoppwd.js
var app = getApp();
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
  
  },
  editpwd:function (e){
     var that=this; 
     var fdata=e.detail.value;
     if(fdata.pwd==fdata.repwd){
       wx.request({
         url: app.d.ceshiUrl + '/Api/Shangchang/editshoppwd',
         method: 'post',
         data: { 
           uid: app.globalData.userInfo.id,
           pwd: fdata.pwd
         },
         header: {
           'Content-Type': 'application/x-www-form-urlencoded'
         },
         success: function (res) {
           //--init data
           var status = res.data.status;
           if (status == 1) {
             wx.showToast({
               title: '修改成功',
             })
             setTimeout(function(){
               wx.navigateBack()
             },2500)
           } else {
             wx.showToast({
               title: res.data.err,
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
     }else{
       wx.showToast({
         title: '密码不一致!',
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
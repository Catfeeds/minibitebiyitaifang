//logs.js
var app = getApp();
var uploadFileUrl = app.d.ceshiUrl + "/Api/Renzheng/uploadimg";
Page({
  data: {
    
  },
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
        dtype: "shop"
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.status == 1) {
          var fdata = res.data.respondData;
          that.setData({
            logo: fdata.logo,
            shopname: fdata.shopname,
            digest: fdata.digest,
            uplogo: fdata.uplogo,
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
  saveshop: function (e) {
    var that = this;
    var rztype = that.data.rztype;
    console.log(e.detail.value);
    var fdata = e.detail.value;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Renzheng/saveshop',
      method: 'post',
      data: {
        uid: app.globalData.userInfo.id,
        logo: that.data.uplogo,
        shopname: fdata.shopname,
        digest: fdata.digest
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.showToast({
          title: res.data.message,
        })
        if (res.data.status == 1) {
          wx.redirectTo({
            url: '../examine/examine?rztype=' + rztype,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
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
  // 上传图片
  logo: function () {
    var self = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log('chooseImage success, temp path is', res.tempFilePaths)
        var imageSrc = res.tempFilePaths[0];

        wx.uploadFile({
          url: uploadFileUrl,
          filePath: imageSrc,
          name: 'data',
          success: function (res) {
            console.log('uploadImage success, res is:', res)

            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 1000
            })

            self.setData({
              logo: imageSrc,
              uplogo:res.data
            })
          },
          fail: function ({errMsg}) {
            console.log('uploadImage fail, errMsg is', errMsg)
          }
        })

      },
      fail: function ({errMsg}) {
        console.log('chooseImage fail, err is', errMsg)
      }
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

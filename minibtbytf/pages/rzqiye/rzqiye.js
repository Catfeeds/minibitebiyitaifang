var app=getApp();
var uploadFileUrl = app.d.ceshiUrl +"/Api/Renzheng/uploadimg";
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
        dtype:"qiye"
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if(res.data.status==1){
          var fdata = res.data.respondData;
          that.setData({
            qiyename: fdata.qiyename,
            qiyefrname: fdata.qiyefrname,
            qiyefr_idc: fdata.qiyefr_idc,
            bankname: fdata.bankname,
            branchbankname: fdata.branchbankname,
            bankid: fdata.bankid,
            address: fdata.address,
            qiye_cert: fdata.qiye_cert,
            qiyefr_idc_face: fdata.qiyefr_idc_face,
            qiyefr_idc_back: fdata.qiyefr_idc_back,
            qiye_foodcert: fdata.qiye_foodcert,
            upqiye_cert: fdata.upqiye_cert,
            upqiyefr_idc_face: fdata.upqiyefr_idc_face,
            upqiyefr_idc_back: fdata.upqiyefr_idc_back,
            upqiye_foodcert: fdata.upqiye_foodcert
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
  reg: function (e) {
    var that=this;
    var rztype=that.data.rztype;
    console.log(e.detail.value);
    var fdata=e.detail.value;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Renzheng/saveqiye',
      method: 'post',
      data: {
        uid:app.globalData.userInfo.id,
        qiyename: fdata.qiyename,
        qiyefrname: fdata.qiyefrname,
        qiyefr_idc: fdata.qiyefr_idc,
        bankname: fdata.bankname,
        branchbankname: fdata.branchbankname,
        bankid: fdata.bankid,
        address: fdata.address,
        qiye_cert: that.data.upqiye_cert,
        qiyefr_idc_face: that.data.upqiyefr_idc_face,
        qiyefr_idc_back: that.data.upqiyefr_idc_back,
        qiye_foodcert: that.data.upqiye_foodcert
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.showToast({
          title: res.data.message,
        })
        if(res.data.status==1){
          wx.redirectTo({
            url: '../renzheng/renzheng?rztype=' + rztype,
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
  // 营业执照
  qiye_cert: function () {
    var self = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'],
      success: function (res) {
        var imageSrc = res.tempFilePaths[0]

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
              upqiye_cert:res.data,
              qiye_cert:imageSrc
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

  //身份证正面
  qiyefr_idc_face: function () {
    var self = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'],
      success: function (res) {
        var imageSrc = res.tempFilePaths[0]

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
              upqiyefr_idc_face: res.data,
              qiyefr_idc_face: imageSrc
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
  //身份证反面
  qiyefr_idc_back: function () {
    var self = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'],
      success: function (res) {
        var imageSrc = res.tempFilePaths[0]

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
              upqiyefr_idc_back: res.data,
              qiyefr_idc_back: imageSrc
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
  //食品流通证
  qiye_foodcert: function () {
    var self = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'],
      success: function (res) {
        var imageSrc = res.tempFilePaths[0]

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
              upqiye_foodcert: res.data,
              qiye_foodcert: imageSrc
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
  
  gotoqiye:function (e){
    var that=this;
    var rztype=that.data.rztype;
    wx.redirectTo({
      url: '../rzqiye/rzqiye?rztype='+rztype,
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
var app = getApp();
var common = require("../../utils/common.js");
const uploadFileUrl = require('../../config').uploadFileUrl;
Page({
  data: {
    photo:[]
  },
// 表单
  addbrand: function (e) {
    console.log(e.detail.value);
    var that=this;
    var formdata=e.detail.value;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Shangchang/addbrand',
      method: 'post',
      data: {
        uid:app.globalData.userInfo.id,
        name: formdata.name,
        photo: that.data.brandimg,
        digest:formdata.digest
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data
        var status = res.data.status;
        if (status == 1) {
          wx.showToast({
            title: '提交成功！',
          })
          var pages = getCurrentPages();//获得当前页面
          var prevPage = pages[pages.length - 2];  //获得上一个页面
          prevPage.reloadbrand();
          setTimeout(function(){
            wx.navigateBack();
          },2000)
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
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  uploadbrand: function () {
    var self = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log('chooseImage success, temp path is', res.tempFilePaths[0])
        var imageSrc = res.tempFilePaths[0]
        wx.showLoading({
          title: '上传中!',
        })
        wx.uploadFile({
          url: app.d.ceshiUrl + '/Api/Shangchang/uploadbrand',
          filePath: imageSrc,
          name: 'data',
          header: {
            'content-type': 'multipart/form-data',
          },
          success: function (res) {
            console.log(res);
            self.setData({
              brandimg: res.data,
            })
            wx.hideLoading()
            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 1000
            })
            self.setData({
              imagemin: imageSrc,
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
  del:function (e){
    var that=this;
    that.setData({
      imagemin:""
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
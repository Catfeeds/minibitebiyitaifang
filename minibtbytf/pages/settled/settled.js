var app = getApp();
var common = require("../../utils/common.js");
Page({
  data: {
    checkboxItems: [
      { name: 'USA', value: '我已了解并阅读了' },
    ],
    content:'',
  },
  modalTap: function () {
    var that=this;
    wx.showModal({
      title: '免责声明',
      content:that.data.content,
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
    if (that.data.checkboxItems[0].checked==true){
      wx.request({
        url: app.d.ceshiUrl + '/Api/Applyshop/applysubmit',
        method: 'post',
        data: {
          user:app.globalData.userInfo.id,
          shopname: formdata.shopname,
          cover: formdata.cover,
          linkname: formdata.linkname,
          tel: formdata.tel,
          weixin: formdata.weixin,
          digest: formdata.digest,
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
            setTimeout(function(){
              wx.navigateBack({})
            },2000)
          } else {
            wx.showToast({
              title: res.data.message,
              duration:2000
            })
          }
        },
        fail: function () {
          wx.showToast({
            title: '网络异常！',
            duration: 30000
          });
        }
      })
    }else{
      wx.showToast({
        title: '请阅读入驻申请协议并同意！',
        duration: 2000
      });
    }
    
  },
  checkboxChange: function (e) {
    var checked = e.detail.value
    var changed = {}

  console.log(this.data.checkboxItems[0].name)
  if (checked.indexOf(this.data.checkboxItems[0].name) !== -1)
       {
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
      var that=this;
      that.loadinfo();
  },
  loadinfo: function(){
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Applyshop/applysubmitinfo',
      method: 'post',
      data: {},
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data
        var status = res.data.status;
        if (status == 1) {
           console.log(res.data.respondData);
           that.setData({
             guanggao:res.data.respondData.guanggao,
             content: res.data.respondData.content,
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
  // 上传图片
  chooselogo: function () {
    var self = this;
    // var uploadFileUrl=app.d.myUrl+'/Api/Submit/upload';
    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      sourceType: ['album'],
      success: function (res) {
        console.log('chooseImage success, temp path is', res.tempFilePaths[0])
        var imageSrc = res.tempFilePaths[0]
        wx.showLoading({
          title: '上传中!',
        })
        wx.uploadFile({
          url: app.d.ceshiUrl + '/Api/Shangchang/uploadlogo',
          filePath: imageSrc,
          name: 'data',
          header: {
            'content-type': 'multipart/form-data',
          },
          success: function (res) {
            console.log(res);
            self.setData({
              uploadlogo: res.data,
            })
            wx.hideLoading()
            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 1000
            })
            self.setData({
              logo: imageSrc,
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
  del: function (e) {
    var that = this;
    that.setData({
      logo: ""
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
    return {
      title: '加盟申请',
      // desc: '精品资讯尽在其中!',
      path: '/pages/settled/settled'
    }
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
var app = getApp();
const uploadFileUrl = require('../../config').uploadFileUrl;
var owerId;
var albumId;
var filePaths;
var filePath;
var imgarr;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    photomin: [],
    photobig: [],
    imgarr: [],
    uploadarr: []
  },
  bindcat: function (e) {
    console.log('picker发送选择改变，携带值为', e.currentTarget.dataset.id)

    if (e.detail.value == 0) {

    }
    this.setData({
      catindex: e.detail.value
    })
  },
  bindbrand: function (e) {
    console.log('picker发送选择改变，携带值为', e.currentTarget.dataset.id)


    if (e.detail.value == 0) {

    }
    this.setData({
      brandindex: e.detail.value
    })
  },
  addbrand: function (e) {
    wx.navigateTo({
      url: '../addbrand/addbrand',
    })
  },
  addpro: function (e) {
    console.log(e.detail.value);
    var fdata = e.detail.value;
    var that = this;
    if (!fdata.name  || !fdata.content || !fdata.company || !fdata.price || !fdata.price_yh  || !fdata.pro_number || !fdata.num) {
      wx.showToast({
        title: '请将信息填完整再进行提交，谢谢！',
      });
      return false;
    }
    if (!that.data.catindex && !that.data.pro.cid) {
      wx.showToast({
        title: '请选择分类，谢谢！',
      });
      return false;
    }
    if (!that.data.brandindex && !that.data.pro.brand_id) {
      wx.showToast({
        title: '请选择品牌，谢谢！',
      });
      return false;
    }
    if (!that.data.photomin && !that.data.photobig) {
      wx.showToast({
        title: '请上传产品缩略图/大图！',
      });
      return false;
    }
    if (!that.data.uploadarr) {
      wx.showToast({
        title: '至少上传一张产品轮播图！',
      });
      return false;
    }
    var brand = that.data.brandlist;
    var cat = that.data.catlist;
    var brandindex = that.data.brandindex;
    var catindex = that.data.catindex;
    var proid = fdata.proid ? fdata.proid : 0;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Shangchang/addpro',
      method: 'post',
      data: {
        uid: app.globalData.userInfo.id,
        proid: proid,
        name: fdata.name,
        intro: fdata.intro,
        content: fdata.content,
        company: fdata.company,
        price: fdata.price,
        price_yh: fdata.price_yh,
        price_jf: fdata.price_jf,
        pro_number: fdata.pro_number,
        num: fdata.num,
        brand: brand[brandindex] ? brand[brandindex] : that.data.pro.brand,
        category: cat[catindex] ? cat[catindex] : that.data.pro.category,
        uploadarr: that.data.uploadarr ? that.data.uploadarr : that.data.imgarr,
        photomin: that.data.photomin ? that.data.photomin : that.data.imagemin,
        photobig: that.data.photobig ? that.data.photobig : that.data.imagebig
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        var status = res.data.status;
        if (status == "1") {
          wx.showToast({
            title: res.data.err,
            duration: 2000
          })
          setTimeout(function () {
            wx.navigateBack();
          }, 2000)
        } else {
          wx.showToast({
            title: res.data.err,
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var proid = options.id;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Shangchang/get_addpro_info',
      method: 'post',
      data: {
        uid: app.globalData.userInfo.id,
        proid: proid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        if (res.data.status == 1) {
          that.setData({
            shopname: res.data.err.shopname,
            catlist: res.data.err.category,
            brandlist: res.data.err.brand,
            pro: res.data.err.pro,
            imagemin: res.data.err.pro.photomin,
            imagebig: res.data.err.pro.photobig,
            imgarr: res.data.err.pro.uploadarr,
            photomin: res.data.err.pro.photo_x,
            photobig: res.data.err.pro.photo_d,
            uploadarr: res.data.err.pro.photo_string,
          })
        } else {
          wx.showToast({
            title: res.data.err,
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
  // 上传图片
  choosemin: function () {
    var self = this;
    // var uploadFileUrl=app.d.myUrl+'/Api/Submit/upload';
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
          url: app.d.ceshiUrl + '/Api/Shangchang/uploadpro',
          filePath: imageSrc,
          name: 'data',
          formData: {
            width: 230,
            height: 230
          },
          header: {
            'content-type': 'multipart/form-data',
          },
          success: function (res) {
            console.log(res);
            self.setData({
              photomin: res.data,
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
          fail: function ({ errMsg }) {
            console.log('uploadImage fail, errMsg is', errMsg)
          }
        })

      },
      fail: function ({ errMsg }) {
        console.log('chooseImage fail, err is', errMsg)
      }
    })
  },
  // 上传图片
  choosebig: function () {
    var self = this;
    // var uploadFileUrl=app.d.myUrl+'/Api/Submit/upload';
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
          url: app.d.ceshiUrl + '/Api/Shangchang/uploadpro',
          filePath: imageSrc,
          name: 'data',
          formData: {
            width: 600,
            height:600
          },
          header: {
            'content-type': 'multipart/form-data',
          },
          success: function (res) {
            console.log(res);
            self.setData({
              photobig: res.data,
            })
            wx.hideLoading()
            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 1000
            })
            self.setData({
              imagebig: imageSrc,
            })
          },
          fail: function ({ errMsg }) {
            console.log('uploadImage fail, errMsg is', errMsg)
          }
        })

      },
      fail: function ({ errMsg }) {
        console.log('chooseImage fail, err is', errMsg)
      }
    })
  },
  del: function (e) {
    var dtype = e.currentTarget.dataset.type;
    var that = this;
    if (dtype == "min") {
      that.setData({
        imagemin: ""
      })
    } else if (dtype == "max") {
      that.setData({
        imagebig: ""
      })
    }
  },
  reloadbrand: function (e) {
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Shangchang/get_brand',
      method: 'post',
      data: {
        uid: app.globalData.userInfo.id,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        if (res.data.status == 1) {
          that.setData({
            brandlist: res.data.err.brand
          })
        } else {
          wx.showToast({
            title: res.data.err,
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /* 函数描述：作为上传文件时递归上传的函数体体；
   * 参数描述： 
   * filePaths是文件路径数组
   * successUp是成功上传的个数
   * failUp是上传失败的个数
   * i是文件路径数组的指标
   * length是文件路径数组的长度
   */
  uploadDIY(filePaths, successUp, failUp, i, length) {
    console.log(filePaths)
    var that = this;
    wx.uploadFile({
      url: app.d.ceshiUrl + '/Api/Shangchang/uploadpro',
      filePath: filePaths[i],

      name: 'fileData',
      formData: {
        'pictureUid': owerId,
        'pictureAid': albumId
      },

      success: function (res) {
        console.log(filePaths[i]);
        console.log(res.data);
        var url = "," + res.data;
        that.setData({
          imgarr: filePaths,
          uploadarr: that.data.uploadarr.concat(url)
        })
        successUp++;
      },

      // success: (resp) => {

      // },
      fail: (res) => {
        console.log(res)
        failUp++;
      },
      complete: () => {
        i++;
        if (i == length) {

          console.log(length);
          // wx.showToast({
          //   title: 'successUp',

          // })
          console.log('总共' + successUp + '张上传成功,' + failUp + '张上传失败！');
        }
        else {
          //递归调用uploadDIY函数
          this.uploadDIY(filePaths, successUp, failUp, i, length);
        }
      },
    });
  },
  uploadImage: function (e) {
    var that = this;
    that.setData({
      imgarr: "",
      uploadarr: ""
    })
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        console.log(res.tempFilePaths)
        var successUp = 0; //成功个数
        var failUp = 0; //失败个数
        var length = res.tempFilePaths.length; //总共个数
        var i = 0; //第几个
        this.uploadDIY(res.tempFilePaths, successUp, failUp, i, length);
      },
    });
  }
})
//获取应用实例  
var app = getApp()
Page({
  data: {
    tempFilePaths: [],
    img:[],
    img_save:[],
    array: ['保密', '男', '女'],
    checkeds:false,
    ptype:1
  },
  bigger: function (e) {
    var that = this;
    if(that.data.ptype==0){
      that.setData({
        ptype:1
      });
      return false;
    }
      //获取当前图片的下表
       var index = e.currentTarget.dataset.index;
      //数据源
       var pictures = e.currentTarget.dataset.url;
    wx.previewImage({
      //当前显示下表
      current: pictures[index],
      //数据源
      urls: pictures
    })
  },
  listenerSwitch: function (e) {
    var that = this;
    var bool = e.detail.value;
    if(bool){
      var is_show = 0;
    }else{
      var is_show = 1;
    }
    wx.request({
      url: app.d.ceshiUrl + '/Api/User/change_show',
      method: 'post',
      data: {
        uid: app.globalData.userInfo.id,
        is_show:is_show
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        if(status == 1){
          wx.showToast({
            title: res.data.err,
            duration: 2000,
          });
        }else{
          wx.showToast({
            title: res.data.err,
            duration: 2000,
          });
        }
        
       
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000,
        });
      }
    });

  },
  onLoad: function () {
      var that = this;
      //调用应用实例的方法获取全局数据
      app.getUserInfo(function (userInfo) {
          //更新数据
          that.setData({
              userInfo: userInfo,
              loadingHidden: true
          })
      });
      wx.request({
          url: app.d.ceshiUrl + '/Api/User/userinfo',
          method: 'post',
          data: {
              uid: app.globalData.userInfo.id
          },
          header: {
              'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
              var userinfo = res.data.userinfo;
              if(userinfo){
                  if(userinfo.sex == 0){
                      var temp_sex = '保密';
                  } else if (userinfo.sex == 1){
                      var temp_sex = '男';
                  } else if (userinfo.sex == 2){
                      var temp_sex = '女';
                  }else{
                      var temp_sex = '';
                  }
                  if(userinfo.is_show==1){
                    that.setData({
                      checkeds:false
                    });
                  }else{
                    that.setData({
                      checkeds: true
                    });
                  }
                  
              }
             console.log(res.data.img);
              that.setData({
                  userinfo: userinfo,
                  temp_sex:temp_sex,
                  img:res.data.img2,
                  img_save: res.data.img
              });
          },
          error: function (e) {
              wx.showToast({
                  title: '网络异常！',
                  duration: 2000,
              });
          }
      });
  },
  pickChange: function (e) {
    console.log(e)
    this.setData({
      index: e.detail.value
    });
  },
  // 表单提交
  reg: function (e) {
      console.log(e.detail.value);
      var that = this;
      var fdata = e.detail.value;
      wx.request({
          url: app.d.ceshiUrl + '/Api/User/edituser',
          data: {
              uid: app.globalData.userInfo.id,
              uname: fdata.uname,
              email: fdata.email,
              tel2: fdata.tel2,
              address: fdata.address,
              tel: fdata.tel,
              sex: fdata.sex,
              shengri: fdata.shengri,
              company: fdata.company,
              job: fdata.job,
              intro: fdata.intro,
              img: that.data.img_save,
          },
          header: {// 设置请求的 header
              'Content-Type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          success: function (res) {
              if (res.data.status == 1) {
                  wx.showToast({
                      title: "保存成功!",
                  })
                  setTimeout(function () {
                      wx.redirectTo({
                          url: '../personal/personal',
                      })
                  }, 2000)
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
          },
      })
  },
  chooseimage: function () {
    var _this = this;
    wx.chooseImage({
      count: 1, // 默认9  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        console.log(res);
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        var imageSrc = res.tempFilePaths[0]
        wx.uploadFile({
          url: app.d.ceshiUrl + '/Api/User/uploadimg',
          filePath: imageSrc,
          name: 'data',
          uid: app.globalData.userInfo.id,
          success: function (res) {
            console.log('uploadImage success, res is:', res);
            wx.request({
                url: app.d.ceshiUrl + '/Api/User/saveImg',
                data: {
                    uid: app.globalData.userInfo.id,
                    img_url:res.data,
                },
                header: {// 设置请求的 header
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                success: function (res) {
                    if (res.data.status == 1) {
                        wx.showToast({
                            title: '上传成功',
                            icon: 'success',
                            duration: 1000
                        })
                        
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
                },
            });
            

            _this.setData({
              // tempFilePaths: res.tempFilePaths,
              img: _this.data.img.concat(imageSrc),
              // img_save: _this.data.img_save + ',' + res.data,
              img_save: _this.data.img_save.concat(res.data),
            })
          },
          fail: function ({ errMsg }) {
            console.log('uploadImage fail, errMsg is', errMsg)
          }
        })
      }
    })
  },
  deleImg: function (e) {
    var that = this;
    var img_id = e.currentTarget.dataset.id;
    var img = that.data.img;
    var img_save = that.data.img_save;
    var temp_file = [];
    var j = 0;
    for (var i = 0; i < img.length; i++){
      if(i!=img_id){
        temp_file[j++] = img[i];
      }else{
        wx.request({
          url: app.d.ceshiUrl + '/Api/User/delimg',
          data: {
            uid: app.globalData.userInfo.id,
            img_url:img_save[i],
            img_save:img_save,
          },
          header: {// 设置请求的 header
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          success: function (res) {
            if (res.data.status == 1) {
              console.log(res.data.img);
              that.setData({
                img_save: res.data.img,
              });
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
          },
        })
      }
      that.setData({
        img: temp_file,
        ptype:0
      });
    }
  },
 
})  
var app = getApp()
Page({
    data: {
      userinfo:[],
      userid:0,
      uid:0,
      qrcode:''
    },

    onLoad: function (options) {
      var that = this;
      //调用应用实例的方法获取全局数据
      app.getUserInfo(function (userInfo) {
        //更新数据
        that.setData({
          userInfo: userInfo,
          loadingHidden: true
        })
      });

      var userid = options.userid;
      var uid = app.globalData.userInfo.id;
      that.setData({
        uid: parseInt(uid),
      });
      if (parseInt(userid) > 0) {
        uid = parseInt(userid);
        that.setData({
          userid: parseInt(userid),
        });
      }

      

    },
    primary:function () {
        wx.redirectTo({
            url: '../redact/redact',
        })
    },
    onReady: function () {
        // 页面渲染完成
    },
    onShow: function () {
      var that = this;
      var userid = that.data.userid;
      if(userid > 0){
        var uid = userid;
      }else{
        var uid = app.globalData.userInfo.id;
      }
      wx.request({
        url: app.d.ceshiUrl + '/Api/User/userinfo',
        method: 'post',
        data: {
          uid: uid
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {

          var userinfo = res.data.userinfo;
          if (userinfo) {
            var type = userinfo.type;
          } else {
            var type = 0;
          }
          that.setData({
            userinfo: userinfo
          });
          if (type == 0) {
            wx.navigateTo({
              url: '../found/found',
            });
            return false;
          }
        },
        error: function (e) {
          wx.showToast({
            title: '网络异常！',
            duration: 2000,
          });
        }
      });
      wx.request({
        url: app.d.ceshiUrl + '/Api/User/getqrcode',
        method: 'post',
        data: {
          uid: uid
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var status = res.data.status;
          if (status == 1) {
            var qrcode = res.data.err;
            that.setData({
              qrcode: qrcode
            });
          } else {
            wx.request({
              url: app.d.ceshiUrl + '/Api/User/makeqrcode',
              method: 'post',
              data: {
                uid: uid
              },
              header: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
                var status = res.data.status;
                if (status == 1) {
                  var qrcode = res.data.err;
                  that.setData({
                    qrcode: qrcode
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
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
    },
    /**
 * 用户点击右上角分享
 */
    onShareAppMessage: function () {
      var uid = app.globalData.userInfo.id;
      return {
        title: '我的名片',
        // desc: '精品资讯尽在其中!',
        path: '/personal/personal?userid=' + parseInt(uid),
      }
    },

    call:function (e) {
      var phone = e.currentTarget.dataset.phone;
      wx.makePhoneCall({
        phoneNumber: phone
      })
    }
})

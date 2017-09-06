var app = getApp()
Page({
    data: {
      userinfo:[],
    },

    onLoad: function (options) {
        var that = this;
        wx.setNavigationBarTitle(
          {
            title: '个人信息',
          });
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
                    var type = userinfo.type;
                }else{
                    var type = 0;
                }
                    that.setData({
                        userinfo:userinfo
                    });
                    if(type == 0){
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
      return {
        title: '我的名片',
        // desc: '精品资讯尽在其中!',
        path: '/personal/personal'
      }
    },

})

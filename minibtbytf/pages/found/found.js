var app = getApp()
Page({
    data: {
        array: ['保密', '男', '女'],
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
                shengri: fdata.shengri,
                tel: fdata.tel,
                sex: fdata.sex,
                company: fdata.company,
                job: fdata.job,
                intro: fdata.intro,
                address: fdata.address,
                tel2:fdata.tel2
            },
            header: {// 设置请求的 header
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            success: function (res) {
                if (res.data.status == 1) {
                    wx.showToast({
                        title: "创建成功!",
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
    pickChange: function (e) {
        console.log(e)
        this.setData({
            index: e.detail.value
        });
    },
    onReady: function () {
        // 页面渲染完成
    },
    onShow: function () {
        // 页面显示
    },
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
    }

})

var app = getApp();
Page({
  data: {
    shengArr: [],//省级数组
    shengId: [],//省级id数组
    shiArr: [],//城市数组
    shiId: [],//城市id数组
    quArr: [],//区数组
    shengIndex: 0,
    shiIndex: 0,
    quIndex: 0,
    mid: 0,
    sheng: 0,
    city: 0,
    area: 0,
    code: 0,
    cartId: 0,
    info: [],
    shengname: ''
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
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
        email:fdata.email,
        weixin:fdata.weixin,
        tel: fdata.tel,
        sex: that.data.sex,
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
            wx.navigateBack({})
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
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    var that = this;
    //获取用户信息
    wx.request({
      url: app.d.ceshiUrl + '/Api/User/userinfo',
      data: {
        uid: app.globalData.userInfo.id
      },
      header: {// 设置请求的 header
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        console.log(res.data);
        var rdata = res.data.err;
        var _obj = {};
        _obj.curBdIndex = rdata.sex;
        _obj.curHdIndex = rdata.sex;
        if (res.data.status == 1) {
          that.setData({
            info: rdata,
            tabArr: _obj,
            sex: rdata.sex
          })
        }else{
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
  // tab切换
  tabFun: function (e) {
    //获取触发事件组件的dataset属性 
    var _datasetId = e.target.dataset.id;
    console.log("----" + _datasetId + "----");
    var _obj = {};
    _obj.curHdIndex = _datasetId;
    _obj.curBdIndex = _datasetId;
    this.setData({
      tabArr: _obj,
      sex: _datasetId
    });
  },

});
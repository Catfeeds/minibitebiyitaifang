var app = getApp()
Page({
  data: {
    current: 0,
    shopList: [],
    page:2,
    // 切换
    tabArr: {
      curHdIndex: 0,
      curBdIndex: 0,
      ab: 0,
      agg: 0
    },
    p: 0,//销量
    t: 0,//折扣
    condition:"zonghe",
    sort:"desc"
  },
  // tab切换
  tabFun: function (e) {
    //获取触发事件组件的dataset属性
    var that=this; 
    var _datasetId = e.target.dataset.id;
    var _datasetp = e.target.dataset.p;
    var _datasett = e.target.dataset.t;
    var _obj = {};
    _obj.curHdIndex = _datasetId;
    _obj.curBdIndex = _datasetId;
    //  第一个没排序
    if (_datasetId == 0) {
      _obj.ab = 0;
      _obj.agg = 0;
      that.setData({
        condition: 'zonghe',
        sort: 'desc',
        tabArr: _obj,
        p: 0,
        t: 0,
      });
    }
    //  第二个
    if (_datasetId == 1 && _datasetp == 0) {
      _obj.agg = 0;
      _obj.ab = 4;
      that.setData({
        tabArr: _obj,
        p: 5,
        t: 0,
        condition: 'sell',
        sort: 'asc'
      });
    
    }
    if (_datasetId == 1 && _datasetp == 5){
      _obj.agg = 0;
      _obj.ab = 5;
      that.setData({
        tabArr: _obj,
        p: 0,
        condition: 'sell',
        sort: 'desc'
      });
    }
    //  第三个
    if (_datasetId == 2 && _datasett == 0) {
      _obj.ab = 0;
      _obj.agg = 4;
      that.setData({
        tabArr: _obj,
        t: 5,
        condition: 'price',
        sort: 'asc'
      });
    } 
    if (_datasetId == 2 && _datasett == 5) {
      _obj.ab = 0;
      _obj.agg = 5;
      that.setData({
        tabArr: _obj,
        t: 0,
        condition: 'price',
        sort: 'desc'
      });
    }
    //  第4个没排序
    if (_datasetId == 3) {
      _obj.ab = 0;
      _obj.agg = 0;
      that.setData({
        tabArr: _obj,
        p: 0,
        t: 0,
        condition: 'new',
        sort: 'desc'
      });
    }    
    console.log("----id:" + _datasetId + "----");
    console.log("----sell:" + _datasetp + "=>" + that.data.p +"----");
    console.log("----price:" + _datasett + "=>" + that.data.t +"----");
    console.log("----tabarr:" + that.data.tabArr.curHdIndex + "----");
    console.log("----condition:" + that.data.condition + "=>sort:" + that.data.sort + "----");
    that.shaixuan();
  },
  showModal: function () {
  // 显示遮罩层
  var animation = wx.createAnimation({
   duration: 200,
   timingFunction: "linear",
   delay: 0
  })
  this.animation = animation
  animation.translateY(300).step()
  this.setData({
   animationData: animation.export(),
   showModalStatus: true
  })
  setTimeout(function () {
   animation.translateY(0).step()
   this.setData({
    animationData: animation.export()
   })
  }.bind(this), 200)
 },
 hideModal: function () {
  // 隐藏遮罩层
  var animation = wx.createAnimation({
   duration: 200,
   timingFunction: "linear",
   delay: 0
  })
  this.animation = animation
  animation.translateY(300).step()
  this.setData({
   animationData: animation.export(),
  })
  setTimeout(function () {
   animation.translateY(0).step()
   this.setData({
    animationData: animation.export(),
    showModalStatus: false
   })
  }.bind(this), 200)
 },
  onPullDownRefresh: function () {
    console.log('onPullDownRefresh')
  },
  onLoad: function (options) {
  var objectId = options.title;
  console.log(objectId)
 wx.setNavigationBarTitle(
    {
      title: objectId,
      success: function() {
        console.log('setNavigationBarTitle success')
      },
    })
    return false
},
onLoad: function (options) {
    //页面初始化 options为页面跳转所带来的参数
    //var groupId = wx.getStorageSync('groupId')
    var brand_id = options.brand_id;
    var cat_id = options.cat_id;
    var ptype = options.ptype;
    var that = this;
    // 筛选条件
    var condition = that.data.condition;
    var sort = that.data.sort;
    that.setData({
       condition: condition,
       sort: sort,
       op_brand_id:brand_id,
       op_cat_id:cat_id,
       op_ptype:ptype,
    });
    //ajax请求数据
    wx.request({
      url: app.d.ceshiUrl + '/Api/Product/lists',
      method:'post',
      data: {
        brand_id:brand_id,
        cat_id:cat_id,
        ptype:ptype
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var shoplist = res.data.pro;
        that.setData({
          shopList: shoplist
        })
      },
      error: function(e){
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
  },
  //详情页跳转
  lookdetail: function (e) {
    console.log(e)
    var lookid = e.currentTarget.dataset;
    console.log(e.currentTarget.dataset);
    wx.navigateTo({
      url: "../index/detail?id=" + lookid.id
    })
  },
  switchSlider: function (e) {
    this.setData({
      current: e.target.dataset.index
    })
  },
  changeSlider: function (e) {
    this.setData({
      current: e.detail.current
    })
  },
  shaixuan:function (e){
    var that=this;
    // 筛选条件
    var condition=that.data.condition;
    var sort=that.data.sort;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Product/lists',
      method: 'post',
      data: {
        condition:condition,
        sort:sort,
        brand_id: that.data.op_brand_id,
        cat_id: that.data.op_cat_id,
        ptype: that.data.op_ptype
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var prolist = res.data.pro;
        if (prolist == '') {
          wx.showToast({
            title: '没有更多数据！',
            duration: 2000
          });
          return false;
        }
        //that.initProductData(data);
        that.setData({
          shopList: prolist
        });
        //endInitData
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })  
  },
  //点击加载更多
  getMore: function (e) {
    var that = this;
    var page = that.data.page;
    // 筛选条件
    var condition = that.data.condition;
    var sort = that.data.sort;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Product/getlist',
      method: 'post',
      data: { 
        page: page,
        condition: condition,
        sort: sort,
        brand_id: that.data.op_brand_id,
        cat_id: that.data.op_cat_id,
        ptype: that.data.op_ptype
       },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var prolist = res.data.pro;
        if (prolist == '') {
          wx.showToast({
            title: '没有更多数据！',
            duration: 2000
          });
          return false;
        }
        //that.initProductData(data);
        that.setData({
          page: page + 1,
          shopList: that.data.shopList.concat(prolist)
        });
        //endInitData
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
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
  },
  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {
    return {
      title: '商品推荐',
      // desc: '精品资讯尽在其中!',
      path: '/pages/listdetail/listdetail?ptype=new'
    }
  },

})

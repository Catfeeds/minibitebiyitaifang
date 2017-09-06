var app = getApp();
var bmap = require('../budu-map/bmap-wx.min.js');
var wxMarkerData = [];
//index.js
Page({
  data: {
    'address': '定位中',
    ak: "AXMRrsEZ0CGfogyRENeexOTkHxauhZtz",   //填写申请到的ak 
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    circular: true,
    productData: [],
    proCat: [],
    page: 2,
    index: 2,
    brand: [],
    gongpage: 1,
    qiupage: 1,
    gong: [],
    qiu: [],
    dtype: 1,
    tabArr: {
      curHdIndex: 0,
      curBdIndex: 0
    },
  },
  listdetail: function (e) {
    console.log(e.currentTarget.dataset.title)
    wx.navigateTo({
      url: '../listdetail/listdetail?title=' + e.currentTarget.dataset.title,
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  suo: function (e) {
    console.log(e.currentTarget.dataset.title)
    wx.navigateTo({
      url: '../search/search?title=' + e.currentTarget.dataset.title,
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  bannergo: function (e) {
    var atype = e.currentTarget.dataset.type;
    var id = e.currentTarget.dataset.action;
    if (atype == "product") {
      wx.navigateTo({
        url: '../product/detail?productId=' + id,
      })
    } else if (atype == "partner") {
      wx.navigateTo({
        url: '../shop_store/shop_store?shopId=' + id,
      })
    }
  },
  qiang: function (e) {
    wx.navigateTo({
      url: '../panic/panic',
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  li: function (e) {
    wx.navigateTo({
      url: '../ritual/ritual',
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  newpro: function (e) {
    wx.navigateTo({
      url: '../listdetail/listdetail?ptype=new',
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  category: function (e) {
    console.log(e.currentTarget.dataset.title)
    wx.navigateTo({
      url: '../category/index',
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  dele: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../listdetail/listdetail?cat_id=' + id
    });
  },
  news: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../inf/inf?id=' + id
    });
  },
  jj: function (e) {
    var brand_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../listdetail/listdetail?brand_id=' + brand_id,
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },
  //  商品连接数据 
  initProductData: function (data) {
    for (var i = 0; i < data.length; i++) {
      console.log(data[i]);
      var item = data[i];
      item.Price = item.Price / 100;
      // item.Price = 100;
      item.ImgUrl = app.d.hostImg + item.ImgUrl;

    }
  },
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Index/index',
      method: 'post',
      data: {},
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        var ggtop = res.data.ggtop;
        var procat = res.data.procat;
        var prolist = res.data.prolist;
        var brand = res.data.brand;
        var gong = res.data.gong;
        var qiu = res.data.qiu;
        var category=res.data.category;
        var newslist=res.data.newslist;
        //that.initProductData(data);
        that.setData({
          imgUrls: ggtop,
          proCat: procat,
          catlist: category,
          productData: prolist,
          brand: brand,
          gong: gong,
          qiu: qiu,
          newslist: newslist
        });
        //endInitData
        wx.stopPullDownRefresh();
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })
    // 定位
    // var that = this;  
    /* 获取定位地理位置 */
    // 新建bmap对象   
    var BMap = new bmap.BMapWX({
      ak: that.data.ak,
    });
    console.log(BMap)
    var fail = function (data) {
      console.log(data);
    };
    var success = function (data) {
      //返回数据内，已经包含经纬度  
      console.log(data);
      //使用wxMarkerData获取数据  
      wxMarkerData = data.originalData.result.addressComponent.city
      //把所有数据放在初始化data内  
      console.log(wxMarkerData)
      that.setData({
        address: wxMarkerData
      });
    }
    // 发起regeocoding检索请求   
    BMap.regeocoding({
      fail: fail,
      success: success
    });
  },
  onShareAppMessage: function () {
    return {
      title: '比特币以太坊',
      path: '/pages/index/index',
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  },
  //点击加载更多
  getMore: function (e) {
    var that = this;
    var page = that.data.page;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Index/getlist',
      method: 'post',
      data: { page: page },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var prolist = res.data.prolist;
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
          productData: that.data.productData.concat(prolist)
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
  gotobrand: function (e) {
    wx.navigateTo({
      url: '../brand/brand',
    })
  },
  //接单
  jie: function (e) {
    var id = e.currentTarget.dataset.id;
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否确定要接单？',
      success: function (res) {
        res.confirm && wx.request({
          url: app.d.ceshiUrl + '/Api/User/orders',
          method: 'post',
          data: {
            sid: id,
            uid: app.globalData.userInfo.id
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            //--init data
            var status = res.data.status;
            if (status == 1) {
              wx.showToast({
                title: '接单成功，请及时联系该会员！',
                duration: 2500
              });
              that.onLoad();
            } else {
              wx.showToast({
                title: res.data.err,
                duration: 2500
              });
            }
          },
          fail: function () {
            // fail
            wx.showToast({
              title: '网络异常！',
              duration: 2000
            });
          }
        });
      }
    });
  },

  //联系
  lian: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone, //此号码并非真实电话号码，仅用于测试
      success: function () {
        //修改状态
        // wx.request({
        //   url: app.d.ceshiUrl + '/Api/User/contact',
        //   method: 'post',
        //   data: {
        //     uid: app.globalData.userInfo.id,
        //     id: id
        //   },
        //   header: {
        //     'Content-Type': 'application/x-www-form-urlencoded'
        //   },
        //   success: function (res) {
        //     that.onLoad();
        //     //endInitData
        //   },
        //   fail: function (e) {
        //     wx.showToast({
        //       title: '网络异常！',
        //       duration: 2000
        //     });
        //   },
        // })
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  //微信
  weixin: function (e) {
    var weixin = e.currentTarget.dataset.weixin;
    if(weixin!='' && weixin!='undefined'){
      wx.showModal({
        title: '亲爱的，您好！',
        content: '对方的微信号是:'+weixin,
      })
    }else{
      wx.showToast({
        title: '对方未预留微信号，请电话联系!谢谢!',
        duration:2000
      })
    }
    
  },
  // 供求
  //上一页
  lastpage: function (e) {
    var that = this;
    var ptype = e.currentTarget.dataset.ptype;
    if (ptype == 1) {
      var page = that.data.gongpage;
    } else {
      var page = that.data.qiupage;
    }
    if (page <= 1) {
      wx.showToast({
        title: '已经是第一页了！',
        duration: 2000
      });
      return false;
    }
    wx.request({
      url: app.d.ceshiUrl + '/Api/Index/getpage',
      method: 'post',
      data: { page: page - 1, ptype: ptype },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var list = res.data.list;
        if (list == '') {
          wx.showToast({
            title: '没有找到更多数据',
            duration: 2000
          });
          return false;
        }
        if (ptype == 1) {
          that.setData({
            gong: list,
            gongpage: page - 1
          });
        } else {
          that.setData({
            qiu: list,
            qiupage: page - 1
          });
        }
        //endInitData
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })
  },

  //下一页
  nextpage: function (e) {
    var that = this;
    var ptype = e.currentTarget.dataset.ptype;
    if (ptype == 1) {
      var page = that.data.gongpage;
    } else {
      var page = that.data.qiupage;
    }
    wx.request({
      url: app.d.ceshiUrl + '/Api/Index/getpage',
      method: 'post',
      data: { page: page + 1, ptype: ptype },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var list = res.data.list;
        if (list == '') {
          wx.showToast({
            title: '已经是最后一页了！',
            duration: 2000
          });
          return false;
        }
        if (ptype == 1) {
          that.setData({
            gong: list,
            gongpage: page + 1
          });
        } else {
          that.setData({
            qiu: list,
            qiupage: page + 1
          });
        }
        //endInitData
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })
  },

  //我要发布
  bindFormSubmit: function (e) {
    var that = this;
    var content = e.detail.value.content;
    var dtype = that.data.dtype;
    if (!content) {
      wx.showToast({
        title: '请输入供求内容！',
        duration: 2000
      });
      return false;
    }
    console.log(dtype)
    if (dtype < 1 || dtype > 2) {
      wx.showToast({
        title: '网络异常，请稍后再试！',
        duration: 2000
      });
      return false;
    }
    if (!that.data.catindex) {
      wx.showToast({
        title: '请选择分类，谢谢！',
      });
      return false;
    }
    var cat = that.data.catlist;
    var catindex = that.data.catindex;
    wx.request({
      url: app.d.ceshiUrl + '/Api/User/supply',
      method: 'post',
      data: {
        content: content,
        dtype: dtype,
        uid: app.globalData.userInfo.id,
        area: that.data.address,
        category: cat[catindex]
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        if (status == 1) {
          wx.showToast({
            title: '发布成功！',
            duration: 2000
          });
          that.onLoad();
        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })
  },

  // 弹窗
  setModalStatus: function (e) {
    var dtype = e.currentTarget.dataset.dtype;
    this.setData({
      dtype: dtype
    });
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export()
    })
    if (e.currentTarget.dataset.status == 1) {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation
      })
      if (e.currentTarget.dataset.status == 0) {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)
  },
  // tab切换
  tabFun: function (e) {
    //获取触发事件组件的dataset属性 
    var _datasetId = e.target.dataset.id;
    var _obj = {};
    _obj.curHdIndex = _datasetId;
    _obj.curBdIndex = _datasetId;
    this.setData({
      tabArr: _obj
    });
  },
  bindcat: function (e) {
    console.log('picker发送选择改变，携带值为', e.currentTarget.dataset.id)

    if (e.detail.value == 0) {

    }
    this.setData({
      catindex: e.detail.value
    })
  },
  onPullDownRefresh: function () {
    this.onLoad();
  }

});
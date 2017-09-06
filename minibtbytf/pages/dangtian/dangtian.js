var app = getApp()
Page({
  data: {
    current: 0,
  "shopList": [
            {
                "shopAddr":"飞马牌服饰",
                "shopName":"PUMA Kids银泰西湖店",
                "shopLogo":"../../images/sp_slt01.png",
                "type":1, //
               "yuan":"￥100",
               "lun":"99",
                //标识该门店类型 1-热门店 2-购买过 3-关注店 4-附近店
            },   
          {
                "shopAddr":"飞马牌服饰",
                "shopName":"PUMA Kids银泰西湖店",
                "shopLogo":"../../images/sp_slt01.png",
                "type":1, //
               "yuan":"￥100",
               "lun":"99",
                //标识该门店类型 1-热门店 2-购买过 3-关注店 4-附近店
            }, 
               {
                "shopAddr":"飞马牌服饰",
                "shopName":"PUMA Kids银泰西湖店",
                "shopLogo":"../../images/sp_slt01.png",
                "type":1, //
               "yuan":"￥100",
               "lun":"99",
                //标识该门店类型 1-热门店 2-购买过 3-关注店 4-附近店
            },  
              {
                "shopAddr":"飞马牌服饰",
                "shopName":"PUMA Kids银泰西湖店",
                "shopLogo":"../../images/sp_slt01.png",
                "type":1, //
               "yuan":"￥100",
               "lun":"99",
                //标识该门店类型 1-热门店 2-购买过 3-关注店 4-附近店
            }, 
        ],

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
  // onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    // console.log(options.title)
    // var groupId = wx.getStorageSync('groupId')
    // var that = this;
    // ajax请求数据
    // wx.request({
     
    //   url: `${app.globalData.API_URL}/goods`,
    //   data: {
    //     cat_name: options.title,
    //     shop_id: groupId
    //   },
    //   header: {
    //     'Content-Type': 'application/json'
    //   },
    //   success: function (res) {
    //     console.log(res)
    //     that.setData({
    //       listgoods: res.data
    //     })
    //   }
    // })
     
    //对商品进行价格排序
  //   console.log(that.data.listgoods);
  //   switch1(that.data.listgoods);
  //   function switch1(odata) {
  //     for (var i = 0; i < odata.length - 1; i++) {
  //       //console.log(odata[i].price);
  //       for (var j = 0; j < odata.length - i - 1; j++) {
  //         // console.log(parseInt(odata[j].price)+"-----"+parseInt(odata[j+1].price));
  //         if (parseInt(odata[j].market_price) > parseInt(odata[j + 1].market_price)) {
  //           var temp = odata[j];
  //           odata[j] = odata[j + 1];
  //           odata[j + 1] = temp;
  //         }
  //       }
  //     }
  //     console.log(odata)
  //     that.setData({
  //       listgoods: odata
  //     })
  //   }
  // },
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

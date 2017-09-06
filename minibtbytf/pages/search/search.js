var app = getApp();
// pages/search/search.js
Page({
  data:{
    focus:true,
    hotKeyShow:true,
    historyKeyShow:true,
    searchValue:'',
    page:0,
    productData:[],
    historyKeyList:[],
    hotKeyList:[]
  },
  onLoad:function(options){
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Search/index',
      method:'post',
      data: { uid: app.globalData.userInfo.id},
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var remen = res.data.remen;
        var history = res.data.history;

        that.setData({
          historyKeyList:history,
          hotKeyList:remen,
        });
      },
      fail:function(e){
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })
  },
  onReachBottom:function(){
      //下拉加载更多多...
      this.setData({
        page:(this.data.page+10)
      })
      
      this.searchProductData();
  },
  doKeySearch:function(e){
    var key = e.currentTarget.dataset.key;
    this.setData({
      searchValue: key,
       hotKeyShow:false,
       historyKeyShow:false,
    });

    this.data.productData.length = 0;
    this.searchProductData();
  },
  doSearch:function(){
    var searchKey = this.data.searchValue;
    if (!searchKey) {
        this.setData({
            focus: true,
            hotKeyShow:true,
            historyKeyShow:true,
        });
        return;
    };

    this.setData({
      hotKeyShow:false,
      historyKeyShow:false,
    })
    
    this.data.productData.length = 0;
    this.searchProductData();

    this.getOrSetSearchHistory(searchKey);
  },
  getOrSetSearchHistory:function(key){
    var that = this;
    wx.getStorage({
      key: 'historyKeyList',
      success: function(res) {
          console.log(res.data);

          //console.log(res.data.indexOf(key))
          if(res.data.indexOf(key) >= 0){
            return;
          }

          res.data.push(key);
          wx.setStorage({
            key:"historyKeyList",
            data:res.data,
          });

          that.setData({
            historyKeyList:res.data
          });
      }
    });
  },
  searchValueInput:function(e){
    var value = e.detail.value;
    this.setData({
      searchValue:value,
    });
    if(!value && this.data.productData.length == 0){
      this.setData({
        hotKeyShow:true,
        historyKeyShow:true,
      });
    }
  },
  searchProductData:function(){
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Search/searches',
      method:'post',
      data: {
        keyword:that.data.searchValue,
        uid: app.globalData.userInfo.id,
        page:that.data.page,
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {   
        var data = res.data.pro;
        that.setData({
          productData:that.data.productData.concat(data),
        });
      },
      fail:function(e){
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    });
  },
  //点击加载更多
  getMore: function (e) {
    var that = this;
    var page = that.data.page;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Product/getlist',
      method: 'post',
      data: {
        page: page,
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

});
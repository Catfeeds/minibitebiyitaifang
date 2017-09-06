// pages/news/news.js
//获取应用实例  
var app = getApp();
//引入这个插件，使html内容自动转换成wxml内容
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data:{},
  onLoad:function(options){
    var that = this;
    var newsid= options.newsid
    wx.request({
      url: app.d.ceshiUrl + '/Api/News/detail',
      method: 'post',
      data: {
        news_id:newsid
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if(res.data.status==1){
          var news = res.data;
          var content = res.data.content;
          WxParse.wxParse('content', 'html', content, that, 3);
          that.setData({
            news: news,
          });
        }else{
          wx.showToast({
            title:res.data.err,
          })
        }
      },
    });
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})
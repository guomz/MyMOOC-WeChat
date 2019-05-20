// pages/article/article.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getCurrentArticleUrl:"/user/getcurrentarticle",
    updateHistoryUrl:"/user/updatearticlehistory",
    currentArticle:{},
    courseId:null,
    currentPos:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options)
    var baseUrl=app.globalData.baseUrl;
    var userId=app.globalData.userId;
    var that=this;
    wx.request({
      url: baseUrl+this.data.getCurrentArticleUrl,
      data:{
        userId:userId,
        courseId:options.courseId,
        articleId:options.articleId
      },
      success:function(res){
        if(res.data.success)
        {
          //console.log(res.data);
          that.setData({
            currentArticle:res.data.currentArticle,
            currentPos:res.data.currentPos,
            courseId:options.courseId
          });
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var baseUrl=app.globalData.baseUrl;
    this.updateHistory(app.globalData.userId,this.data.courseId,this.data.currentArticle.articleId,this.data.currentPos);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var baseUrl = app.globalData.baseUrl;
    this.updateHistory(app.globalData.userId, this.data.courseId, this.data.currentArticle.articleId, this.data.currentPos);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

//滚动中实时记录位置
  onScroll:function(e){
    this.setData({
      currentPos:e.detail.scrollTop
    });
  },

/**
 * 更新文章观看历史
 */
  updateHistory:function(userId,courseId,articleId,currentPos){
    var baseUrl = app.globalData.baseUrl;
    wx.request({
      url: baseUrl+this.data.updateHistoryUrl,
      data:{
        userId: userId,
        courseId: courseId,
        articleId: articleId,
        currentPos: currentPos
      },
      success:function(res)
      {
        if(res.data.success)
        {

        }
      }
    });
  }
})
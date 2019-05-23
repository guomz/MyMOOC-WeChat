// pages/home/home.js
var base64 = require("../../images/base64");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseList:[],
    getCourseListUrl:"/home/getcourselist"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      icon20: base64.icon20,
      icon60: base64.icon60
    });
    var that=this;
    var baseUrl=app.globalData.baseUrl;
    var getCourseListUrl=this.data.getCourseListUrl;
    wx.request({
      url: baseUrl+getCourseListUrl,
      success:function(res){
        if(res.data.success)
        {
          that.setData({
            courseList:res.data.courseList
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

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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

  /**
   * 点击更多出发的事件
   */
  onbindTap:function(e){
    wx.navigateTo({
      url: '/pages/more/more',
    })
  },

/**
 * 点击轮播图跳转
 */
  onTap:function(e){
    var courseId=e.currentTarget.dataset.postid;
    wx.navigateTo({
      url: '/pages/course/course?courseId='+courseId,
    })
  }
})
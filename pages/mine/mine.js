// pages/mine/mine.js
const app=getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    getMyCourseUrl:'/user/getmycourselist',
    courseList:[],
    collectionList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //通过全局变量获得用户信息
    var userInfo=app.globalData.userInfo;
    this.setData({
      userInfo:userInfo
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
    var baseUrl = app.globalData.baseUrl;
    var getMyCourseUrl = this.data.getMyCourseUrl;
    var userId = app.globalData.userId;
    var that = this;
    //获取用户学习过的课程列表
    wx.request({
      url: baseUrl + getMyCourseUrl,
      data: {
        userId: userId
      },
      success: function (res) {
        if (res.data.success) {
          that.setData({
            courseList: res.data.courseList,
            collectionList:res.data.collectionList
          });
        }
      }
    });
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

  }
})
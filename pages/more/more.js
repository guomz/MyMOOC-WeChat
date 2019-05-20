// pages/more/more.js
const app = getApp();
var base64 = require("../../images/base64");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    courseList:[],
    pageIndex:0,
    pageSize:6,
    searchUrl:"/search/searchcourse"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      icon20: base64.icon20,
      icon60: base64.icon60
    });
    var that = this;
    var courseName = this.data.inputVal;
    var pageSize = this.data.pageSize;
    var baseUrl = app.globalData.baseUrl;
    var searchUrl = this.data.searchUrl;
    wx.request({
      url: baseUrl+searchUrl,
      data:{
        courseName:courseName,
        pageIndex:0,
        pageSize:pageSize
      },
      success:function(res)
      {
        if(res.data.success)
        {
          var prePageIndex=that.data.pageIndex;
          that.setData({
            courseList:res.data.courseList,
            pageIndex:prePageIndex+6
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

//搜索栏功能
  /**
   * 输入框失去焦点触发，此时发送请求搜索
   */
  onbindBlur: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
   // console.log('onbindBlur')
    var that=this;
    var courseName=this.data.inputVal;
    var pageSize=this.data.pageSize;
    var baseUrl=app.globalData.baseUrl;
    var searchUrl=this.data.searchUrl;
    this.setData({
      pageIndex:0
    });
    wx.request({
      url: baseUrl+searchUrl,
      data:{
        courseName:courseName,
        pageIndex:0,
        pageSize:pageSize
      },
      success:function(res){
        if(res.data.success)
        {
          var prePageIndex=that.data.pageIndex;
          that.setData({
            courseList:res.data.courseList,
            pageIndex: prePageIndex+6
          });
        }
      }
    });
  },

/**
 * 搜索栏被点击触发
 */
  showInput: function () {
    this.setData({
      inputShowed: true
    });
    //console.log('showInput')
  },

  /**
   * 点击取消触发
   */
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
    //console.log('hideInput')
  },

  /**
   * 点击×触发
   */
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
    //console.log('clearInput')
  },

  /**
   * 输入时触发
   */
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },

//下拉监听
  onLower:function(e)
  {
    //console.log('onLower');
    var that=this;
    var courseName = this.data.inputVal;
    var pageIndex=this.data.pageIndex;
    var pageSize = this.data.pageSize;
    var baseUrl = app.globalData.baseUrl;
    var searchUrl = this.data.searchUrl;
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: baseUrl+searchUrl,
      data:{
        courseName:courseName,
        pageIndex:pageIndex,
        pageSize:pageSize
      },
      success:function(res)
      {
        if(res.data.success)
        {
          //判断当前是否有课程列表
          var preCourseList=that.data.courseList;
          var prePageIndex=that.data.pageIndex;
          if(preCourseList)
          {
            var newCourseList = preCourseList.concat(res.data.courseList);
          }
          else
          {
            var newCourseList = res.data.courseList;
          }
          that.setData({
            courseList:newCourseList,
            pageIndex:prePageIndex+6
          });
          wx.hideLoading();
        }
      }
    });
  }
})
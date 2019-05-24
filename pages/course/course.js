// pages/course/course.js
const app = getApp();
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addToMyCourseUrl: '/user/addcoursetouser',
    updateHistoryUrl: '/user/updatehistory',
    downloadFileUrl:'/user/downloadfile',
    getArticleListUrl:'/user/getarticlelist',
    handleCollectionUrl:'/user/handlecollection',
    submitCommentUrl:'/user/submitcomment',
    reloadCommentUrl:'/user/reloadcomment',
    tabs: ["视频", "简介","评论"],
    hasMovie: true,
    hasArticle: true,
    activeIndex: 1,
    sliderOffset: 0,
    sliderLeft: 0,
    course: {},
    movieList: {},
    articleList: {},
    //记录上次（当前）观看的视频id与位置
    currentMovie: {},
    //影片进度
    currentPos: 0,
    //articlePos:0，
    //讲师信息
    teacher:{},
    //判断是否收藏
    isCollected:false,
    //判断是否已经评论
    isComment:false,
    //评论内容
    commentContent:'',
    //评论列表
    commentList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //初始化视频对象
    this.videoContext = wx.createVideoContext('myVideo');
    //初始化顶部导航栏
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    var baseUrl = app.globalData.baseUrl;
    var userId = app.globalData.userId;
    var addToMyCourseUrl = this.data.addToMyCourseUrl;
    //记录用户观看过该课程，并返回该课程基本信息、视频列表、观看位置
    //console.log(options.courseId)
    wx.request({
      url: baseUrl + addToMyCourseUrl,
      data: {
        courseId: options.courseId,
        userId: userId
      },
      success: function(res) {
        if (res.data.success) {
          console.log(res.data);
          if (!res.data.movieList || res.data.movieList.length == 0) {
            that.setData({
              hasMovie: false
            });
          }
          if (!res.data.articleList || res.data.articleList.length == 0) {
            that.setData({
              hasArticle: false
            })
          }
          that.setData({
            course: res.data.course,
            movieList: res.data.movieList,
            articleList:res.data.articleList,
            currentMovie: res.data.currentMovie,
            currentPos: res.data.currentPos,
            teacher:res.data.teacher,
            isCollected:res.data.isCollected,
            isComment:res.data.isComment,
            commentList:res.data.commentList
            //articlePos:res.data.articlePos
          });
          //console.log("seeking");
          //that.videoContext.seek(that.data.currentPos);
          //console.log("seeking complete");

        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    //console.log('onhide')
    if (this.data.hasMovie) {
      var userId = app.globalData.userId;
      var courseId = this.data.course.courseId;
      var chapter = this.data.currentMovie.chapter;
      var currentPos = this.data.currentPos;
      this.updateHistory(userId, courseId, chapter, currentPos);
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    //console.log('onunload')
    if (this.data.hasMovie) {
      var userId = app.globalData.userId;
      var courseId = this.data.course.courseId;
      var chapter = this.data.currentMovie.chapter;
      var currentPos = this.data.currentPos;
      this.updateHistory(userId, courseId, chapter, currentPos);
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  //顶部导航栏点击事件
  tabClick: function(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  /**
   * 点击上一个视频事件
   */
  preMovie: function(e) {
    var movieList = this.data.movieList;
    var currentMovie = this.data.currentMovie;
    for (var i = 0; i < movieList.length; i++) {
      if (currentMovie.movieId == movieList[i].movieId && i > 0) {
        this.setData({
          currentMovie: movieList[i - 1],
          currentPos: 0
        });
        this.videoContext.seek(this.data.currentPos);
        this.getArticleList(this.data.course.courseId, this.data.currentMovie.chapter);
        return;
      }
    }
    
  },

  /**
   * 点击下一个视频事件
   */
  nextMovie: function(e) {
    var movieList = this.data.movieList;
    var currentMovie = this.data.currentMovie;
    for (var i = 0; i < movieList.length; i++) {
      if (currentMovie.movieId == movieList[i].movieId && i < movieList.length - 1) {
        this.setData({
          currentMovie: movieList[i + 1],
          currentPos: 0
        });
        this.videoContext.seek(this.data.currentPos);
        this.getArticleList(this.data.course.courseId, this.data.currentMovie.chapter);
        return;
      }
    }
    
  },

  /**
   * 点击视频列表中的视频，改变当前播放的视频并重置播放位置
   */
  chooseMovie: function(e) {
    var movieId = e.target.dataset.movieid;
    var movieList = this.data.movieList;
    for (var i = 0; i < movieList.length; i++) {
      if (movieList[i].movieId == movieId) {
        this.setData({
          currentMovie: movieList[i],
          currentPos: 0
        });
        this.videoContext.seek(this.data.currentPos);
        this.getArticleList(this.data.course.courseId, this.data.currentMovie.chapter);
        return;
      }
    }
    
  },

  /**
   * 播放中实时记录时间
   */
  timeUpdate: function(e) {
    var currentPos = e.detail.currentTime;
    this.setData({
      currentPos: currentPos
    });
  },

  /**
   * 更新用户观看进度
   */
  updateHistory: function(userId, courseId, chapter, currentPos) {
    var baseUrl = app.globalData.baseUrl;
    var updateHistoryUrl = this.data.updateHistoryUrl;
    wx.request({
      url: baseUrl + updateHistoryUrl,
      data: {
        userId: userId,
        courseId: courseId,
        chapter: chapter,
        currentPos: currentPos
      },
      success: function(res) {
        if(res.data.success){
          console.log('success')
        }
        
      }
    })
  },

/**
 * 点击事件，用于更新最新上次看到后的文章题目
 */
  onTap:function(e){
    wx.showLoading({
      title: '下载中。。。',
    });
    wx.downloadFile({
      url: 'http://video.317hu.com/917b3140-3da6-47d5-911c-a15462fcdeb2.pdf',
      success: function (res) {
        wx.hideLoading();
        wx.openDocument({
          filePath: res.tempFilePath,
          success: function (res) {

          }
        });
      }
    });
  },

  getArticleList:function(courseId,chapter){
    var that=this;
    wx.request({
      url: app.globalData.baseUrl+this.data.getArticleListUrl,
      data:{
        courseId:courseId,
        chapter:chapter
      },
      success:function(res){
        if(res.data.success){
          that.setData({
            articleList:res.data.articleList
          });
          if (!res.data.articleList || res.data.articleList.length==0)
          {
            that.setData({
              hasArticle:false
            });
          }
          else
          {
            that.setData({
              hasArticle: true
            });
          }
        }
      }
    });
  },

//点击收藏按钮
  handleCollected:function(){
    //console.log("collected")
    var that=this;
    wx.request({
      url: app.globalData.baseUrl+this.data.handleCollectionUrl,
      data:{
        userId:app.globalData.userId,
        courseId:this.data.course.courseId
      },
      success:function(res){
        if(res.data.success)
        {
          if(that.data.isCollected)
          {
            wx.showToast({
              title: '取消收藏成功',
            });
            that.setData({
              isCollected:false
            });
          }
          else
          {
            wx.showToast({
              title: '收藏成功',
            });
            that.setData({
              isCollected:true
            });
          }
        }
      }
    });
  },

//评论框输入内容响应事件
  commentInput:function(e){
    this.setData({
      commentContent:e.detail.value
    });
  },

//提交评论
  submitComment:function(){
    var that=this;
    if(this.data.isComment)
    {
      wx.showToast({
        title: '请勿重复评论',
        icon:'none'
      });
    }
    else
    {
      var nowDate=new Date();
      var commentDate=nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate();
      console.log(commentDate);
      wx.request({
        url: app.globalData.baseUrl+this.data.submitCommentUrl,
        data:{
          userId:app.globalData.userId,
          courseId:this.data.course.courseId,
          commentContent:this.data.commentContent,
          commentDate:commentDate
        },
        success:function(res){
          if(res.data.success)
          {
            wx.showToast({
              title: '评论成功',
            });
            that.setData({
              isComment:true
            });
            //刷新评论区
            wx.request({
              url: app.globalData.baseUrl+that.data.reloadCommentUrl,
              data:{
                courseId: that.data.course.courseId
              },
              success:function(res){
                if(res.data.success)
                {
                  that.setData({
                    commentList:res.data.commentList
                  });
                }
              }
            });
          }
        }
      });
    }
  }
})
// pages/searchCourse/searchcourse.js
// 主页
var config = require('../../config')
var util = require('../../utils/util.js')
var qcloud = require('../../vendor/wafer2-client-sdk/index')

// 获取全局变量
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    inputShowed: false,
    inputVal: "",
    search_course: [],
    search_flag: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo,
    })
  },
  //显示搜索内容
  showInput: function () {
    this.setData({
      inputShowed: true,
      search_flag: 0
    });
  },
  //清除搜索内容
  clearInput: function () {
    this.setData({
      inputVal: "",
      search_flag: 0
    });
  },
  //获取搜索内容
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value,
      search_flag: 0
    });
  },
  //提交搜索内容
  searchInput: function (e) {
    var that = this
    var options = {
      url: config.service.searchCourseUrl,
      data: {
        course_id: that.data.inputVal,
        open_id: that.data.userInfo.openId
      },
      method: `POST`,
      success(result) {
        console.log(result.data)
        var search_course = []
        var search_flag = 0
        search_course.push(result.data)
        if (search_course[0].course_id == -1)
          search_flag = -1
        else {
          search_flag = 1
        }
        that.setData({
          search_course: search_course,
          search_flag: search_flag
        })
      },
      fail(error) {
        util.showModel('请求失败', error)
      }
    }
    qcloud.request(options)
  },
  //扫码处理函数
  scanQR: function () {
    wx.scanCode({
      success: (res) => {
        if (res.path.split('?')[0] != 'pages/authorization/authorization') util.showModel('非法二维码', '二维码内容无法识别')
        let scene = res.path.split('%26')[1]
        wx.navigateTo({
          url: '../searchCourseInfo/searchcourseinfo?scene=' + scene
        })
      }
    })
  },
  //创建班级跳转
  creatCourse: function () {
    wx.navigateTo({
      url: "../createNewCourse/createnewcourse",
    })
  }
})

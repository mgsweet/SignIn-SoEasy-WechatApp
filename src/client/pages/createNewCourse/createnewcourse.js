// pages/createnewcourse/createnewcourse.js
// 创建课程的页面
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
    course_name: "",
    course_info: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        username: app.globalData.userInfo.user_name,
        userid: app.globalData.userInfo.user_id,
      })
    }
  },
  //获取注册名字
  nameChange: function (e) {
    this.setData({
      course_name: e.detail.value
    })
  },
  //获取注册学号
  infoChange: function (e) {
      this.setData({
        course_info: e.detail.value
      })
  },
  //提交课程创建信息
  submit: function () {
    if(this.data.course_name == "" ){
      util.showModel('请求失败',"课程名不能为空")
    } else if(this.data.course_name.length > 20) {
      util.showModel('请求失败', "课程名小于20个字符")      
    } else if(this.data.course_info.length > 200) {
      util.showModel('请求失败', "课程信息小于200个字符")
    } else {
      util.showBusy('创建中...')
      var that = this
      var options = {
        url: config.service.createCourseUrl,
        login: true,
        data: {
          course_name: that.data.course_name,
          course_info: that.data.course_info,
          open_id: that.data.userInfo.openId
        },
        method: `POST`,
        success(result) {
          if (result.statusCode == 500) {
            var error
            if (result.error == 'ERR_COURSE_NAME' || result.error == 'ERR_COURSE_INFO') {
              error = '课程信息格式有误'
            }
            wx.hideToast()
            wx.showModal({
              title: '请求失败',
              content: error,
              success: function (res) {
                if (res.confirm) {
                  wx.switchTab({
                    url: '../index/index',
                  })
                }
              }
            })
          } else {
            util.showSuccess('创建课程成功') 
            wx.switchTab({
              url: '../index/index',
            })
          }
        },
        fail(error) {
          util.showModel('请求失败', "提交信息格式不正确")
          console.log("create error")
          console.log(error)
        }
      }
      qcloud.request(options)
    }
  },
})
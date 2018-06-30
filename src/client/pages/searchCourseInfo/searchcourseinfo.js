// pages/courseinfo/courseinfo.js
// 搜索得到课程详细信息的页面
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
    course_creator: "",
    course_id: "",
    course_info: "",
    level: -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.scene) {
      var scene = decodeURIComponent(options.scene)
      this.data.course_id = scene
      app.initGlobalTask()
    } else {
      this.data.course_id = options.course_id
    }

    if (app.globalData.userInfo == null) {
      console.log("Need to login before join class")
      return
    }

    this.setData({
      userInfo: app.globalData.userInfo,
      course_id: this.data.course_id,
      course_creator: '',
    })

    var that = this
    var postOptions = {
      // url: config.service.searchCourseDetailUrl,
      url: config.service.searchCourseUrl,
      data: {
        course_id: that.data.course_id,
        open_id: that.data.userInfo.openId
      },
      method: `POST`,
      success(result) {
        console.log(result)
        if (result.statusCode == 500) {
          if (result.data == "ERR_INVALID_COURSE_ID") {
            var error = "该课程不存在或已删除"
          }
          wx.hideToast()
          wx.showModal({
            title: '请求失败',
            content: error,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '../index/index',
                })
              }
            }
          })
        } else {
          that.setData({
            course_id: result.data.course_id,
            course_name: result.data.course_name,
            course_info: result.data.course_info,
            course_creator: result.data.ownerName,
            level: result.data.level,
            task: result.data.task
          })
          if (result.data.level == 3){
            wx.redirectTo({
              url: '../jointCourseInfo/jointcourseinfo?course_id=' + that.data.course_id + '&task=' + that.data.task + '&course_name=' + that.data.course_name + '&course_info=' + that.data.course_info+'&level=' + that.data.level,
            })
          } else if (result.data.level != -1){
            wx.redirectTo({
              url: '../createdCourseInfo/createdcourseinfo?course_id=' + that.data.course_id + '&task=' + that.data.task + '&level=' + that.data.level + '&course_name=' + that.data.course_name + '&course_info=' + that.data.course_info,
            })
          }
        }

      },
      fail(error) {
        util.showModel('请求失败', error)
      }
    }
    qcloud.request(postOptions)
  },

  //提交加入课程
  joinCourse: function () {
    if(this.data.isjoin) return
    var that = this
    var postOptions = {
      url: config.service.joinCourseUrl,
      data: {
        course_id: that.data.course_id,
        open_id: that.data.userInfo.openId
      },
      method: `POST`,
      success(result) {
        if (result.statusCode == 500) {
          var error
          if (result.data == "ERR_INVALID_COURSE_ID") {
            error = '该课程不存在或已删除'
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
          wx.switchTab({
            url: '../index/index',
          })
        }
      },
      fail(error) {
        util.showModel('加入课程失败', error)
      }
    }
    qcloud.request(postOptions)

  }
})
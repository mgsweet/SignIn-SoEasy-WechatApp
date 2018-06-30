// pages/changeCourseInfo/changecourseinfo.js
// 修改课程信息的页面
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
  onLoad: function (option) {
    this.setData({
      userInfo: app.globalData.userInfo,
      course_id: option.course_id, 
      course_name: option.course_name,
      course_info: option.course_info
    })
  },
  //提交课程修改信息
  submit: function () {
    if (this.data.course_name == "") {
      util.showModel('请求失败', "课程名不能为空")
    } else if (this.data.course_name.length > 20) {
      util.showModel('请求失败', "课程名小于20个字符")
    } else if (this.data.course_info.length > 200) {
      util.showModel('请求失败', "课程信息小于200个字符")
    } else {
      var that = this 
      util.showBusy('提交中...')
      var options = {
        url: config.service.updateCourseInfoUrl,
        login: true,
        data: {
          open_id: that.data.userInfo.openId,
          course_id: that.data.course_id,
          course_name: that.data.course_name,
          course_info: that.data.course_info
        },
        method: `POST`,
        success(result) {
          console.log(result)          
          if (result.statusCode == 500) {
            var error
            if (result.error == 'ERR_UNAUTHORIZED_OPERATION'){
              error = '您没有修改权限'
            }
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
            wx.navigateBack({ 
              delta: 2
            })
          }
        },
        fail(error) {
          console.log("Get Error")
          console.log(error)
          util.showModel('请求失败', "提交信息格式不正确")
        }
      }
      qcloud.request(options)
    }
  },
  /**
   * 课程名输入处理函数
   */
  nameChange: function (e) {
    this.data.course_name = e.detail.value
  },
  /**
   * 课程信息输入处理函数
   */
  infoChange: function (e) {
    this.data.course_info = e.detail.value
  },

})
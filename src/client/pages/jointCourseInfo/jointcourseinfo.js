// pages/jointcourseinfo/jointcourseinfo.js
// 跳转参数
// ../jointcourseinfo/jointcourseinfo?course_id={{item.course_id}}&task={{item.task}}
// 已加入课程的页面
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
    course_id: "",
    course_name: "",
    course_info: "",
    task: 0,
    level:3,
    record: [],
    total: "",
    miss: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    this.setData({
      userInfo: app.globalData.userInfo,
      course_id: option.course_id,
      course_name: option.course_name,
      course_info: option.course_info,
      task: option.task,
      level: option.level,
    })
    this.getJointCourseInfo()
  },
  //获取课程信息
  getJointCourseInfo: function(){
    var that = this
    var options = {
      url: config.service.getJointCourseRecordUrl,
      data: {
        course_id: that.data.course_id,
        open_id: that.data.userInfo.openId,
      },
      method: `POST`,
      success(result) {
        console.log(result)
        if (result.statusCode == 500) {
          var error
          if (result.data == "ERR_INVALID_COURSE_ID") {
            error = '该课程不存在或已删除'
          }
          if (result.data == 'ERR_NOT_IN_THIS_COURSE') {
            error = '您未加入该课程'
          }
          if (result.data == 'ERR_BECOME_MANAGER') {
            error = '您已成为课程管理员'
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
          var miss = 0
          var hit = 0
          var record = result.data.data.record
          var record_list = []
          for (var i = 0; i < record.length; i++) {
            if (record[i] == "0") {
              miss++
              record_list.push({
                index: i,
                is_sign: record[i]
              })
            } else {
              // if(hit >= )
              var time = util.formatTime(result.data.data.record_detail[hit].signin_time)
              record_list.push({
                index: i,
                is_sign: record[i],
                time: time
              })
              hit++              
            }
          }
          that.setData({
            course_name: result.data.data.course_name,
            course_id: result.data.data.course_id,
            record: record_list,
            task: result.data.data.task,
            total: result.data.data.record.length,
            miss: miss
          })
        }
      },
      fail(error) {
        wx.switchTab({
          url: '../index/index',
        })
      }
    }
    qcloud.request(options)
  },
  quitCourseConfirm: function(){
    var that = this
    wx.showModal({
      title: '是否确定退出课程',
      content: '课程的所有签到记录将会被删除',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');
          that.quitCourse();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  quitCourse:function(){
    var that = this
    var options = {
      url: config.service.quitCourseUrl,
      data: {
        course_id: that.data.course_id,
        open_id: that.data.userInfo.openId,
      },
      method: `POST`,
      success(result) {
        console.log(result)
        if (result.statusCode == 500) {
          var error
          if (result.data == "ERR_INVALID_COURSE_ID") {
            error = '该课程不存在或已删除'
          }
          if (result.data == 'ERR_NOT_IN_THIS_COURSE') {
            error = '您未加入该课程'
          }
          if (result.data == 'ERR_BECOME_MANAGER') {
            error = '您已成为课程管理员'
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
        wx.switchTab({
          url: '../index/index',
        })
      }
    }
    qcloud.request(options)
  }
})
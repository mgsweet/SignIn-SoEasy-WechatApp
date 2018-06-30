// pages/createdcourseinfo/createdcourseinfo.js
// 跳转参数
// ../createdcourseinfo/createdcourseinfo?course_id={{item.course_id}}&task={{item.task}}&level={{item.level}}
// 可管理课程的页面
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
    level: 1,
    task: 0,
    total: 0
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
  },

  onShow: function(){
    this.getCreatedCourseInfo()
  },
  //获取当前课程信息
  getCreatedCourseInfo: function () {
    var that = this
    var options = {
      url: config.service.getCreatededCourseRecordUrl,
      login: true,
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
          if (result.data = 'ERR_UNAUTHORIZED_OPERATION') {
            error = '您没有修改权限'
          }
          if (result.data = 'ERR_NOT_IN_THIS_COURSE') {
            error = '您未加入该课程'
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
          that.setData({
            task: result.data.data.task,
            total: result.data.data.count
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
  deleteCourse: function () {
    if(this.data.level != 1){
      util.showModel('请求失败', '您没有修改权限')      
      wx.redirectTo({
        url: '../home/home',
      })
    }
    util.showBusy('删除中...')
    var that = this
    var options = {
      url: config.service.deleteCourseUrl,
      login: true,
      data: {
        course_id: that.data.course_id,
        open_id: that.data.userInfo.openId
      },
      method: `POST`,
      success(result) {
        console.log(result)
        //课程不存在
        if (result.statusCode == 500) {
          var error
          if (result.data == "ERR_INVALID_COURSE_ID") {
            error = '该课程不存在或已删除'
          }
          if (result.data = 'ERR_UNAUTHORIZED_OPERATION') {
            error = '您没有修改权限'
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
        console.log(error)
        util.showModel('请求失败', '该课程不存在')
        wx.switchTab({
          url: '../index/index',
        })
      }
    }
    qcloud.request(options)
  },
  //删除课程操作
  deleteCourseConfirm: function() {
    var that = this
    wx.showModal({  
      title: '是否确定删除课程',  
      content: '课程的所有信息将会被删除，包括所有学生签到记录，学生将会被移出课程',  
      success: function(res) {  
        if (res.confirm) {  
          console.log('用户点击确定');
          that.deleteCourse();
        } else if (res.cancel) {  
          console.log('用户点击取消')  
        }
      }  
    })
  }
})
// pages/memberdetail/memberdetail.js 
// 跳转参数
// ../memberdetail/memberdetail?course_id={{course_id}}&level={{level}}&umembername={{item.user_name}}&memberid={{item.user_id}}
// 管理成员页面
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
    member_name: "",
    member_id: "",
    member_open_id: "",
    member_level: 3,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    console.log(option)
    this.setData({
      userInfo: app.globalData.userInfo,
      course_id: option.course_id,
      course_info: option.course_info,
      course_name: option.course_name,      
      level: option.level,
      member_name: option.member_name,
      member_id: option.member_id,
      member_open_id: option.member_open_id,
      member_level: option.member_level,
    }) 
  },
  //修改权限
  changeLevel: function(newLevel) {
    var that = this
    console.log(newLevel)
    var options = {
      url: config.service.changeLevelUrl,
      login: true,
      data: {
        level: newLevel,
        course_id: that.data.course_id,
        member_open_id: that.data.member_open_id,
      },
      method: `POST`,
      success(result) {
        if (result.statusCode == 500) {
          var error
          if (result.data == 'ERR_COURSE_NOT_FOUND') {
            error = '该课程不存在或已删除'
          }
          if (result.data == 'ERR_COURSE_MAN_PERMISSION_DENIED') {
            error = '您没有修改权限'
          }
          if (result.data == 'ERR_MANAGER_AND_MEMBER_SAME') {
            error = '不可设置自己的LEVEL'
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
          wx.navigateBack({})
        }
      },
      fail(error) {
        util.showModel('请求失败', error)
      }
    }
    qcloud.request(options)
  },
  //添加管理员权限
  setManager: function() {
    this.changeLevel(2)
  },
  //取消管理员权限
  cancelManager: function() {
    this.changeLevel(3)
  },
  //删除成员
  deleteMember: function () {
    var that = this
    var options = {
      url: config.service.deleteMemberUrl,
      login: true,
      data: {
        course_id: that.data.course_id,
        member_open_id: that.data.member_open_id
      },
      method: `POST`,
      success(result) {
        if (result.statusCode == 500) {
          var error
          if (result.data == 'ERR_COURSE_NOT_FOUND') {
            error = '该课程不存在或已删除'
          }
          if (result.data == 'ERR_COURSE_MAN_PERMISSION_DENIED') {
            error = '您没有修改权限'
          }
          if (result.data == '1ERR_USER_NOT_FOUND') {
            error = '该成员不存在或已退出课程'
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
          wx.navigateBack({})
        }
      },
      fail(error) {
        console.log(result)
        util.showModel('请求失败', error)
      }
    }
    qcloud.request(options)
  },
})
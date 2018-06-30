// pages/memberListInfo/memberlistinfo.js
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
    course_time: 0,
    level: 1,
    member_list: [],
    member_num:0,
    task: 0
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
      course_time: option.course_time,
      task: option.task,
      level: option.level,
    })
  }, 
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getMemberList()
  },
  //获取成员信息
  getMemberList: function(){
    var that = this
    var options = {
      url: config.service.getMembersListUrl,
      login: true,
      data: {
        course_id: that.data.course_id,
      },
      method: `GET`,
      success(result) {
        console.log(result)
        if (result.statusCode == 500) {
          var error
          if (result.data == 'ERR_COURSE_NOT_FOUND') {
            error = '该课程不存在或已删除'
          }
          if (result.data == 'ERR_COURSE_MAN_PERMISSION_DENIED') {
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
          that.setData({
            member_list: result.data.member_list,
            member_num: result.data.member_list.length
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
// pages/userinfo.js
// 修改用户信息的页面
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
    newuserInfo: {
      user_name: "",
      user_id: "",
    },
    userInfo:{},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      })
    }
  },
  //提交用户修改信息
  submit: function () {
    if (this.data.newuserInfo.user_name == "" || this.data.newuserInfo.user_id == "") {
      util.showModel('请求失败', "修改姓名或学号不能为空")
    } else if (this.data.newuserInfo.user_name.length > 100) {
      util.showModel('请求失败', "姓名小于100个字符")
    } else if (this.data.newuserInfo.user_id.length > 100) {
      util.showModel('请求失败', "学号小于100个字符")
    } else {
      var that = this
      util.showBusy('提交中...')
      var options = {
        url: config.service.updateUserInfoUrl,
        login: true,
        data: {
          user_id: that.data.userInfo.user_id,
          user_name: that.data.userInfo.user_name,
          new_user_id: that.data.newuserInfo.user_id,
          new_user_name: that.data.newuserInfo.user_name
        },
        method: `POST`,
        success(result) {
          if (result.statusCode == 500) {
            var error 
            if (result.error == 'ERR_WHEN_SET_USER_ID' || result.error == 'ERR_WHEN_SET_USER_NAME') {
              error = '个人信息格式有误'
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
            util.showSuccess('个人信息修改成功')
            app.globalData.userInfo.user_name = that.data.newuserInfo.user_name
            app.globalData.userInfo.user_id = that.data.newuserInfo.user_id
            wx.switchTab({
              url: '../userPage/userPage',
            })
          }
        },
        fail(error) {
          util.showModel('请求失败', "提交信息格式不正确")
        }
      }
      qcloud.request(options)
    }
  },
  /**
   * 姓名输入处理函数
   */
  nameChange: function (e) {
    this.data.newuserInfo.user_name = e.detail.value
  },
  /**
   * 学号输入处理函数
   */
  idChange: function (e) {
    this.data.newuserInfo.user_id = e.detail.value
  }
})
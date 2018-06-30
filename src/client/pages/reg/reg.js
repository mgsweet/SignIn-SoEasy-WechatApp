// pages/reg/reg.js
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.userInfo = app.globalData.userInfo
    this.setData({
      userInfo: this.data.userInfo
    })
  },
  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {

  },
  //提交注册信息
  submit: function () {
    if (this.data.userInfo.user_name == "" || this.data.userInfo.user_id == "") {
      util.showModel('请求失败', "姓名或学号不能为空")
    } else if (this.data.userInfo.user_name.length > 100) {
      util.showModel('请求失败', "姓名小于100个字符")
    } else if (this.data.userInfo.user_id.length > 100) {
      util.showModel('请求失败', "学号小于100个字符")
    } else {
      util.showBusy('注册中...')
      var that = this
      var options = {
        url: config.service.setUserInfoUrl,
        login: true,
        data: {
          open_id: that.data.userInfo.open_id,
          user_id: that.data.userInfo.user_id,
          user_name: that.data.userInfo.user_name
        },
        method: `POST`,
        success(result) {
          util.showSuccess('请求成功完成')
          var t_userInfo = that.data.userInfo
          console.log(t_userInfo)
          t_userInfo.isSignUp = 1
          //更新Session
          let session = qcloud.Session.get();
          session.user = {
            isSignUp: true,
            user_name: that.data.userInfo.user_name,
            user_id: that.data.userInfo.user_id
          }
          qcloud.Session.set(session)

          that.setData({
            userInfo: t_userInfo
          })
          app.globalData.userInfo = t_userInfo
          wx.switchTab({
            url: '../index/index',
          })
        },
        fail(error) {
          util.showModel('请求失败', error)
        }
      }
      qcloud.request(options)
    }
  },

  //获取注册名字
  nameChange: function (e) {
    this.data.userInfo.user_name = e.detail.value
  },
  //获取注册学号
  idChange: function (e) {
    this.data.userInfo.user_id = e.detail.value
  }
})

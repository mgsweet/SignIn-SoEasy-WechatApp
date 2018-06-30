// pages/authorization/authorization.js
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
    code: undefined,
    userDenyAuth: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  updateUserInfo: function(e) {
    let that = this;
    if (e.detail.errMsg === "getUserInfo:fail auth deny") {
      that.data.userDenyAuth = true;
      that.setData({
        userDenyAuth: that.data.userDenyAuth
      })
      console.log('用户拒绝授权')
    } else {
      console.log('用户允许授权')
      util.showBusy('正在登录..')
      let loginParams = {
        code: this.data.code,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      }
      qcloud.requestLogin({
        loginParams,
        success(result) {
          console.log(result)

          app.globalData.userInfo = result.userinfo
          app.globalData.userInfo['isSignUp'] = result.user.isSignUp
          app.globalData.userInfo['user_id'] = result.user.user_id
          app.globalData.userInfo['user_name'] = result.user.user_name

          wx.switchTab({
            url: '../index/index',
          })
        },

        fail(error) {
          util.showModel('登录失败', error)
          console.log('登录失败', error)
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)

    if (options.code) {
      this.data.code = options.code;
      this.setData({
        code: this.data.code
      })
    }
    
    if (app.globalData.userInfo) {
      wx.switchTab({
        url: '../index/index',
      })

    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        wx.switchTab({
          url: '../index/index',
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      // TODO
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  }
})
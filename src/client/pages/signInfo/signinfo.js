// pages/signInfo/signInfo.js
// 跳转参数
// ../signInfo/signInfo?course_id={{course_id}}&task=
// 发起签到
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
    course_id: "0",
    course_name: "",
    course_info: "",
    need_location: false,
    need_pin: false,
    pin: "",
    task: 0,
    latitude: -1,
    longitude: -1,
    min: 0,
    sec: 0,
    delay_time: 60000,
    count: 0,
    array: ['1分钟内', '3分钟内', '5分钟内', '10分钟内', '30分钟内'],
    array2: [1, 3, 5, 10, 30],
    index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    this.setData({
      userInfo: app.globalData.userInfo,
      course_id: option.course_id,
      delay_time: 60000,
      task: option.task,
      course_name: option.course_name,
      course_info: option.course_info
    })
    // get pin
    var code = this.generateCode(4)
    this.setData({
        pin: code
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // get location 
    this.getSignInDetail()  
  },
  location: function () {
    var that = this
    wx.getLocation({
      success: function (res) {
        console.log(res)
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude, 
          need_location: !that.data.need_location
        })
      },
      fail: function(res){
        wx.showModal({
          title: '未授权获取地理信息',
          content: '无法添加地理验证',
          success: function (res) {
            if (res.confirm) {

            }
          }
        })
      }
    }) 
  },
  pin: function () {
    this.setData({
      need_pin: !this.data.need_pin
    })
  },
  timeChange: function(e){
    this.setData({
      index: e.detail.value,
    })
    this.setData({
      delay_time: this.data.array2[this.data.index]*60000
    })
  },
  submitTask: function(){
    var that = this 
    var options = {
      url: config.service.submitSignInUrl,
      data: {
        course_id: that.data.course_id,
        open_id: that.data.userInfo.openId, 
        need_pin: that.data.need_pin,
        need_location: that.data.need_location,
        delay_time: that.data.delay_time,
        pin: that.data.pin,
        latitude: that.data.latitude,
        longitude: that.data.longitude
      },
      method: `POST`,
      success(result) {
        if (result.statusCode == 500){
          var error
          var flag = 0
          if (result.data == 'ERR_INVALID_COURSE_ID') {
            error = '该课程不存在或已删除'
          }
          if (result.data == 'ERR_NOT_IN_THIS_COURSE') {
            error = '您未加入该课程'
          }
          if (result.data == 'ERR_UNAUTHORIZED_OPERATION') {
            error = '您已不是课程管理员'
          }
          if (result.data == 'ERR_CORSE_SIGNING_IN') {
            error = '已经有签到正在进行'
            flag = 1
          }
          
          wx.hideToast()
          wx.showModal({
            title: '请求失败',
            content: error,
            success: function (res) {
              if (res.confirm) {
                if (flag == 0) {
                  wx.switchTab({
                    url: '../index/index',
                  })
                }
              }
            }
          })
        }else {
          that.onShow()
        }
      },
      fail(error) {
        util.showModel('请求失败', error)
      }
    } 
    qcloud.request(options)
  }, 
  getSignInDetail: function () {
    var that = this
    var options = {
      url: config.service.getSignInDetailUrl,
      data: {
        course_id: that.data.course_id,
        open_id: that.data.userInfo.openId,
      },
      method: `POST`,
      success(result) {
        if (result.statusCode == 500) {
          var error
          if (result.data == 'ERR_INVALID_COURSE_ID') {
            error = '该课程不存在或已删除'
          }
          if (result.data == 'ERR_NOT_IN_THIS_COURSE') {
            error = '您未加入该课程'
          }
          if (result.data == 'ERR_BECOME_MANAGER') {
            error = '您已成为课程管理员'
          }
          if (result.data == 'ERR_SIGNIN_OVER') {
            error = '签到已经结束'
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
          if (result.data.data.course.task == 1){
            that.setData({
              delay_time: result.data.data.signin_state.delay_time,
              need_pin: result.data.data.signin_state.need_pin,
              need_location: result.data.data.signin_state.need_location,
              pin: result.data.data.signin_state.pin,
              task: result.data.data.course.task
            })
            that.signInCountDown(that.data.delay_time)
          }
        }
      },
      fail(error) {
        util.showModel('请求失败', error)
      }
    }
    qcloud.request(options)
  },
  //生成随机PIN码
  generateCode: function(k) {
    var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    var res = "";
    for(var i = 0; i < k; i++) {
      var id = Math.ceil(Math.random() * 10-1);
      if (id ==0 && i == 0) id = Math.ceil(Math.random() * 8+1)
      res += chars[id];
    }
    return res;
  }, 
  signInCountDown: function (count) {
    var that = this
    countDown(that, Math.floor(count / 1000) + 1);
  },
  signInOver: function() {
    // get pin
    var code = this.generateCode(4) 
    this.setData({
      task: 0,
      index: 0,
      delay_time: 60000,
      need_pin: 0,
      need_location: 0,
      pin: code
    })
  }
})
//倒计时
function countDown(that, count) {
  if (count < 0) {
    that.signInOver()
    return
  }
  that.setData({
    min: Math.floor(count/60),
    sec: Math.floor((count)%60)
  })
  
  setTimeout(function () {
    count--;
    countDown(that, count);
  }, 1000)
}
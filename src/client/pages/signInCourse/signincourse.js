// pages/sigincourse/signincourse.js
// pages/jointcourseinfo/jointcourseinfo.js
// 跳转参数
// ../signincourse/signincourse?course_id={{item.course_id}}&course_name={{item.course_name}}&course_info={{item.course_info}}&task={{item.task}}&level={{item.level}}&course_time={{item.course_time}}
// 签到主页
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
    delay_time: 0,
    need_pin: 1,
    need_location: 1,
    task: 0,
    level: 0,
    min: 0,
    sec: 0, 
    longitude: 0,
    latitude: 0,
    pin: "",
    time: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    console.log(option)
    var time = util.formatTime(new Date())
    this.setData({
      userInfo: app.globalData.userInfo,
      course_id: option.course_id,
      course_name: option.course_name,
      course_info: option.course_info,
      task: option.task,
      level: option.level,
      time: time
    })
    this.getSignInDetail()
    var that = this
    wx.getLocation({
      success: function(res) {
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude,
        })
      },
    })
  },
  //输入pin处理函数
  pinChange:function(e){
    this.setData({
      pin: e.detail.value
    })
  },
  //获取该签到详细信息
  getSignInDetail: function(){
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
          console.log(result)
          that.setData({
            delay_time: result.data.data.signin_state.delay_time,
            need_pin: result.data.data.signin_state.need_pin,
            need_location: result.data.data.signin_state.need_location,
            task: result.data.data.course.task
          })
          that.signInCountDown(that.data.delay_time)
        }
      },
      fail(error) {
        util.showModel('请求失败', '服务器异常')
      }
    }
    qcloud.request(options) 
  },
  //签到
  signIn: function () {
    if(this.data.need_pin == 1 && this.data.pin == ""){
      util.showModel('签到失败', "需要输入pin码")
      return
    }
    if (this.data.need_location == 1) {
      var that = this
      wx.getLocation({
        success: function (res) {
          // console.log(res,that)
          that.setData({
            latitude: res.latitude,
            longitude: res.longitude 
          })
          util.showBusy('签到中...')
          var options = {
            url: config.service.signInUrl,
            login: true,
            data: {
              open_id: that.data.userInfo.openId,
              course_id: that.data.course_id,
              longitude: that.data.longitude,
              latitude: that.data.latitude,
              pin: that.data.pin
            },
            method: `POST`,
            success(result) {
              if (result.statusCode == 500) {
                var error
                var flag = 1
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
                if (result.data == 'ERR_SIGNIN_LOCATION') {
                  error = '签到地理位置超出范围'
                  flag = 0
                }
                if (result.data == 'ERR_SIGNIN_PIN') {
                  error = 'pin码错误'
                  flag = 0
                }
                wx.hideToast()
                wx.showModal({
                  title: '请求失败',
                  content: error,
                  success: function (res) {
                    if (res.confirm) {
                      if (flag == 1)
                        wx.switchTab({
                          url: '../index/index',
                        })
                      else
                        that.onShow()
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
              util.showModel('请求失败', error)
              wx.switchTab({
                url: '../index/index',
              })
            }
          }
          qcloud.request(options)
        },
        fail: function (res) {
          wx.showModal({
            title: '未授权获取地理信息',
            content: '请将小程序删除后再进入授权',
            success: function (res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '../index/index',
                })
              }
            }
          })
        }
      })
    } else {
      util.showBusy('签到中...')
      var that = this
      var options = {
        url: config.service.signInUrl,
        login: true,
        data: {
          open_id: that.data.userInfo.openId,
          course_id: that.data.course_id,
          longitude: that.data.longitude,
          latitude: that.data.latitude,
          pin: that.data.pin
        },
        method: `POST`,
        success(result) {
          if (result.statusCode == 500) {
            var error
            var flag = 1
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
            if (result.data == 'ERR_SIGNIN_LOCATION') {
              error = '签到地理位置超出范围'
              flag = 0
            }
            if (result.data == 'ERR_SIGNIN_PIN') {
              error = 'pin码错误'
              flag = 0
            }
            wx.hideToast()
            wx.showModal({
              title: '请求失败',
              content: error,
              success: function (res) {
                if (res.confirm) {
                  if (flag == 1)
                    wx.switchTab({
                      url: '../index/index',
                    })
                  else
                    that.onShow()
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
          util.showModel('请求失败', error)
          wx.switchTab({
            url: '../index/index',
          })
        }
      }
      qcloud.request(options)
    }
  },
  //倒计时 
  signInCountDown: function () {
    var that = this
    var count = that.data.delay_time
    countDown(that, Math.floor(count / 1000) + 1);
  },
  //倒计时结束
  signInOver: function () {
    wx.switchTab({
      url: 'pages/index/index',
    })
  }
})
//倒计时
function countDown(that, count) {
  if (count == 0) {
    console.log("count end time")
    console.log(Date.now())
    that.signInOver()
    return
  }
  if (count)
    that.setData({
      min: Math.floor(count / 60),
      sec: Math.floor((count) % 60)
    })

  setTimeout(function () {
    count--; 
    countDown(that, count);
  }, 1000)
}
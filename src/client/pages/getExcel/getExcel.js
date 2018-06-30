// pages/sendEmail/sendEmail.js
var util = require('../../utils/util.js')
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    course_id: "",
    emailAddress: ""
  },

  emailAddressChange: function(e) {
    this.data.emailAddress = e.detail.value
  },

  sendEmail: function() {
    if (this.data.emailAddress == "") {
      util.showModel('请求失败', "邮箱不能为空!")
      return
    }
    var myReg=/^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;
    if(myReg.test(this.data.emailAddress)) {
      var that = this 
      util.showBusy('生成中...')
      var options = {
        url: config.service.getExcelUrl,
        login: true,
        data: {
          course_id: that.data.course_id,
          email_address: that.data.emailAddress
        },
        method: `GET`,
        success(result) {
          console.log(result)          
          if (result.statusCode == 200) {
            util.showModel('发送成功', "请注意查收")
            wx.showModal({
              title: '发送成功',
              content: '请注意查收',
              showCancel: false,
              success: function(res) {
                if (res.confirm) {
                  wx.switchTab({
                    url: '../index/index',
                  })
                }
              }
            })
          } else {
            var error
            if (result.data == 'ERR_NO_SIGNIN_RECORD') {
              error = '无签到记录'
            }
            else if (result.data == 'ERR_COURSE_NOT_FOUND') {
              error = '课程被移除'
            }
            else if (result.data == 'ERR_COURSE_MAN_PERMISSION_DENIED') {
              error = '无导出权限'
            }
            else if (result.data == 'ERR_NO_SIGNIN_MEMBER') {
              error = '课程无成员'
            }
            util.showModel('导出失败', error)
          }
        },
        fail(error) {
          console.log("Get Error")
          console.log(error)
          util.showModel('导出失败', error)
        }
      }
      qcloud.request(options)
    } else {
      console.log("邮箱格式不对!")
      util.showModel('导出失败', "邮箱格式不对!")
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      course_id: options.course_id
    })
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
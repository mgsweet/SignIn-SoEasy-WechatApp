// pages/addAdmin/addAdmin.js
var config = require('../../config')
var util = require('../../utils/util.js')
var qcloud = require('../../vendor/wafer2-client-sdk/index')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    course_id: undefined,
    course_name: undefined,
    course_info: undefined,
  },

  getCourseQR: function() {
    let that = this
    qcloud.request({
      url: config.service.getCourseQRUrl,
      data: {
        course_id: that.data.course_id
      },
      success: function(res) {
        console.log(res)
      }
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.data.course_id = options.course_id
    this.data.course_name = options.course_name
    this.data.course_info = options.course_info
    this.setData({
      course_id: this.data.course_id,
      course_name: this.data.course_name,
      course_info: this.data.course_info
    })
    this.getCourseQR()
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
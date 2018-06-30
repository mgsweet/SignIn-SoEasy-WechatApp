// pages/showCourseQR/showCourseQR.js
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
    qrImgSrc: ""
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.course_id = options.course_id
    this.data.course_name = options.course_name
    this.setData({
      course_id: this.data.course_id,
      course_name: this.data.course_name,
      qrImgSrc: config.service.getCourseQRUrl + '?course_id=' + this.data.course_id
    })
    console.log(this.data.qrImgSrc)
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
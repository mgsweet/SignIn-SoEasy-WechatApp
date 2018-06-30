// pages/signInRecord/signinrecord.js
//签到统计界面
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
    level: 1,
    task: 0,
    member:[]
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
      task: option.task,
      level: option.level,
      total: 0,
      rate: 0
    })
    this.getCreatedCourseInfo()
  },
  //获取课程信息
  getCreatedCourseInfo: function () {
    var that = this
    var options = {
      url: config.service.getCreatededCourseRecordUrl,
      login: true,
      data: {
        course_id: that.data.course_id,
        open_id: that.data.userInfo.openId
      },
      method: `POST`,
      success(result) {
        if (result.statusCode == 500) {
          var error
          if (result.error == '1') {
            error = '您没有修改权限'
          }
          if (result.error == '2') {
            error = '课程信息格式有误'
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
          var member = result.data.data.member
          var member_num = 0
          var member_list = []
          if (member.length > 0){
            var all_hit = 0
            for (var i = 0; i < result.data.data.member.length; i++) {
              if(member[i].level == 3) {
                member_num++
                var record = member[i].record
                var hit = 0
                for (var j = 0; j < record.length; j++) {
                  if(record[j] == "1"){
                    hit++
                  }
                }
                all_hit += hit;
                member[i].hit = hit
                member_list.push(member[i])
              }
            }
            var rate = (all_hit / (member[0].record.length * member_num)).toFixed(2) 
            if (member[0].record.length == 0) rate = 0
            that.setData({
              total: member[0].record.length,
              member: member_list,
              member_num: member_num,
              all_hit: all_hit,
              rate: rate*100
            })
            
          }
        }
      },
      fail(error) { 
        wx.switchTab({
          url: '../index/index',
        })
      }
    }
    qcloud.request(options)
  },  
})
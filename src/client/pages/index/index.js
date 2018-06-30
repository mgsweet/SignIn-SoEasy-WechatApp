// pages/index/index.js 
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
    task_course: [],
    joint_course: [],
    created_course: [],
    count_down_list: []
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function (e) {
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function (e) {
  },

  onShareAppMessage(e) {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData)
    if (app.globalData.userInfo.isSignUp == false){
      wx.redirectTo({
        url: '../reg/reg'
      })
    } else if (app.globalData.task.code == 1) {
      app.globalData.task.code == 0
      wx.navigateTo({
        url: '../searchCourseInfo/searchcourseinfo?scene=' + app.globalData.task.scene
      })
    } else {
      this.setData({
        userInfo: app.globalData.userInfo,
      })
    }
  },
  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    var that = this

    if (app.globalData.userInfo) {
      that.getCourseList() 
    }
  },
  //获取课程列表
  getCourseList: function () {
    var that = this
    var options = {
      url: config.service.getCourseListUrl,
      login: true,
      data: {
        open_id: that.data.userInfo.open_id
      },
      method: `GET`,
      success(result) {
        console.log(result)
        that.setData({
          task_course: []
        })
        var task_course = []
        var joint_course = []
        var created_course = []
        for (var i = 0; i < result.data.data.length; i++) {
          if (result.data.data[i].task > 0) {
            result.data.data[i]["min"] = 0
            result.data.data[i]["sec"] = 0
            task_course.push(result.data.data[i])
          } 
          if (result.data.data[i].level == 3) joint_course.push(result.data.data[i])
          if (result.data.data[i].level < 3) created_course.push(result.data.data[i])
        }
        that.setData({
          task_course: task_course,
          joint_course: joint_course,
          created_course: created_course
        })
        that.startCountDown()
      },
      fail(error) {
        util.showModel('请求失败', error)
      }
    }
    qcloud.request(options)
  },
  startCountDown: function(){
    var new_task = []
    for (var i = 0; i < this.data.task_course.length; i++) {
      if (!this.data.count_down_list.includes(this.data.task_course[i].course_id)) {
        new_task.push(this.data.task_course[i].course_id)
        this.data.count_down_list.push(this.data.task_course[i].course_id)
      }
    }
    for (var i = 0; i < this.data.task_course.length; i++) {
      var that = this
      var a = function (num) {
        if (new_task.includes(that.data.task_course[num].course_id)) {
          var count = Math.floor(that.data.task_course[num].delay_time / 1000) + 1
          countDown(that, count, that.data.task_course[num].course_id);
        }
      }(i)
    }
  },
  signInOver: function (course_id) {
    var new_count_down_list = this.data.count_down_list
    var index = new_count_down_list.indexOf(course_id)
    
    new_count_down_list.splice(index, 1)
    this.setData({
      count_down_list: new_count_down_list
    })
    this.getCourseList()
  },
  //下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    if (app.globalData.userInfo) {
      this.getCourseList()
    }
    //模拟加载
    setTimeout(function () {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  }
})
//倒计时
function countDown(that, count, course_id) {
  if (count < 0) {
    that.signInOver(course_id)
    return 
  } else{

    var task_list = that.data.task_course
    
    for (var i = 0; i < task_list.length; i++) {
      if(course_id == task_list[i].course_id) {
        task_list[i].min = Math.floor(count / 60)
        task_list[i].sec = Math.floor((count) % 60)
        that.setData({
          task_course: task_list
        })
      }
    }

    setTimeout(function () {
      count--;
      countDown(that, count, course_id);
    }, 1000)
  }
}

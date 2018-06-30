//获取用户所有课程列表
getCourseListUrl: `${host}/weapp/getcourselist`,
req.data: {
    open_id: "",
},
res.data:{[//已加入课程
    {
        course_name:  ,
        course_info: ,
        course_id: ,
        task: [0,1],
        delay_time: ,//如果有签到
        level: [1,2,3]//1创建者2管理员3加入成员
    }
    ,
    {}
]},
//根据课程id查询课程信息
searchCourseUrl: `${host}/weapp/searchcourse`,
req.data:{
    course_id:,
    open_id:
},
res.data:{
  course_name: "",
  course_info: "",
  course_id: "",
  course_member_num: "",//先保留  有空加
  course_creator: ,//先保留  有空加
  level:
  task:
},

//加入课程
joinCourseUrl: `${host}/weapp/joincourse`,
req.data: {
  course_id: that.data.course_id,
  open_id
},
res.data:{},
//创建课程
createCourseUrl: `${host}/weapp/createcourse`,
res.data:{
    course_name: "",
    course_info: "",
    open_id:,
}
res.data{}
//根据课程id获取可管理的课程详细记录
getCreatededCourseRecordUrl: `${host}/weapp/getcreatedcourserecord`,
req.data: {
    course_id:,
    open_id:,
}
res.data: {
    course_name: ,
    course_id: ,
    course_info: ,
    user_name:,
    user_id:,
    task: [0,1],
    level:
    delay_time: //if task == 1
},

//删除课程
deleteCourseUrl: `${host}/weapp/deletecourse`,
req.data: {
    course_id:,
    open_id:,
}
res.data{}



//发布签到
submitSignInUrl: `${host}/weapp/submitsignin`,
req.data: {
    open_id, course_id, delay_time, latitude, longitude, need_location, pin, need_pin
    一个都不能少，没有需求就随便弄一个上去
}
res.data{
    task:
}
//获取签到详细信息
getSignInDetailUrl: `${host}/weapp/getsignindetail`,
req.data: {
  course_id:,
}
res.data{
  need_pin:,
  need_location:,
  delay_time:,
  task:,
}
//进行签到
signInUrl: `${host}/weapp/signin`,
  req.data: {
    course_id:,
    open_id:,
    latitude:,
    longitude:,
    pin:
}
res.data{}
//获取成员列表
getMemberList: `${host}/weapp/getmemberlist`,
req.data: {
  course_id:,
  open_id:,
}
res.data{
  member:[
    {
      member_open_id:
      member_name:
      member_id:
      member_level:
    }
  ]
  member_num:
}
//删除成员
deleteMemberUrl: `${host}/weapp/deletemember`,
req.data: {
  course_id:,
  open_id:,
  member_open_id:,
}
res.data{}
//修改成员权限
changeLevelUrl: `${host}/weapp/changelevel`,
req.data: {
  course_id:,
  open_id:,
  member_open_id:,
}
res.data{}

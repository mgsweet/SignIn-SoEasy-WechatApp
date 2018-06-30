const { mysql } = require('../qcloud')
const { message: { checkSignature } } = require('../qcloud')
const { ERRORS } = require('../constants')
/*
Input
{
    open_id, course_id
}
Output
{
    ?
}
 */
async function getInfo(ctx, next) {
    var body = ctx.request.body

    var course = await mysql('Courses').where({
        'course_id': body.course_id
    })
    if (course.length == 0) {
        ctx.status = 500;
        ctx.body = ERRORS.ERR_INVALID_COURSE_ID;  
        return
    }

    var relation = await mysql('Relation').where({
        'course_id': body.course_id,
        'open_id': body.open_id
    })
    if (relation.length == 0) {
        ctx.status = 500;
        ctx.body = ERRORS.ERR_NOT_IN_THIS_COURSE;  
        return
    }
    if (relation[0].level != 1 && relation[0].level != 2) {
        ctx.status = 500;
        ctx.body = ERRORS.ERR_UNAUTHORIZED_OPERATION;  
        return
    }
    
    var current_time = Date.now();
    // 如果在签到状态
    if (course[0].task == 1) {
      var signin_list = await mysql('Signin_List').where({
        'course_id': course[0].course_id
      })
      //不存在列表中
      if (signin_list.length == 0) {
        course[0].task = 0;
        await mysql('Courses').where({
          'course_id': course[0].course_id
        }).update({
          'task': 0
        })
      } else 
      //存在但是签到时间超时
      if (current_time > parseInt(signin_list[0].course_time)) {
        course[0].task = 0;
        await mysql('Signin_List').where({
          'course_id': course[0].course_id
        }).del()
        await mysql('Courses').where({
          'course_id': course[0].course_id
        }).update({
          'task': 0
        })
      } else
      course[0].course_time = parseInt(signin_list[0].course_time) - current_time
      course[0].delay_time = course[0].course_time
    }

    var user_list = await mysql('Relation').where({
        'course_id': body.course_id
    })
    for (var i = 0; i < user_list.length; i++) {
        user = await mysql('Users').where({
            'open_id': user_list[i].open_id
        })
        user_list[i].user_name = user[0].user_name
        user_list[i].user_id = user[0].user_id
        for (var j = user_list[i].record.length; j < course[0].count; j++)
            user_list[i].record +='0'
        
        var record_detail = await mysql('Record').where({
            'open_id': user_list[i].open_id,
            'course_id': course[0].course_id
        })
        user_list.record_detail = record_detail
    }
    ctx.state.data = course[0]
    ctx.state.data.member = user_list;
}

module.exports = {
    getInfo
}
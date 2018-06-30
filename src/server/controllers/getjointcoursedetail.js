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
    console.log("Get get_joint_course_record request")
    // 检查签名，确认是微信发出的请求
    const { signature, timestamp, nonce } = ctx.query

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
    if (relation[0].level != 3) {
        ctx.status = 500;
        ctx.body = ERRORS.ERR_BECOME_MANAGER;  
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
    var user = await mysql('Relation').where({
        'course_id': body.course_id,
        'open_id': body.open_id
    })

    //error handle
    if (user.length == 0) {
        //error
    }

    user_detail = await mysql('Users').where({
        'open_id': user[0].open_id
    })
    user[0].user_name = user_detail[0].user_name
    user[0].user_id = user_detail[0].user_id
    for (var j = user[0].record.length; j < course[0].count; j++)
        user[0].record += '0'
    ctx.state.data = user[0];
    ctx.state.data.task = course[0].task
    ctx.state.data.course_time = course[0].course_time
    ctx.state.data.delay_time = course[0].course_time
    ctx.state.data.course_name = course[0].course_name
    ctx.state.data.course_info = course[0].course_info

    var record_detail = await mysql('Record').where({
        'open_id': user[0].open_id,
        'course_id': course[0].course_id
    })
    ctx.state.data.record_detail = record_detail
}

module.exports = {
    getInfo
}
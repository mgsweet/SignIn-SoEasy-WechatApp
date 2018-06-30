const { mysql } = require('../qcloud')
const { message: { checkSignature } } = require('../qcloud')
const { ERRORS } = require('../constants')
/*
Input
{
    open_id,  course_id, course_time, latitude, longitude, need_location, pin, need_pin,
    delay_time,
}

Output
{
    ?
}
 */
async function setInfo(ctx, next) {
    console.log("Get get_submit_signin request")
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
        if (current_time > parseInt(signin_list[0].delay_time) + current_time) {
            course[0].task = 0;
            await mysql('Signin_List').where({
                'course_id': course[0].course_id
            }).del()
            await mysql('Courses').where({
                'course_id': course[0].course_id
            }).update({
                'task': 0
            })
        } else {
            //error
            // the class is signing up
            // ctx.state.data = {
            //   'task':0
            // }
            ctx.status = 500;
            ctx.body = ERRORS.ERR_CORSE_SIGNING_IN;  
            return
        }
    }
    // ok then
    await mysql('Courses').where({
        'course_id': course[0].course_id
    }).update({
        'task': 1,
        'count': course[0].count + 1
    })
    current_time = Date.now();
    var new_signin = {
      'course_id': body.course_id,
      'course_time': (current_time + body.delay_time).toString(),
      'latitude': body.latitude,
      'longitude': body.longitude,
      'need_location': body.need_location,
      'pin': body.pin,
      'need_pin': body.need_pin
    }
    await mysql('Signin_List').insert(new_signin)
    ctx.state.data = {
      'task': 1
    }
}

module.exports = {
    setInfo
}

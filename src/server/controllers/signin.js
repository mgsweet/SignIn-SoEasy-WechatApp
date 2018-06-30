const { mysql } = require('../qcloud')
const { message: { checkSignature } } = require('../qcloud')
const { ERRORS } = require('../constants')
/*
Input
{
    open_id,  course_id, course_time, latitude, longitude, need_location, pin, need_pin
}
Output
{
    ?
}
 */
async function setInfo(ctx, next) {
    console.log("Get get_signin request")
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
        'open_id': ctx.state.$wxInfo.userinfo.openId
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
    var signin_list = await mysql('Signin_List').where({
        'course_id': course[0].course_id
    })
    // 如果在签到状态
    if (course[0].task == 1) {
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
        }
    }
    if (course[0].task == 0) {
        ctx.status = 500;
        ctx.body = ERRORS.ERR_SIGNIN_OVER;
        return
    }
    if (signin_list[0].need_location) {
        var dis = (body.latitude - signin_list[0].latitude) * (body.latitude - signin_list[0].latitude)
        dis += (body.longitude - signin_list[0].longitude) * (body.longitude - signin_list[0].longitude)
        if (dis > 100) {
            ctx.status = 500;
            ctx.body = ERRORS.ERR_SIGNIN_LOCATION;
            return
        }
    }

    if (signin_list[0].need_pin) {
        if (signin_list[0].pin != body.pin) {
            ctx.status = 500;
            ctx.body = ERRORS.ERR_SIGNIN_PIN;
            return
        }
    }

    // ok then
    var r = await mysql('Relation').where({
        'course_id': body.course_id,
        'open_id': body.open_id
    })

    if (r.length == 0) {
        // unknow unlike error
        ctx.status = 500;
        ctx.body = ERRORS.ERR_UNAUTHORIZED_OPERATION;
        return
    }

    while (r[0].record.length < course[0].count-1)
        r[0].record += '0'
    r[0].record += '1'
    await mysql('Relation').where({
        'course_id': body.course_id,
        'open_id': body.open_id
    }).update(r[0])
    
    await mysql('Record').insert({
        'open_id': body.open_id,
        'course_id': body.course_id,
        'count': course[0].count,
        'signin_time': current_time.toString()
    })
}

module.exports = {
    setInfo
}
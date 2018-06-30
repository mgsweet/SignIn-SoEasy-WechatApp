const { mysql } = require('../qcloud')
const { message: { checkSignature } } = require('../qcloud')
const { ERRORS } = require('../constants')
/*
Input
{
    open_id,  course_id, 
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
        'open_id': ctx.state.$wxInfo.userinfo.openId
    })
    if (relation.length == 0) {
        ctx.status = 500;
        ctx.body = ERRORS.ERR_NOT_IN_THIS_COURSE;  
        return
    }
    // if (relation[0].level != 1 && relation[0].level != 2) {
    //     ctx.status = 500;
    //     ctx.body = ERRORS.ERR_UNAUTHORIZED_OPERATION;  
    //     return
    // }

    var current_time = Date.now();
    var signin_state = await mysql('Signin_List').where({
        'course_id': course[0].course_id
    })
    // 如果在签到状态
    if (course[0].task == 1) {
        //不存在列表中
        if (signin_state.length == 0) {
            course[0].task = 0;
            await mysql('Courses').where({
                'course_id': course[0].course_id
            }).update({
                'task': 0
            })
        } else
            //存在但是签到时间超时
            if (current_time > parseInt(signin_state[0].course_time)) {
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
        if (course[0].task == 0) {
            ctx.status = 500;
            ctx.body = ERRORS.ERR_SIGNIN_OVER;  
            return
        }
        signin_state[0].delay_time = parseInt(signin_state[0].course_time) - current_time
    }
    ctx.state.data = {}
    course[0].delay_time = course[0].course_time
    ctx.state.data.course = course[0]
    if (signin_state.length > 0)
        ctx.state.data.signin_state = signin_state[0]
    
}

module.exports = {
    getInfo
}

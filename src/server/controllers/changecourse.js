const { mysql } = require('../qcloud')
const { message: { checkSignature } } = require('../qcloud')
const { ERRORS } = require('../constants')
/*
Input
{
    course_id, course_name, course_info
}

Output
{
    ok
}
 */
async function setInfo(ctx, next) {
    console.log("Get change_course request")
    // 检查签名，确认是微信发出的请求
    const { signature, timestamp, nonce } = ctx.query

    const body = ctx.request.body
    console.log(body)
    
    var relation = await mysql('Relation').where({
        'course_id': body.course_id,
        'open_id': ctx.state.$wxInfo.userinfo.openId
    })

    if (relation.length == 0 || relation[0].level != 1) {
        ctx.status = 500;
        ctx.body = ERRORS.ERR_UNAUTHORIZED_OPERATION;
        return
    }

    if (body.course_name.length > 20) {
        ctx.status = 500;
        ctx.body = ERRORS.ERR_COURSE_NAME;
        return
    }
    if (body.course_info.length > 200) {
        ctx.status = 500;
        ctx.body = ERRORS.ERR_COURSE_INFO;  
        return
    }

    await mysql('Courses').where('course_id', body.course_id).update({
        course_name: body.course_name,
        course_info: body.course_info
    })

    ctx.body = 1
}

module.exports = {
    setInfo
}

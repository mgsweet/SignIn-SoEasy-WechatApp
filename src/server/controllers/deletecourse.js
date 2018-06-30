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
    ok
}
 */
async function setInfo(ctx, next) {
    console.log("Get delete_course request")
    // 检查签名，确认是微信发出的请求
    const { signature, timestamp, nonce } = ctx.query

    const body = ctx.request.body
    console.log(body)

    var course = await mysql('Courses').where({
        'course_id': body.course_id
    })
    if (course.length == 0) {
        ctx.status = 500;
        ctx.body = ERRORS.ERR_INVALID_COURSE_ID;  
        return
    }
    
    var relation = await mysql('Relation').where({
        'open_id': body.open_id,
        'course_id': body.course_id
    })
    if (relation.length == 0 || relation[0].level != 1) {
        ctx.status = 500;
        ctx.body = ERRORS.ERR_UNAUTHORIZED_OPERATION;  
        return
    }
    await mysql('Courses').where('course_id', body.course_id).del()

    ctx.body = 1
}

module.exports = {
    setInfo
}

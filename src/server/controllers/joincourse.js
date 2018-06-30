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
async function setInfo(ctx, next) {
    console.log("Get get_join_course request")
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
    if (relation.length != 0) {
        ctx.status = 500;
        ctx.body = ERRORS.ERR_UNAUTHORIZED_OPERATION;  
        return
    } else {
        var new_relation = {
            'open_id': body.open_id,
            'course_id': body.course_id,
            'level': 3,
            'record': ""
        }
        await mysql('Relation').insert(new_relation)
    }
}

module.exports = {
    setInfo
}

const { mysql } = require('../qcloud')
const { message: { checkSignature } } = require('../qcloud')
const { ERRORS } = require('../constants')


async function setInfo(ctx, next) {
    const body = ctx.request.body
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
    await mysql('Relation').where({
        'course_id': body.course_id,
        'open_id': ctx.state.$wxInfo.userinfo.openId
    }).del()

    //  未知是否保留记录
    await mysql('Record').where({
        'course_id': body.course_id,
        'open_id': ctx.state.$wxInfo.userinfo.openId
    }).del()


    ctx.body = 'success'
}

module.exports = {
    setInfo
}
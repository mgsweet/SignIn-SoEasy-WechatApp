const { mysql } = require('../qcloud')
const { message: { checkSignature } } = require('../qcloud')
const { ERRORS } = require('../constants')

async function getInfo(ctx, next) {
    const body = ctx.request.body

    console.log(body)

    var course = await mysql('Courses').where({
        'course_id': body.course_id
    })

    ctx.body = {}

    // error handle
    if (course.length == 0) {
        ctx.status = 500;
        ctx.body = ERRORS.ERR_INVALID_COURSE_ID
        return
    }

    ctx.body.course_id = course[0].course_id
    ctx.body.course_name = course[0].course_name
    ctx.body.course_info = course[0].course_info
    ctx.body.task = course[0].task

    var relation = await mysql('Relation').where({
        'course_id': body.course_id,
        'open_id': body.open_id
    })
    if (relation.length == 0) {
        ctx.body.level = -1
    } else {
        ctx.body.level = relation[0].level
    }

    relation = await mysql('Relation').where({
        'course_id': body.course_id,
        'level': 1
    })

    var owner = await mysql("Users").where({
    	'open_id': relation[0].open_id
    })

     ctx.body.ownerName = owner[0].user_name
}

module.exports = {
    getInfo
}

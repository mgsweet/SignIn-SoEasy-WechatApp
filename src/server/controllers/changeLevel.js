const { mysql } = require('../qcloud')
const { message: { checkSignature } } = require('../qcloud')
const { ERRORS } = require('../constants')

/**
 * 
 * @param {*} ctx.request.body.course_id
 * @param {*} ctx.request.body.member_open_id
 * @param {*} ctx.request.body.level
 */
async function changeLevel(ctx, next) {
    const body = ctx.request.body
    if (body.course_id === undefined || body.member_open_id === undefined || body.level === undefined) {
        ctx.status = 400
        ctx.body = ERRORS.ERR_NOT_ENOUGH_INFO
        return
    }

    //获取操作者信息
    if (ctx.state.$wxInfo.loginState === 1) {
        const manager_id = ctx.state.$wxInfo.userinfo.openId

        // 查看课程是否存在
        let checkClassExist = await mysql('Courses').where({
            'course_id': body.course_id
        })
        if (checkClassExist.length == 0) {
            ctx.status = 400
            ctx.body = ERRORS.ERR_COURSE_NOT_FOUND
            return
        }

        // 只有创建者有权限设置LEVEL
        let checkOwn = await mysql('Relation').where({
            'course_id': body.course_id,
            'open_id': manager_id
        }).where('level', 1)
        if (checkOwn.length == 0) {
            ctx.status = 400
            ctx.body = ERRORS.ERR_COURSE_MAN_PERMISSION_DENIED
            return
        }

        //  不可以设置自己的level
        if (body.member_open_id == manager_id) {
            ctx.status = 400
            ctx.body = ERRORS.ERR_MANAGER_AND_MEMBER_SAME
            return
        }

    } else {
        ctx.state.code = -1
        return
    }

    // 查看用户是否存在
    let checkUserExist = await mysql('Relation').where({
        'course_id': body.course_id,
        'open_id': body.member_open_id
    })
    if (checkUserExist.length == 0) {
        ctx.status = 400
        ctx.body = ERRORS.ERR_USER_NOT_FOUND
        return
    }


    // 设置权限
    await mysql('Relation').where({
        'open_id': body.member_open_id,
        'course_id': body.course_id
    }).update('level', body.level)

    ctx.body = 'success'

}

module.exports = changeLevel
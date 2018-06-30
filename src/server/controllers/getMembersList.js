const { mysql } = require('../qcloud')
const { message: { checkSignature } } = require('../qcloud')
const { ERRORS } = require('../constants')

/**
 * 响应 GET 课程成员列表的请求
 */
async function getMembersList(ctx, next) {
    const course_id = ctx.query.course_id

    // 获取操作者信息
    if (ctx.state.$wxInfo.loginState === 1) {
        const manager_id = ctx.state.$wxInfo.userinfo.openId

        // 查看课程是否存在
        let checkClassExist = await mysql('Courses').where({
            'course_id': course_id
        })
        if (checkClassExist.length == 0) {
            ctx.status = 400
            ctx.body = ERRORS.ERR_COURSE_NOT_FOUND
            return
        }

        let checkOwn = await mysql('Relation').where({
            'course_id': course_id,
            'open_id': manager_id
        }).whereIn('level', [1, 2]) // 管理者有权限

        if (checkOwn.length == 0) {
            ctx.body = ERRORS.ERR_COURSE_MAN_PERMISSION_DENIED
            return
        }

    } else {
        ctx.state.code = -1
        return
    }

    let members = await mysql('Relation').where({
        'course_id': course_id
    })

    for (let i in members) {
        let info = await mysql('Users').where({
            'open_id': members[i].open_id
        }).select('user_name', 'user_id');
        members[i] = Object.assign(members[i], info[0])
    }

    ctx.body = {
        member_list: members
    }

}

module.exports = getMembersList
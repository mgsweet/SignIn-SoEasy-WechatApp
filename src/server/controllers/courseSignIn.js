const { mysql } = require('../qcloud')
const { message: { checkSignature } } = require('../qcloud')

/**
 * 
 * @param {*} ctx.request.body.course_id
 * @param {*} ctx.request.body.pos.latitude | undefine
 * @param {*} ctx.request.body.pos.longitude | undefine
 * @param {*} ctx.request.body.pin | undefine
 * 
 */
async function courseSignIn(ctx, next) {
    console.log('Change course member permision request')

    // 检查签名，确认是微信发出的请求
    const { signature, timestamp, nonce } = ctx.query
    if (!checkSignature(signature, timestamp, nonce)) {
        ctx.body = 'ERR_WHEN_CHECK_SIGNATURE'
        return
    }

    const body = ctx.request.body

    if (body.course_id === undefined || body.member_id === undefined) {
        ctx.body = 'NOT_ENOUGH_INFO'
        return
    }

    // 获取操作者信息
    if (ctx.state.$wxInfo.loginState === 1) {
        const manager_id = ctx.state.$wxInfo.userinfo.userinfo.openId
    } else {
        ctx.state.code = -1
        return
    }

    // 获取当前签到数据库表
    const signPost =  await mysql('Signin_List').where({
        'course_id': body.course_id
    })

    console.log(signPost)
}

module.exports = courseSignIn
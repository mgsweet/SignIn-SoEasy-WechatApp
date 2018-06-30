const { mysql } = require('../qcloud')
const { message: { checkSignature } } = require('../qcloud')
const { ERRORS } = require('../constants')
/*
Input
{
    user_id: that.data.userInfo.user_id,
    user_name: that.data.userInfo.user_name,
    new_user_id: that.data.newuserInfo.user_id,
    new_user_name: that.data.newuserInfo.user_name
}

Output
{
    ?
}
 */
async function setInfo(ctx, next) {
    console.log("Get get_update_user request")
    // 检查签名，确认是微信发出的请求
    const { signature, timestamp, nonce } = ctx.query

    var body = ctx.request.body

    if (body.user_id.length == 0 || body.user_id.length > 100) {
        ctx.status = 500;
        ctx.body = ERRORS.ERR_WHEN_SET_USER_ID;  
        return
    }
    if (body.user_name.length == 0 || body.user_name.length > 100) {
        ctx.status = 500;
        ctx.body = ERRORS.ERR_WHEN_SET_USER_NAME;  
        return
    }

    await mysql('Users').where({
        'open_id': ctx.state.$wxInfo.userinfo.openId
    }).update({
        'user_name': body.new_user_name,
        'user_id': body.new_user_id
    })
}

module.exports = {
    setInfo
}

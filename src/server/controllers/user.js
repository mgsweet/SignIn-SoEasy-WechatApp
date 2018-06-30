const { mysql } = require('../qcloud')
const { message: { checkSignature } } = require('../qcloud')
const { ERRORS } = require('../constants')

async function getInfo(ctx, next) {
    // 通过 Koa 中间件进行登录态校验之后
    // 登录信息会被存储到 ctx.state.$wxInfo
    // 具体查看：
    if (ctx.state.$wxInfo.loginState === 1) {
        // loginState 为 1，登录态校验成功
        console.log("User getInfo")
        ctx.state.data = {
            userinfo: ctx.state.$wxInfo.userinfo
        }

        var temp = await mysql('Users').where('open_id', ctx.state.$wxInfo.userinfo.openId)

        if (temp.length == 0) {
            // 如果没找到openid，新添用户
            var user = {
                open_id: ctx.state.$wxInfo.userinfo.openId,
                isSignUp: 0,
                user_name: "",
                user_id: ""
            }
            await mysql("Users").insert(user)

            ctx.state.data['user'] = {
                isSignUp: 0,
                user_name: "",
                user_id: ""
            }
        } else {
            // 如果找到openid，获取用户
            ctx.state.data['user'] = {
                isSignUp: temp[0].isSignUp,
                user_name: temp[0].user_name,
                user_id: temp[0].user_id
            }
        }
    } else {
        ctx.state.code = -1
    }
}

async function setInfo(ctx, next) {
    const body = ctx.request.body

    var judgeStr = judgeFormat(body.user_name, body.user_id)

    if (judgeStr.length == 0) {
        await mysql('Users')
            .where('open_id', ctx.state.$wxInfo.userinfo.openId)
            .update({
                user_name: body.user_name,
                user_id: body.user_id,
                isSignUp: 1
            })

        ctx.body = "success"
    } else {
        ctx.body = {
            error: judgeStr
        }
    }
}

function judgeFormat(user_name, user_id) {
    if (user_id == "") {
        return ERRORS.ERR_WHEN_SET_USER_ID
    }
    if (user_name == "") {
        return ERRORS.ERR_WHEN_SET_USER_NAME
    } else {
        return ''
    }
}

module.exports = {
    setInfo,
    getInfo
}

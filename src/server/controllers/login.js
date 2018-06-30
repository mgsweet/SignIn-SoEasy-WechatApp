const { mysql } = require('../qcloud')

// 登录授权接口
module.exports = async (ctx, next) => {
    // 通过 Koa 中间件进行登录之后
    // 登录信息会被存储到 ctx.state.$wxInfo
    // 具体查看：
    if(ctx.state.$wxInfo.loginState) {
        ctx.state.data = ctx.state.$wxInfo.userinfo
        ctx.state.data['time'] = Math.floor(Date.now() / 1000)

        var temp = await mysql('Users').where('open_id', ctx.state.$wxInfo.userinfo.userinfo.openId)

        if (temp.length == 0) {
            // 如果没找到openid，新添用户
            var user = {
                open_id: ctx.state.$wxInfo.userinfo.userinfo.openId,
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
    }
}

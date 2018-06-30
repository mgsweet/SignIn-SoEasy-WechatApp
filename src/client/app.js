//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')

App({
    doLogin: function() {
        wx.login({
            success: function(loginResult) {
                wx.redirectTo({
                    url: '/pages/authorization/authorization?code=' + loginResult.code
                })
            }
        })
    },

    autoLogin: function(result) {
        if(result) {
            this.globalData.userInfo = result.userinfo
            this.globalData.userInfo['isSignUp'] = result.user.isSignUp
            this.globalData.userInfo['user_id'] = result.user.user_id
            this.globalData.userInfo['user_name'] = result.user.user_name
            // 由于是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(this.globalData)
            }
        } else {
            // 如果不是首次登录，但无用户信息，请求用户信息接口获取
            var that = this
            qcloud.request({
                url: config.service.requestUrl,
                login: true,
                success(result) {
                    that.globalData.userInfo = result.data.data.userinfo
                    that.globalData.userInfo['isSignUp'] = result.data.data.user.isSignUp
                    that.globalData.userInfo['user_id'] = result.data.data.user.user_id
                    that.globalData.userInfo['user_name'] = result.data.data.user.user_name

                    // 由于是网络请求，可能会在 Page.onLoad 之后才返回
                    // 所以此处加入 callback 以防止这种情况
                    if (that.userInfoReadyCallback) {
                        that.userInfoReadyCallback(that.globalData)
                    }
                },

                fail(error) {
                    console.log('request fail', error)
                }
            })
        }
    },

    onLaunch: function (options) {
        // 若扫二维码进入小程序
        console.log(options)
        if (options.query.scene) {
            let arr = options.query.scene.split('%26')
            if (arr.length != 2) console.log('Wrong scan')
            this.globalData.task.code = arr[0]
            this.globalData.task.scene = arr[1]
        }

        qcloud.setLoginUrl(config.service.loginUrl)

        var that = this
        let session = qcloud.Session;
        if (session.get()) {
            console.log(session.get())
            wx.checkSession({
                success: function () {
                    that.autoLogin(session.get());
                },
    
                fail: function () {
                    session.clear();
                    that.doLogin();
                },
            });
        } else {
            that.doLogin();
        }
    },

    globalData: {
        userInfo: null,
        takeSession: false,
        requestResult: '',
        task: {
            code: 0,
            scene: ''
        }
    },

    initGlobalTask: function() {
        this.globalData.task.code = 0
        this.globalData.task.scene = ''
    }
})
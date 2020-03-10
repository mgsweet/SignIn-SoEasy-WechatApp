const CONF = {
    port: '5757',
    rootPathname: '',

    // 微信小程序 App ID
    appId: 'wx3f2030fca7848fa8',

    // 微信小程序 App Secret
    appSecret: '02db93e987f91c6c37edb6d2e86510d6',

    // 是否使用腾讯云代理登录小程序
    useQcloudLogin: true,

    /**
     * MySQL 配置，用来存储 session 和用户信息
     * 若使用了腾讯云微信小程序解决方案
     * 开发环境下，MySQL 的初始密码为您的微信小程序 appid
     */
    mysql: {
        host: 'localhost',
        port: 3306,
        user: 'zhaofeng',
        db: 'cAuth',
        pass: 'zhaofeng123',
        char: 'utf8mb4'
    },

    cos: {
        /**
         * 地区简称
         * @查看 https://cloud.tencent.com/document/product/436/6224
         */
        region: 'ap-guangzhou',
        // Bucket 名称
        fileBucket: 'qcloudtest',
        // 文件夹
        uploadFolder: ''
    },

    // 微信登录态有效期
    wxLoginExpires: 7200,
    wxMessageToken: 'abcdefgh',

    // 其他配置 ...
    serverHost: 'xxxxxxxxxx',
    tunnelServerUrl: 'http://tunnel.ws.qcloud.la',
    tunnelSignatureKey: '27fb7d1c161b7ca52d73cce0f1d833f9f5b5ec89',
      // 腾讯云相关配置可以查看云 API 秘钥控制台：https://console.cloud.tencent.com/capi
    qcloudAppId: '  wx3f2030fca7848fa8',
    qcloudSecretId: 'AKIDMbfXDhC60TsqhMyFQN8h8OSPBmAMICLQ',
    qcloudSecretKey: 'yngQ1Qde5OWSFqFUYP4ax9SfhaHm6GE0',
    wxMessageToken: 'weixinmsgtoken',
    networkTimeout: 30000
}

module.exports = CONF

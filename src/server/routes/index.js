/**
 * ajax 服务路由集合
 */
const router = require('koa-router')({
    prefix: '/weapp'
})
const controllers = require('../controllers')

// 从 sdk 中取出中间件
// 这里展示如何使用 Koa 中间件完成登录态的颁发与验证
const { auth: { authorizationMiddleware, validationMiddleware } } = require('../qcloud')

// --- 登录与授权 Demo --- //
// 登录接口
router.get('/login', authorizationMiddleware, controllers.login)
// 用户信息接口（可以用来验证登录态）
router.get('/user', validationMiddleware, controllers.user.getInfo)
// 用户信息修改接口
router.post('/user', validationMiddleware, controllers.user.setInfo)
// 用户info修改
router.post('/updateuser', validationMiddleware, controllers.updateuser.setInfo)


// --- 课程管理 --- //
// 用户添加课程
router.post('/createcourse', validationMiddleware, controllers.createcourse.setInfo)
// 用户修改课程
router.post('/changecourse', validationMiddleware, controllers.changecourse.setInfo)
// 用户删除课程
router.post('/deletecourse', validationMiddleware, controllers.deletecourse.setInfo)
// 管理员用户获取课程列表的成员
router.get('/getMembersList', validationMiddleware, controllers.getMembersList)
// 创建者改变权限
router.post('/changelevel', validationMiddleware, controllers.changeLevel)
// 管理员删除用户
router.post('/deleteMember', validationMiddleware, controllers.deleteMember)
// 用户退出课程
router.post('/quitcourse', validationMiddleware, controllers.quitcourse.setInfo)


// 用户获取课程列表
router.get('/getcourselist', validationMiddleware, controllers.getcourselist.getInfo)
// 用户获取创建课程的签到信息
router.post('/getcreatedcourserecord', validationMiddleware, controllers.getcreatedcourserecord.getInfo)
// 用户获取加入课程的签到信息
router.post('/getjointcoursedetail', validationMiddleware, controllers.getjointcoursedetail.getInfo)


// 用户通过course_id获取课程信息
router.post('/searchcourse', validationMiddleware, controllers.searchcourse.getInfo)
// 用户通过course_id加入课程
router.post('/joincourse', validationMiddleware, controllers.joincourse.setInfo)


// 用户发布签到
router.post('/submitsignin', validationMiddleware, controllers.submitsignin.setInfo)
// 用户签到
router.post('/signin', validationMiddleware, controllers.signin.setInfo)
// 用户获取签到信息
router.post('/getsignindetail', validationMiddleware, controllers.getsignindetail.getInfo)


// --- 图片上传 Demo --- //
// 图片上传接口，小程序端可以直接将 url 填入 wx.uploadFile 中
router.post('/upload', controllers.upload)


// --- 信道服务接口 Demo --- //
// GET  用来响应请求信道地址的
router.get('/tunnel', controllers.tunnel.get)
// POST 用来处理信道传递过来的消息
router.post('/tunnel', controllers.tunnel.post)


// --- 客服消息接口 Demo --- //
// GET  用来响应小程序后台配置时发送的验证请求
router.get('/message', controllers.message.get)
// POST 用来处理微信转发过来的客服消息
router.post('/message', controllers.message.post)

// 获取二维码
router.get('/getCourseQR',  controllers.getCourseQR)

// 获取Excel
router.get('/getExcel',  validationMiddleware, controllers.getExcel)

module.exports = router
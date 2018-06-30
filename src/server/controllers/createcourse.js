const { mysql } = require('../qcloud')
const { message: { checkSignature } } = require('../qcloud')
const { ERRORS } = require('../constants')

const http = require('axios')
const config = require('../config')
const fs = require("fs");
const request = require('request')

async function createCourseQr(course_id) {
	await http({
		url: 'https://api.weixin.qq.com/cgi-bin/token',
		method: 'GET',
		params: {
			grant_type: 'client_credential',
			appid: config.appId,
			secret: config.appSecret
		}
	}).then(res => {
		try {
			if (res.status == 200) {
				let access_token = res.data.access_token
				let postData = {
					"scene": "1&" + course_id,
					"path": "pages/authorization/authorization"
				} 
				postData = JSON.stringify(postData)
				request({
					method: 'POST',
					url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=' + access_token,
					body: postData
				}).pipe(fs.createWriteStream('qrData/' + course_id + '.png'))
			} else {
			//  error 异常处理TODO
				throw "ERR: cant create qr file"
			}
		}
		catch(e) {
			console.log(e)
		}
	})
}

async function setInfo(ctx, next) {
	const body = ctx.request.body
	console.log(body)
	
	if (body.course_name.length > 20) {
		ctx.status = 500;
		ctx.body = ERRORS.ERR_COURSE_NAME;  
		return
	}
	if (body.course_info.length > 200) {
		ctx.status = 500;
		ctx.body = ERRORS.ERR_COURSE_INFO_TOO_LONG;  
		return
	}
	
	var new_course = {
		course_name: body.course_name,
		course_info: body.course_info,
		count: 0,
		task: 0
	}
	await mysql('Courses').insert(new_course)

	var course = await mysql('Courses').where({
		'course_name': body.course_name,
		'course_info': body.course_info
	})

	let new_course_id = course[course.length-1].course_id

	createCourseQr(new_course_id)

	var new_relation = {
		open_id: body.open_id,
		course_id: new_course_id,
		level: 1,
		record: ""
	}
	await mysql('Relation').insert(new_relation)

	ctx.body = 1
}

module.exports = {
	setInfo
}

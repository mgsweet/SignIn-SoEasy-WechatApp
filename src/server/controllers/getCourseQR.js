const { mysql } = require('../qcloud')
const http = require('axios')
const config = require('../config')
var fs = require("fs");
var request = require('request')

/**
 * 
 * @param {*} ctx.request.body.course_id
 */
async function getCourseQR(ctx, next) {
	const body = ctx.query
	if (body.course_id === undefined) {
		ctx.status = 500
		ctx.body = ERRORS.ERR_NOT_ENOUGH_INFO
		return
	}

	console.log(body)
	ctx.type = "image/png"
	ctx.status = 200;

	ctx.body = fs.createReadStream('qrData/' + body.course_id + '.png');

} 

module.exports = getCourseQR
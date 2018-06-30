const { mysql } = require('../qcloud')
const { message: { checkSignature } } = require('../qcloud')
const { ERRORS } = require('../constants')
/*
Input
{
    open_id
}

Output
{
    ?
}
 */
async function getInfo(ctx, next) {
    var course = await mysql('Courses').whereExists(function() {
        this.select('*').from('Relation').whereRaw('Courses.course_id = Relation.course_id and Relation.open_id = ?', [ctx.state.$wxInfo.userinfo.openId]);
    })

    var current_time = Date.now();

    for (var i = 0; i < course.length; i++) {
        //为列表添加level
        var level = await mysql('Relation').where({
            'course_id': course[i].course_id,
            'open_id': ctx.state.$wxInfo.userinfo.openId
        })
        course[i].level = level[0].level
        //方便调试
        course[i].course_time = 0
        //添加签到判断
        if (course[i].task == 1) {
            var signin_list = await mysql('Signin_List').where({
                'course_id': course[i].course_id
            })
            var relation = await mysql('Relation').where({
                'course_id': course[i].course_id,
                'open_id': ctx.state.$wxInfo.userinfo.openId
            })
            //不存在列表中
            if (signin_list.length == 0) {
                course[i].task = 0;
                await mysql('Courses').where({
                    'course_id': course[i].course_id
                }).update({
                    'task': 0
                })
                continue;
            } else 
            //存在但是签到时间超时
            if (current_time > parseInt(signin_list[0].course_time)) {
                course[i].task = 0;
                await mysql('Signin_List').where({
                    'course_id': course[i].course_id
                }).del()
                await mysql('Courses').where({
                    'course_id': course[i].course_id
                }).update({
                    'task': 0
                })
                continue;
            } else
            // 已签到
            if (relation[0].record.length == course[i].count && relation[0].record[relation[0].record.length-1] == '1') {
                course[i].task = 2;
            }
            course[i].course_time = parseInt(signin_list[0].course_time) - current_time
            course[i].delay_time = course[i].course_time
        }
    }
    ctx.state.data = course;
}

module.exports = {
    getInfo
}

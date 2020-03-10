const { mysql } = require('../qcloud')
const { message: { checkSignature } } = require('../qcloud')
const { ERRORS } = require('../constants')
const nodemailer = require('nodemailer');
const XLSX = require('xlsx');

// 传入数据结构参考
const headers = ['学号', '姓名', '签到次数', '需签到总数'];
const dataExample = [{
    学号: '1',
    姓名: '小明',
    签到次数: '30',
    需签到总数: '2',
},
{
    学号: '2',
    姓名: '小红',
    签到次数: '20',
    需签到总数: '1',
},
{
    学号: '3',
    姓名: '小芳',
    签到次数: '18',
    需签到总数: '2',
}];

async function makeFormatData(_members, _totalCount) {
    let data = new Array()
    for (let i = 0; i < _members.length; i++) {
        let memberArr = await mysql('Users').where({
            'open_id': _members[i].open_id
        })

        let name = memberArr[0].user_name
        let id = memberArr[0].user_id

        let hit = 0
        for (let j = 0; j < _members[i].record.length; j++) {
            if (_members[i].record[j] == `1`) {
                hit++
            }
        }

        data.push({
            学号: id,
            姓名: name,
            签到次数: hit,
            需签到总数: _totalCount
        })
    }
    return data
}

async function getExcel(ctx, next) {
    const course_id = ctx.query.course_id
    const email_address =  ctx.query.email_address

    // 获取操作者信息
    if (ctx.state.$wxInfo.loginState === 1) {
        const manager_id = ctx.state.$wxInfo.userinfo.openId

        // 查看课程是否存在
        let course = await mysql('Courses').where({
            'course_id': course_id
        })

        // 不存在报错
        if (course.length == 0) {
            ctx.status = 500
            ctx.body = ERRORS.ERR_COURSE_NOT_FOUND
            return
        }

        // 检查是否有管理权限
        let checkOwn = await mysql('Relation').where({
            'course_id': course_id,
            'open_id': manager_id
        }).whereIn('level', [1, 2]) // 管理者有权限

        if (checkOwn.length == 0) {
            ctx.status = 500
            ctx.body = ERRORS.ERR_COURSE_MAN_PERMISSION_DENIED
            return
        }

        //  获取总签到数
        let totalCount = course[0].count
        //  若无签到记录则不发邮件
        if (totalCount === 0) {
            ctx.status = 500
            ctx.body = ERRORS.ERR_NO_SIGNIN_RECORD
            return
        }

        // 获取课程的成员（除去创建者）
        let members = await mysql('Relation').where({
             'course_id': course_id
        }) .whereIn('level', [2, 3])

        //  没有成员也不发邮件
        if (members.length === 0) {
            ctx.status = 500
            ctx.body = ERRORS.ERR_NO_SIGNIN_MEMBER
            return
        }

        let data = await makeFormatData(members, totalCount)

        await makeXlsx(headers, data, manager_id);
        sendEmail(email_address, manager_id);
        ctx.body = 'success';

    } else {
        ctx.state.code = -1
        return
    }
}

//  发送者邮箱设定
var transporter = nodemailer.createTransport({
    service: '163',
    auth: {
        user: 'la_wechat@163.com',//发送者邮箱
        pass: 'xxxxxxxxxx' //邮箱第三方登录授权码
    },
    debug: true
}, {
        from: 'la_wechat@163.com',//发送者邮箱
        headers: {
            'X-Laziness-level': 1000
        }
});

//  生成xlsx
function makeXlsx(_headers, _data, open_id) {
    const headers = _headers
        .map((v, i) => Object.assign({}, { v: v, position: String.fromCharCode(65 + i) + 1 }))
        .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {});

    const data = _data
        .map((v, i) => _headers.map((k, j) => Object.assign({}, { v: v[k], position: String.fromCharCode(65 + j) + (i + 2) })))
        .reduce((prev, next) => prev.concat(next))
        .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {});

    const output = Object.assign({}, headers, data);
    // 获取所有单元格的位置
    const outputPos = Object.keys(output);
    // 计算出范围
    const ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];
    // 构建 workbook 对象
    const workbook = {
        SheetNames: ['签到情况'],
        Sheets: {
            '签到情况': Object.assign({}, output, { '!ref': ref })
        }
    };

    // 导出 Excel
    XLSX.writeFile(workbook, 'excelData/' + open_id + '.xlsx')
}

//  生成邮件内容对象
function makeMessage(toEmail, open_id) {
    return {
        // Comma separated lsit of recipients 收件人用逗号间隔
        to: toEmail,

        // Subject of the message 信息主题
        subject: '课程签到情况',

        // plaintext body
        text: '由签到SoEasy课程签到小程序生成',

        // Html body
        html: '<p><b>签到SoEasy</b></p>',

        // Apple Watch specific HTML body 苹果手表指定HTML格式
        watchHtml: '<b>签到SoEasy</b>',

        // An array of attachments 附件
        attachments: [
            // String attachment
            {
                filename: open_id + '.xlsx',
                path: 'excelData/' + open_id + '.xlsx'
            }
        ]
    }
}

//  发送邮件
function sendEmail(toEmail, open_id) {
    transporter.sendMail(makeMessage(toEmail, open_id), (error, info) => {
        if (error) {
            console.log('Error occurred');
            console.log(error.message);
            return;
        }
        console.log('Message sent successfully!');
        console.log('Server responded with "%s"', info.response);
        transporter.close();
    });
};

/*
async function getExcel(ctx, next) {
    // 检查签名，确认是微信发出的请求
    const { signature, timestamp, nonce } = ctx.query;
    if (!checkSignature(signature, timestamp, nonce)) ctx.body = 'ERR_WHEN_CHECK_SIGNATURE';

    const body = ctx.request.body;
    //生成xlsx文件
    await makeXlsx(headersExample, dataExample, '123');

    sendEmail('mgsweet@126.com', '123');

    ctx.body = 'success';
}

*/

module.exports = getExcel;


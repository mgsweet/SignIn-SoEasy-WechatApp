## updateCourseInfoUrl
- if (result.error == '1') {
    error = '您没有修改权限'
    ERR_UNAUTHORIZED_OPERATION
}
- if (result.error == '2') {
    error = '课程信息格式有误'
    ERR_COURSE_NAME
    ERR_COURSE_INFO
}

## updateUserInfoUrl
- if (result.error == '1') {
    error = '个人信息格式有误'
    ERR_WHEN_SET_USER_ID
    ERR_WHEN_SET_USER_NAME
}
- if (result.error == '1') {
    error = '您没有修改权限'
}

## createCourseUrl
- if (result.error == '1') {
    error = '课程信息格式有误'
    ERR_COURSE_NAME
    ERR_COURSE_INFO
}

## getCreatededCourseRecordUrl
- if (result.data == '1') {
    error = '该课程不存在或已删除'
    ERR_INVALID_COURSE_ID
}
- if (result.data == '1') {
    error = '您没有管理权限'
    ERR_UNAUTHORIZED_OPERATION
}
- if (result.data == '1') {
    error = '您未加入该课程'
    ERR_NOT_IN_THIS_COURSE
}

## deleteCourseUrl
- if (result.data == '1') {
    error = '该课程不存在或已删除'
    ERR_INVALID_COURSE_ID
}
- if (result.data == '1') {
    error = '您没有删除课程权限'
    ERR_UNAUTHORIZED_OPERATION
}

## getJointCourseRecordUrl
- if (result.data == '1') {
    error = '该课程不存在或已删除'
    ERR_INVALID_COURSE_ID
}
- if (result.data == '1') {
    error = '您未加入该课程'
    ERR_NOT_IN_THIS_COURSE
}
- if (result.data == '1') {
    error = '您已成为课程管理员'
    ERR_BECOME_MANAGER
}



## searchCourseDetailUrl
- if (result.data == '1') {
    error = '该课程不存在或已删除'
    ERR_INVALID_COURSE_ID
}

## getSignInDetailUrl
- if (result.data == '1') {
    error = '该课程不存在或已删除'
    ERR_INVALID_COURSE_ID
}
- if (result.data == '1') {
    error = '您未加入该课程'
    ERR_NOT_IN_THIS_COURSE
}
- if (result.data == '1') {
    error = '您已成为课程管理员'
    ERR_BECOME_MANAGER
}
- if (result.data == '1') {
    error = '签到已经结束'
    ERR_SIGNIN_OVER
}
- if (result.data == '1') {
    error = '签到已经取消'
}

## signInUrl
- if (result.data == '1') {
    error = '该课程不存在或已删除'
    ERR_INVALID_COURSE_ID
}
- if (result.data == '1') {
    error = '您未加入该课程'
    ERR_NOT_IN_THIS_COURSE
}
- if (result.data == '1') {
    error = '您已成为课程管理员'
    ERR_BECOME_MANAGER
}
- if (result.data == '1') {
    error = '签到已经结束'
    ERR_SIGNIN_OVER
}
- if (result.data == '1') {
    error = '签到地理位置超出范围'
    ERR_SIGNIN_LOCATION
}
- if (result.data == '1') {
    error = 'pin码错误'
    ERR_SIGNIN_PIN
}

- if (result.data == '1') {
    error = '签到已经取消'
}

## submitSignInUrl
- if (result.data == '1') {
    error = '该课程不存在或已删除'
    ERR_INVALID_COURSE_ID
}
- if (result.data == '1') {
    error = '您未加入该课程'
    ERR_NOT_IN_THIS_COURSE
}
- if (result.data == '1') {
    error = '您已不是课程管理员'
    ERR_UNAUTHORIZED_OPERATION
}
- if (result.data == '1') {
    error = '已经有签到正在进行'
    ERR_CORSE_SIGNING_IN
}
- if (result.data == '1') {
    error = '地理位置未授权'
    ?
}


## changeLevelUrl
- if (result.data == '1') {
    error = '该课程不存在或已删除'
    ERR_COURSE_NOT_FOUND
}
- if (result.data == '1') {
    error = '您没有修改权限'
    ERR_COURSE_MAN_PERMISSION_DENIED
}
- if (result.data == '1') {
    error = '不可设置自己的LEVEL'
    ERR_MANAGER_AND_MEMBER_SAME
}
- if (result.data == '1') {
    error = '该成员不存在或已退出课程'
}

## deleteMemberUrl
- if (result.data == '1') {
    error = '该课程不存在或已删除'
    ERR_COURSE_NOT_FOUND
}
- if (result.data == '1') {
    error = '您没有修改权限'
    ERR_COURSE_MAN_PERMISSION_DENIED
}
- if (result.data == '1') {
    error = '该成员不存在或已退出课程'
    ERR_USER_NOT_FOUND
}

## getMembersListUrl
- if (result.data == '1') {
    error = '该课程不存在或已删除'
    ERR_COURSE_NOT_FOUND
}
- if (result.data == '1') {
    error = '您没有修改权限'
    ERR_COURSE_MAN_PERMISSION_DENIED
}

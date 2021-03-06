//

// 用户相关的请求模块
//
import request from '@/utils/request' // 导入request.js中的request

// 用户登录
export const login = data => {
  // data是形参，调用login的时候需要把这次data的数据传递过来
  return request({
    method: 'post',
    url: '/app/v1_0/authorizations',
    data
  })
}
// 发送验证码的请求
export const sendSms = mobile => {
  // data是形参，调用login的时候需要把这次data的数据传递过来
  return request({
    method: 'GET',
    url: `/app/v1_0/sms/codes/${mobile}`
  })
}
// 获取用户自己的信息
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user'
  })
}
// 获取用户频道列表
export const getUserChannels = () => {
  // data是形参，调用login的时候需要把这次data的数据传递过来
  return request({
    method: 'get',
    url: '/app/v1_0/user/channels'
  })
}

// 关注用户
export const addFollow = userId => {
  // data是形参，调用login的时候需要把这次data的数据传递过来
  return request({
    method: 'POST',
    url: '/app/v1_0/user/followings',
    data: {
      target: userId
    }
  })
}

// 取消关注

export const deleteFollow = userId => {
  // data是形参，调用login的时候需要把这次data的数据传递过来
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/followings/${userId}`
  })
}

// 获取用户个人资料
export const getUserProfile = () => {
  // data是形参，调用login的时候需要把这次data的数据传递过来
  return request({
    method: 'GET',
    url: '/app/v1_0/user/profile'
  })
}

// 编辑用户资料
export const updateUserProfile = (data) => {
  // data是形参，调用login的时候需要把这次data的数据传递过来
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/profile',
    data
  })
}

// 更新用户照片资料
export const updateUserPhoto = (data) => {
  // data是形参，调用login的时候需要把这次data的数据传递过来
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/photo',
    data
  })
}

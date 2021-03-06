
import request from '@/utils/request' // 导入request.js中的request

// 获取所有频道列表
export const getAllChannels = () => {
  // data是形参，调用login的时候需要把这次data的数据传递过来
  return request({
    method: 'get',
    url: '/app/v1_0/channels'
  })
}

// 添加用户频道列表.频道数据持久化
export const addUserChannels = (channel) => {
  // data是形参，调用login的时候需要把这次data的数据传递过来
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/channels',
    data: {
      channels: [channel]
    }
  })
}
// 删除用户指定频道
export const deleteUserChannels = (channelId) => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/channels/${channelId}`
  })
}

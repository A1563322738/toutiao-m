//
// 评论请求模块
import request from '@/utils/request'
export const getComments = params => {
  return request({
    method: 'GET',
    url: '/app/v1_0/comments',
    params
  })
}

// 评论点赞
export const addCommentsLike = target => {
  return request({
    method: 'post',
    url: '/app/v1_0/comment/likings',
    data: {
      target
    }
  })
}
export const deleteCommentsLike = target => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/comment/likings/${target}`
  })
}
// 发布评论
export const addComment = data => {
  return request({
    method: 'post',
    url: '/app/v1_0/comments',
    data
  })
}

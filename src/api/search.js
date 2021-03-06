// 联想建议的请求

import request from '@/utils/request' // 导入request.js中的request

// 获取联想建议列表
export const getSearchSuggestion = (q) => {
  return request({
    method: 'GET',
    url: '/app/v1_0/suggestion',
    params: {
      q
    }
  })
}
// 获取联想建议列表
export const getSearchResult = params => {
  return request({
    method: 'GET',
    url: '/app/v1_0/search',
    params
  })
}

import request from '@/utils/request'

// 获取单词书列表
export function getFeedbackList(params) {
  return request({
    url: '/feedback/admin/feedback',
    method: 'get',
    params
  })
}

// 删除单词书
export function deleteFeedback(id) {
  return request({
    url: `/feedback/admin/feedback/${id}`,
    method: 'delete'
  })
}

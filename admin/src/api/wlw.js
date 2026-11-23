import request from '@/utils/request'

// 获取单词书词汇关联列表
export function getWlwList(params) {
  return request({
    url: '/wlw/admin/wlw',
    method: 'get',
    params
  })
}

// 创建关联
export function createWlw(data) {
  return request({
    url: '/wlw/admin/wlw',
    method: 'post',
    data
  })
}

// 删除关联
export function deleteWlw(id) {
  return request({
    url: `/wlw/admin/wlw/${id}`,
    method: 'delete'
  })
}

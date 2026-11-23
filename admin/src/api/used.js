import request from '@/utils/request'

// 获取正在学习列表
export function getUsedList(params) {
  return request({
    url: '/used/admin/used',
    method: 'get',
    params
  })
}

// 更新学习单词书
export function updateUsed(id, data) {
  return request({
    url: `/used/admin/used/${id}`,
    method: 'put',
    data
  })
}

// 删除学习记录
export function deleteUsed(id) {
  return request({
    url: `/used/admin/used/${id}`,
    method: 'delete'
  })
}

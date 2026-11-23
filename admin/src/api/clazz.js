import request from '@/utils/request'

// 获取词性列表
export function getClazzList(params) {
  return request({
    url: '/clazz/admin/clazz',
    method: 'get',
    params
  })
}

// 获取词性详情
export function getClazzDetail(id) {
  return request({
    url: `/clazz/admin/clazz/${id}`,
    method: 'get'
  })
}

// 新增词性
export function createClazz(data) {
  return request({
    url: '/clazz/admin/clazz',
    method: 'post',
    data
  })
}

// 更新词性
export function updateClazz(id, data) {
  return request({
    url: `/clazz/admin/clazz/${id}`,
    method: 'put',
    data
  })
}

// 删除词性
export function deleteClazz(id) {
  return request({
    url: `/clazz/admin/clazz/${id}`,
    method: 'delete'
  })
}

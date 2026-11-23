import request from '@/utils/request'

// 获取词性列表
export function getTestclazzList(params) {
  return request({
    url: '/tc/admin/tc',
    method: 'get',
    params
  })
}

// 获取词性详情
export function getTestclazzDetail(id) {
  return request({
    url: `/tc/admin/tc/${id}`,
    method: 'get'
  })
}

// 新增词性
export function createTestclazz(data) {
  return request({
    url: '/tc/admin/tc',
    method: 'post',
    data
  })
}

// 更新词性
export function updateTestclazz(data) {
  return request({
    url: `/tc/admin/tc`,
    method: 'put',
    data
  })
}

// 删除词性
export function deleteTestclazz(id) {
  return request({
    url: `/tc/admin/tc/${id}`,
    method: 'delete'
  })
}

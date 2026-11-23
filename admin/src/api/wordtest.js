import request from '@/utils/request'

// 获取测试记录列表
export function getTestList(params) {
  return request({
    url: '/test/admin/test',
    method: 'get',
    params
  })
}

// 更新测试状态（仅限guo字段）
export function updateTest(id, data) {
  return request({
    url: `/test/admin/test/${id}`,
    method: 'put',
    data
  })
}

// 删除测试记录
export function deleteTest(id) {
  return request({
    url: `/test/admin/test/${id}`,
    method: 'delete'
  })
}

// 获取测试类型列表
export function getTestClazzList() {
  return request({
    url: '/testclazz/admin/testclazz',
    method: 'get'
  })
}

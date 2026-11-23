import request from '@/utils/request'

// 获取单词书词汇关联列表
export function getUwlList(params) {
  return request({
    url: '/uwl/admin/uwl',
    method: 'get',
    params
  })
}

// 创建关联
export function createUwl(data) {
  return request({
    url: '/uwl/admin/uwl',
    method: 'post',
    data
  })
}

// 删除关联
export function deleteUwl(id) {
  return request({
    url: `/uwl/admin/uwl/${id}`,
    method: 'delete'
  })
}

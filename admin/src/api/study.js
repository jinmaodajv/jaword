import request from '@/utils/request'

// 获取学习记录列表
export function getStudyList(params) {
  return request({
    url: '/study/admin/study',
    method: 'get',
    params
  })
}

// 更新学习状态
export function updateStudy(id, data) {
  return request({
    url: `/study/admin/study/${id}`,
    method: 'put',
    data
  })
}

// 删除学习记录
export function deleteStudy(id) {
  return request({
    url: `/study/admin/study/${id}`,
    method: 'delete'
  })
}

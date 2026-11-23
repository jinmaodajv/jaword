import request from '@/utils/request'

// 获取例句列表
export function getSentenceList(params) {
  return request({
    url: '/sentence/admin/sentence',
    method: 'get',
    params
  })
}

// 创建例句（不包含sound字段）
export function createSentence(data) {
  return request({
    url: '/sentence/admin/sentence',
    method: 'post',
    data
  })
}

// 更新例句（不包含sound字段）
export function updateSentence(id, data) {
  return request({
    url: `/sentence/admin/sentence/${id}`,
    method: 'put',
    data
  })
}

// 删除例句
export function deleteSentence(id) {
  return request({
    url: `/sentence/admin/sentence/${id}`,
    method: 'delete'
  })
}

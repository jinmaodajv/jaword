import request from '@/utils/request'

export function getWordList(params) {
  return request({
    url: '/word/admin/word',
    method: 'get',
    params
  })
}

export function getWordDetail(id) {
  return request({
    url: `/word/admin/word/${id}`,
    method: 'get'
  })
}

export function createWord(data) {
  return request({
    url: '/word/admin/word',
    method: 'post',
    data
  })
}

export function updateWord(id, data) {
  return request({
    url: `/word/admin/word/${id}`,
    method: 'put',
    data
  })
}

export function deleteWord(id) {
  return request({
    url: `/word/admin/word/${id}`,
    method: 'delete'
  })
}

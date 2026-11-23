import request from '@/utils/request'

// 获取单词书列表
export function getWordlistList(params) {
  return request({
    url: '/wordlist/admin/wordlist',
    method: 'get',
    params
  })
}

// 创建单词书
export function createWordlist(data) {
  return request({
    url: '/wordlist/admin/wordlist',
    method: 'post',
    data: {
      ...data,
      code: '111', // 强制设置默认值
      wordcount: 0, // 强制设置默认值
      now: 1, // 强制设置默认值
      cumulative: 1 // 强制设置默认值
    }
  })
}

// 更新单词书
export function updateWordlist(id, data) {
  return request({
    url: `/wordlist/admin/wordlist/${id}`,
    method: 'put',
    data
  })
}

// 修改分享状态
export function changeWordlistState(id) {
  return request({
    url: `/wordlist/admin/wordlist/${id}`,
    method: 'patch'
  })
}
// 删除单词书
export function deleteWordList(id) {
  return request({
    url: `/wordlist/admin/wordlist/${id}`,
    method: 'delete'
  })
}

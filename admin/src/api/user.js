import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/admin/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/admin/info',
    method: 'get',
    params: { token }
  })
}

// 删改查
export function getUserList(params) {
  return request({
    url: '/user/admin/user',
    method: 'get',
    params
  })
}

export function getUserDetail(id) {
  return request({
    url: `/user/admin/user/${id}`,
    method: 'get'
  })
}

// 修改用户信息
export function updateUser(id, data) {
  return request({
    url: `/user/admin/user/${id}`,
    method: 'put',
    data
  })
}

// 修改用户状态
export function changeUserState(id, state) {
  return request({
    url: `/user/admin/user/${id}/state`,
    method: 'patch',
    data: { state }
  })
}

// 检查用户是否存在
export function checkUserExists(userId) {
  return request({
    url: `/user/admin/user/${userId}/exists`,
    method: 'get'
  })
}

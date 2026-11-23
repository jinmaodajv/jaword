import { login, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => { // 调用这儿
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = { // 由store.dispatch调用
  // 调用登录
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        console.log('响应数据：', response)
        const { data } = response
        commit('SET_TOKEN', data.token)// 存到vuex（状态管理器）中 调用上面mutations中的SET_TOKEN方法
        setToken(data.token)// 存储到cookie中
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取用户信息get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) { // 没有获取到用户信息
          return reject('验证失败，请重新登录.')
        }

        const { username, avatar } = data

        commit('SET_NAME', username)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 登出user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      // logout(state.token).then(() => {// loguot为上方import引入的方法
      removeToken() // 清空token must remove  token  first
      resetRouter() // 重置路由
      commit('RESET_STATE') // 清空vuex
      resolve()
      // }).catch(error => {
      // reject(error)
      // })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}


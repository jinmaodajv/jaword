import axios from 'axios'
import { Message } from 'element-ui' // MessageBox,
import store from '@/store'
import { getToken } from '@/utils/auth'

// 创建axiosd对象 用于http请求
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url 服务器地址为baseURL
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // 设置请求的超时时间
})

// 请求拦截 发送请求时拦截 之后再在请求中添加东西，完成后再发送
service.interceptors.request.use(
  config => {
    // do something before request is sent
    // 判断是否需要发送token
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // 如果存在token，那么设置到请求头中
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 响应拦截
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    console.log('响应拦截：', res)
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 20000) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      // if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
      //   // to re-login
      //   MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
      //     confirmButtonText: 'Re-Login',
      //     cancelButtonText: 'Cancel',
      //     type: 'warning'
      //   }).then(() => {
      //     store.dispatch('user/resetToken').then(() => {
      //       location.reload()
      //     })
      //   })
      // }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      // // 登录信息有误
      if (res.data == null) {
        Message({
          message: '输入信息有误',
          type: 'error',
          duration: 5 * 1000
        })
        // return Promise.reject(new Error(res.message || 'Error'))
      }
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service

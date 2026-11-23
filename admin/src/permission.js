import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // 白名单 no redirect whitelist

/**
 * 导航守卫to为要去的地址 from为原地址 next为放行的地址（拦截跳转页面）
 */
router.beforeEach(async(to, from, next) => {
  // 启动加载图标转圈 start progress bar
  NProgress.start()

  // document.title设置页面标题
  document.title = getPageTitle(to.meta.title)

  // 获取token determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') { // 去的是登录页
      // 自动跳转到首页 if is logged in, redirect to the home page
      next({ path: '/' })// 跳到首页
      NProgress.done() // 关闭加载图标
    } else { // 不是去登录页
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) { // 判断是否获取过用户信息
        next() // 直接放行
      } else {
        try {
          // 获取用户信息 get user info
          await store.dispatch('user/getInfo')
          // 获取到放行
          next()
        } catch (error) { // 获取用户信息失败（如：token失效）
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done() // 关闭加载图标
        }
      }
    }
  } else {
    /* 没有token has no token*/

    // 判断是否在白名单(不需登录就能访问的页面)中
    if (whiteList.indexOf(to.path) !== -1) {
      // 是白名单放行 in the free login whitelist, go directly
      next()
    } else {
      // 不是在白名单中送到登录页 other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

// beforeEach完成后 全局后置钩子
router.afterEach(() => {
  // 关闭加载图标 finish progress bar
  NProgress.done()
})

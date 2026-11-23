import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

// router.beforeEach((to,from,next) => {
//   if(to.path.startsWith('/login')) {
//     window.localStorage.removeItem('access-admin')
//     next()
//   }else{
//     let admin = JSON.parse(window.localStorage.getItem('access-admin'))
//     if(!admin){
//       next({path:'/login'})//next是跳转到后面的路径的意思
//     }else{
//       //校验token合法性
//       axios({
//         url:'http://localhost:8080/checkToken',
//         method:'get',
//         headers:{
//           token:admin.token
//         }
//       }).then((response) => {
//         if(!response.data){
//           console.log('校验失败')
//           next({path: '/error'})
//         }
//       })
//       next()
//     }
//   }
// })

/**
 * 动态路由
 */
export const asyncRoutes = []
/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard', affix: true }
    }]
  },

  {
    path: '/user',
    component: Layout,
    children: [
      {
        path: '',
        name: 'User',
        component: () => import('@/views/user/index'),
        meta: { title: '用户管理', icon: 'user' }
      }
    ]
  },

  {
    path: '/wordm',
    name: 'WordM',
    component: Layout,
    meta: { title: '词汇资源管理', icon: 'el-icon-collection-tag' },
    children: [
      {
        path: 'word',
        name: 'Word',
        component: () => import('@/views/wordm/word/index'),
        meta: { title: '词汇管理', icon: 'form' }
      },
      {
        path: 'clazz',
        name: 'Clazz',
        component: () => import('@/views/wordm/clazz/index'),
        meta: { title: '词性管理', icon: 'el-icon-document-remove' }
      },
      {
        path: 'sentence',
        name: 'Sentence',
        component: () => import('@/views/wordm/sentence/index'),
        meta: {
          title: '例句管理',
          icon: 'el-icon-document'
        }
      }
    ]
  },

  {
    path: '/wordlistm',
    name: 'WordListM',
    component: Layout,
    meta: { title: '单词书资源管理', icon: 'el-icon-collection' },
    children: [
      {
        path: 'wordlist',
        name: 'Wordlist',
        component: () => import('@/views/wordlistm/wordlist/index'),
        meta: { title: '单词书管理', icon: 'el-icon-reading' }
      },
      {
        path: 'wlw',
        name: 'Wlw',
        component: () => import('@/views/wordlistm/wlw/index'),
        meta: { title: '单词书词汇管理', icon: 'el-icon-tickets' }
      }
      // {
      //   path: 'uwl',
      //   name: 'Uwl',
      //   component: () => import('@/views/wordlistm/uwl/index'),
      //   meta: { title: '用户单词书管理', icon: 'el-icon-notebook-1' }
      // },
      // {
      //   path: 'used',
      //   name: 'Used',
      //   component: () => import('@/views/wordlistm/used/index'),
      //   meta: { title: '学习单词书管理', icon: 'el-icon-house' }
      // }
    ]
  },

  // {
  //   path: '/sandtm',
  //   name: 'SAndTM',
  //   component: Layout,
  //   meta: { title: '学习与测试管理', icon: 'el-icon-document-checked' },
  //   children: [
  //     {
  //       path: 'study',
  //       name: 'Study',
  //       component: () => import('@/views/sandtm/study/index'),
  //       meta: { title: '学习词汇管理', icon: 'el-icon-files' }
  //     },
  //     {
  //       path: 'wordtest',
  //       name: 'Wordtest',
  //       component: () => import('@/views/sandtm/wordtest/index'),
  //       meta: { title: '测试记录管理', icon: 'el-icon-s-help' }
  //     },
  //     {
  //       path: 'testclazz',
  //       name: 'Testclazz',
  //       component: () => import('@/views/sandtm/testclazz/index'),
  //       meta: { title: '测试类型管理', icon: 'el-icon-document-add' }
  //     }
  //   ]
  // },

  {
    path: '/testclazz',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Testclazz',
        component: () => import('@/views/testclazz/index'),
        meta: { title: '测试类型管理', icon: 'el-icon-document-add' }
      }
    ]
  },

  {
    path: '/feedback',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Feedback',
        component: () => import('@/views/feedback/index'),
        meta: { title: '反馈管理', icon: 'el-icon-message' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

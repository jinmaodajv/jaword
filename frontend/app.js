// app.js
import { $request } from './utils/request';
App({

  globalData:{
    user: {},//用户信息
    isLogin: false,//是否登录
    openid: "",//openid
    wlid: "",//当前正在学习的词汇集id
    wordListData:{},//词汇集信息
  },
  $request,

  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: null
  }
})

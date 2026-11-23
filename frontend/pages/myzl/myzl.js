// pages/myzl/myzl.js
import request from '../../utils/request'
const  app =  getApp();//引用全局变量，获取雇主的openid
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: "",
    hasUserInfo: false, //是否有用户信息
    login: false, //是否正在登录
    isLogin: "",//是否登录过
    uname: "",//用户昵称
    tupian: "",//用户头像
    phone: "",//用户手机号
    code:"",//设置全局变量
    user: "",//用户信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.setData({
      isLogin: app.globalData.isLogin,//是否登录过
      user: app.globalData.user,//用户信息
      ismarketers: app.globalData.ismarketers,//是否是商家
      avatarUrl:app.globalData.user.avatar//获取头像信息
    })
  },


  //获取用户头像 有用
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail 
    this.setData({
      avatarUrl,
    })
    // 上传图片
    var that = this
    
    wx.uploadFile({
      url: 'http://localhost:8080/jaword/upload', //开发者服务器地址
      filePath: avatarUrl,//要上传文件资源的路径 (本地路径)
      name: 'file',//文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容
      success (res){
        console.log(res)
        that.setData({
          // 获取图片临时地址
          tupian: res.data
        })   
      }
    })
  },

  // 获取昵称 有用
  getValue(e) {
    console.log(e.detail.value)
    this.setData({
      uname: e.detail.value
    })
  },

  // 确认 有用
  async queren() {
    if(this.data.uname==null||this.data.avatarUrl==null||this.data.uname==""||this.data.avatarUrl==""){
      wx.showToast({
        title: '请输入有效信息',
        icon: 'error'
      })
    }
    else {
      let R = await request('/user', {openid:app.globalData.openid,name: this.data.uname,code: '11111',avatar: this.data.tupian},'PUT');
      if(R){
        wx.showToast({
          title: '修改成功',
          icon: 'success'
        })
        this.getUser();//获取用户信息
      }
    }
  },


  //本地存储 有用
  setStorage(user,openid){
    wx.setStorage({
      key: "user",
      data:user
    })
    wx.setStorage({
      key: "openid",
      data:openid
    })
    setTimeout(function() {
      wx.switchTab({
        url: '/pages/my/my'
      })
    }, 1000);
  },

  //获取本地存储信息
  getLoginInfo(){
    let user = wx.getStorageSync("user");
    this.setData({
      user,
    })
  },


  //获取用户信息
  async getUser(){
    let R = await request('/user/'+app.globalData.openid);
    let user = R.data
    let openid = app.globalData.openid
    console.log("user:"+user)
    console.log("openid:"+openid)
    this.setData({
      user,
    })
    this.setStorage(user,openid); //本地存储
  },





  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})
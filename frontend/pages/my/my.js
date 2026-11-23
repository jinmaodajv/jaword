// pages/my/my.js
import request from '../../utils/request'
const  app =  getApp();//引用全局变量，获取雇主的openid
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: "",
    uname: "",//用户昵称
    hasUserInfo: false, //是否有用户信息

    login: false, //是否正在登录
    isLogin: "",//是否登录过

    tupian: "",//用户头像
    phone: "",//用户手机号
    code:"",//设置全局变量
    user: "",//用户信息
    ismarketers: false,//是否是商家
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.getLoginInfo();//获取本地存储信息
  },
  

  //去分享状况
  toFXZK(){
    wx.navigateTo({
      url: '/pages/fxzk/fxzk',
    });
  },


  //去分享社区
  toFXSQ(){
    wx.navigateTo({
      url: '/pages/fxsq/fxsq',
    });
  },

  //去汉字读音
  toKJDY(){
    wx.navigateTo({
      url: '/pages/zwkj/zwkj',
    });
  },

  //去来自分享页面
  toLZFX(){
    wx.navigateTo({
      url: '/pages/lzfx/lzfx',
    });
  },



  //去掌握或做错
  toCCZW(event){
    wx.navigateTo({
      url: '/pages/zwhzc/zwhzc',
      success:function(res){
        res.eventChannel.emit('toCCZW',{iscc: event.currentTarget.dataset.iscc})
      }
    });
  },

  //去收藏页面 有用
  toSC() {
    wx.navigateTo({
      url: '/pages/mysc/mysc',
    })
  },


  // 获取昵称 和 头像 有用
  getNC() {
    wx.navigateTo({
      url: '/pages/myzl/myzl',
    })
  },


  //本地存储 
  setStorage(user,openid){
    wx.setStorage({
      key: "user",
      data:user
    })
    wx.setStorage({
      key: "openid",
      data:openid
    })
  },


  //获取本地存储信息 有用
  getLoginInfo(){
    //用户全部信息
    let user = wx.getStorageSync("user");
    app.globalData.user = user
    console.log(app.globalData.user)
  
   //用户openid
    let openid = wx.getStorageSync("openid");
    app.globalData.openid = openid
  
    console.log("全局openid:"+app.globalData.openid)
    if(Object.keys(app.globalData.user).length >0){//判断对象是否为空
      app.globalData.isLogin = true;//如果不为空赋值为true
      console.log(app.globalData.isLogin)
      console.log("用户名："+user.name)
      console.log("头像："+user.avatar)
      this.setData({
        user: app.globalData.user,//用户信息
        uname: user.name,//用户名
        avatarUrl:user.avatar,//用户头像
        hasUserInfo: true,//是否有用户信息
      })
    }
  },




  // 获取昵称
  getValue(e) {
    console.log(e.detail.value)
    this.setData({
      uname: e.detail.value
    })
  },

  //反馈 有用
  async addFe(text){
    let user = wx.getStorageSync("user");
    let R = await request('/feedback',{user:user.id,text:text},'POST');
    if(R.data){//反馈成功
      wx.showToast({
        title: '反馈成功',
        icon: 'success',
        duration: 2000
      })
    }
  },

  //反馈 有用
  fk(){
    let _this = this
    wx.showModal({
      title: '我要反馈',
      editable: true,
      placeholderText: '请输入反馈内容',
      success (res) {
        if (res.confirm) {
          let text = res.content//反馈内容
          if(res.content==null||res.content==""){
            wx.showToast({
              title: '反馈为空',
              icon: 'error',
              duration: 2000
            })
          }else{
            console.log("执行反馈了吗")
            _this.addFe(text)//添加反馈信息
          }
        } else if (res.cancel) {
          wx.showToast({
            title: '反馈失败',
            icon: 'error',
            duration: 2000
          })
        }
      }
    })
  },

  
 


 




 



  //获取用户信息
  async getOpenid(){//注册用户
    let R = await request('/user', {code: this.data.code,name: this.data.uname,avatar: this.data.tupian,phone: this.data.phone},'POST');
    let user = R.data
    console.log("user:"+user)
    let {avatar,balance,id,name,openid,phone,session_key,state,ismarketers,code} = user
    console.log("openid:"+openid)
    console.log("balance:"+balance)
    this.setData({
      user,
    })
    this.setStorage(user,openid,balance,ismarketers);
  },
  onShareAppMessage() {
    return {};
  },

  isLogin(){
    wx.showToast({
      title: '请先登录',
      icon: 'none',
      duration: 1000,
      mask: true,
    })
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
    this.getLoginInfo();//获取本地存储信息
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
// pages/home/home.js
import request from '../../utils/request'
const  app =  getApp();//引用全局变量，获取雇主的openid
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentBook: 'N5词汇',//词汇集名称
    progress: 50,//学习进度
    user:{},//用户信息
    wordListData:{},//词汇集数据
    code:"",//设置全局变量
    avatarUrl:"http://localhost:8080/jaword/images/1.jpg",
    nickName:"用户",
    phone:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getLoginInfo();//获取本地存储信息，为空及未登录
    this.isLogin();
    //this.getWordListData();//获取词汇集数据
  },



  //获取本地存储信息
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
      this.getWordListData(openid);//获取词汇集数据
      app.globalData.isLogin = true;//如果不为空赋值为true
      console.log(app.globalData.isLogin)
    }
  },



  //检测是否登录
  isLogin(){
    if(!app.globalData.isLogin){
      let codeCopy = "";
      //获取code值
      wx.login({
        success: (res) => {
          console.log(res);
          codeCopy = res.code
          console.log(codeCopy);
          this.setData({
            code: codeCopy
          })
          this.getOpenid();//注册用户-获取用户openid
        },
      })
    }
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


  //获取用户信息
  async getOpenid(){//注册用户-获取用户openid
    let R = await request('/user', {code: this.data.code,name: this.data.nickName,avatar: this.data.avatarUrl,phone: this.data.phone},'POST');
    let user = R.data
    console.log("user:"+user)
    let {avatar,id,name,openid,phone,session_key,state,code} = user
    console.log("openid:"+openid)
    this.setData({//赋值
      user,
    })
    this.setStorage(user,openid);//添加到本地存储 
    this.getLoginInfo();//赋值到全局变量
    this.getWordListData(openid);//获取词汇集数据
  },



  //获取词汇集数据
  async getWordListData(openid){//获取词汇集数据
    let R = await request('/used/'+openid);
    let wordListData = R.data
    let progress = wordListData.yxShu/wordListData.zshu*100
    console.log("wordListData:"+wordListData)
    app.globalData.wlid = wordListData.wlId//赋值为全局变量
    app.globalData.wordListData = wordListData//赋值词汇集信息
    this.setData({//赋值
      wordListData,
      progress
    })
  },

  // 搜索词汇输入事件
  onSearchInput: function (e) {
    const keyword = e.detail.value;
    console.log('搜索关键词:', keyword);
    // 这里可以调用搜索接口或跳转到搜索页面
    wx.navigateTo({
      url: `/pages/search/search?keyword=${keyword}`,
    });
  },

  // 更换单词书事件
  onChangeBook: function () {
    console.log('更换单词书');
    // 这里可以弹出单词书选择列表
    // 打开菜单前设置页面背景色
    wx.showActionSheet({
      itemList: ['系统自带', '您的收藏', '用户分享'],
      success: (res) => {
        const selectedBook = ['系统自带', '您的收藏', '用户分享'][res.tapIndex];
        console.log("是什么单词书："+res.tapIndex)
        let xzf = res.tapIndex + 1
        console.log('选择的单词书:', selectedBook);
        // 跳转到词汇集页面
        wx.navigateTo({
          url: '/pages/wlist/wlist',
          success:function(res){
            res.eventChannel.emit('addWList',{xzf: xzf})
          }
        });
      },
    });
  },

  // 开始学习事件
  onStartLearning: function (event) {
    console.log('事件对象:', event);
    console.log('dataset:', event.currentTarget.dataset);
    console.log('wlId:', event.currentTarget.dataset.wlid);
    console.log('开始学习:'+event.currentTarget.dataset.wlid);
    if(this.data.wordListData.yxShu==this.data.wordListData.zshu){
      wx.showToast({
        title: '您已全部学完',
        icon: 'success',
        duration: 1000
      })
    }else{
      // 跳转到学习页面
      wx.navigateTo({
        url: '/pages/learning/learning',
        success:function(res){
          res.eventChannel.emit('toStudy',{wlid: event.currentTarget.dataset.wlid})
        }
      });
    }
  },

  //跳转至搜索页面
  toSearch(){
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.onLoad();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})
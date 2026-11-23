// pages/fxzk/fxzk.js

import request from '../../utils/request'
const  app =  getApp();//引用全局变量，获取雇主的openid
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isZDLJ:true,//是否为最大累计
    isZDDC:false,//是否为最大当前
    sumNow:0,//总当前使用人数
    sumCumulative:0,//总累计使用人数
    sumWordCount:0,//总单词数
    maxNowWL:{},//最大使用人数词汇集
    maxCumulativewl:{},//最大累计使用人数词汇集
    wordListData:[],//词汇集集合
    uname:"",//用户名
    avatar:"/static/images/home/preview.jpg",//用户头像
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let user = wx.getStorageSync("user");
    let _this = this
    this.setData({
      uname:user.name,//获取用户名
      avatar:user.avatar,//获取头像
    })
    this.getMaxCum()//获取最大累计
    this.getMaxNow()//获取最大当前
    setTimeout(function() {
      _this.getWordList()//获取词汇集数据
    }, 350);
  },


  //设置最大累计
  setZDLJ(){
    let isZDLJ = this.data.isZDLJ
    let isZDDC = this.data.isZDDC
    if(isZDLJ){
      isZDLJ = false
      isZDDC = true
      this.setData({
        isZDLJ,//设置切换
        isZDDC
      })
    }else if(isZDDC){
      isZDLJ = false
      isZDDC = false
      this.setData({
        isZDLJ,//设置切换
        isZDDC
      })
    }else{
      isZDLJ = true
      isZDDC = false
      this.setData({
        isZDLJ,//设置切换
        isZDDC
      })
    }


  },

  //获取最大累计 有用
  async getMaxCum(){
    let R = await request('/share/true/'+app.globalData.openid);
    let maxCumulativewl = R.data
    this.setData({
      maxCumulativewl
    })
  },

  //获取最大当前 有用
  async getMaxNow(){
    let R = await request('/share/false/'+app.globalData.openid);
    let maxNowWL = R.data
    this.setData({
      maxNowWL
    })
  },

  //获取词汇集数据
  async getWordList(){
    let R = await request('/uwl/'+2+'/'+app.globalData.openid);
    let wordList = R.data
    const wordListData = wordList.map(item => {
      //每一个对象添加新属性
      item.isxz = false; //添加选择属性
      return item;
    })
    let sumNow = this.data.sumNow//总当前
    let sumCumulative = this.data.sumCumulative//总累计
    let sumWordCount = this.data.sumWordCount//总单词数
    for(let i = 0;i<wordListData.length;i++){
      sumNow = sumNow + wordListData[i].now
      sumCumulative = sumCumulative + wordListData[i].cumulative
      sumWordCount = sumWordCount + wordListData[i].wordcount
    }
    this.setData({
      wordListData,
      sumNow,
      sumCumulative,
      sumWordCount
    })
  },



  //查看词汇集中的词汇 有用
  cxWord(event){
    if(event.currentTarget.dataset.wordcount == 0){
      wx.showToast({
        title: '请先添加词汇',
        icon: 'error',
        duration: 1000
      })
    }else{
      let wlid = event.currentTarget.dataset.id //词汇集ID
      wx.navigateTo({
        url: '/pages/wlword/wlword',
        success:function(res){
          res.eventChannel.emit('toWLWord',{wlid: wlid})
        }
      })
    }
  },



  //选中 有用
  xuanZhong(event){
    const {wordListData} = this.data
    let wlid = event.currentTarget.dataset.id //词汇集ID
    for(let i=0;i<wordListData.length;i++){
      if(wordListData[i].id==wlid){
        wordListData[i].isxz = true //选中
      }else{
        wordListData[i].isxz = false //没有选中
      }
    }
    this.setData({
      wordListData,
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
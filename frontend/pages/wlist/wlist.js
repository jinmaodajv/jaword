// pages/wlist/wlist.js

import request from '../../utils/request'
const  app =  getApp();//引用全局变量，获取雇主的
Page({

  /**
   * 页面的初始数据
   */
  data: {
    xzf:1,//1-系统自带词汇集(用户1) 2-用户创建词汇集(用户ID) 3-用户分享词汇集(非用户ID)
    wordListData:[],//词汇集列表
    wlid:"",//选择的词汇集ID
    isXZ:false,//是否有已选中词汇集
    isytzd:true,//系统自带
    isndsc:false,//您的收藏
    isyhfx:false,//用户分享
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let _this = this;
    const eventChannel = this.getOpenerEventChannel();
    this.eventChannel = eventChannel;

    eventChannel.on('addWList', function (res) {
      console.log("res的数据：" + res); // 打印 res 的数据
      let xzf = res.xzf
      if(xzf == 1){
        _this.setData({
          xzf,
        }, () => {
          // setData 回调函数，确保数据更新后执行
          _this.getWordList()
        });
      }
      if(xzf == 2 ){
        _this.setData({
          xzf,
          isytzd:false,
          isndsc:true,//设置您的收藏为true
        }, () => {
          // setData 回调函数，确保数据更新后执行
          _this.getWordList()
        });
      }if(xzf == 3){
        _this.setData({
          xzf,
          isytzd:false,
          isyhfx:true,//设置用户分享为true
        }, () => {
          // setData 回调函数，确保数据更新后执行
          _this.getWordList()
        });
      }
    });
  },


  //更新正在学习的词汇集
  async updateUsed(){
    let wlid = this.data.wlid
    let uid = wx.getStorageSync("user").id;
    console.log("wlid:"+wlid +"uid:" +uid)
    if(wlid == null){//没有选择
      wx.showToast({//提示请选择
        title: '请先选择',
        icon: 'error',
        duration: 1000 // 提示框显示 1 秒
      })
    }else{
      let R = await request('/used',{id:null,userwordlist:wlid,user:uid},'PUT');
      if(R){//更新成功
        wx.showToast({//提示更换成功
          title: '更换成功',
          icon: 'success',
          duration: 1000 // 提示框显示 1 秒
        })
        //1秒后执行跳回主页面
        setTimeout(function() {
          wx.switchTab({//跳回主页面
            url: '/pages/home/home'
          })
        }, 1000);
      }else{
        wx.showToast({//提示更换失败
          title: '更换失败',
          icon: 'error',
          duration: 1000 // 提示框显示 1 秒
        })
      }
    }
  },




  //查看词汇集中的词汇
  cxWord(event){
    if(event.currentTarget.dataset.wordcount == 0){
      wx.showToast({
        title: '单词书没有词汇',
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





  //选中
  xuanZhong(event){
    const {isXZ,wordListData} = this.data
    let wlid = event.currentTarget.dataset.id //词汇集ID
    for(let i=0;i<wordListData.length;i++){
      if(wordListData[i].id==wlid){
        wordListData[i].state = true //选中
      }else{
        wordListData[i].state = false //没有选中
      }
    }
    this.setData({
      wordListData,
      wlid//更新选中词汇集ID
    })
  },


  //获取词汇集数据
  async getWordList(){
    let R = await request('/uwl/'+this.data.xzf+'/'+app.globalData.openid);
    let wordListData = R.data
    for(let i = 0;i<wordListData.length;i++){
      wordListData[i].state = false
    }
    this.setData({
      wordListData
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
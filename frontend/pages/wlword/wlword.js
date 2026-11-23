// pages/wlword/wlword.js
import request from '../../utils/request'
const  app =  getApp();//引用全局变量，获取雇主的openid
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wlid:"",//词汇集ID
    wordList:[],//词汇集合
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    let _this = this;
    const eventChannel = this.getOpenerEventChannel();
    this.eventChannel = eventChannel;

    eventChannel.on('toWLWord', function (res) {
      console.log("res的数据：" + res.wlid); // 打印 res 的数据
      _this.setData({
        wlid: res.wlid, // 更新 data 中的 wlId
      }, () => {
        // setData 回调函数，确保数据更新后执行
        _this.getWordData()
      });
    });
  },
  

  // 获取词汇集中词汇数据
  async getWordData(){
    let {wlid,wordList} = this.data
    // 发请求获取词汇集中的词汇数据
    let R = await request('/wlw/'+wlid);
    console.log(R.data)
    wordList = R.data
    this.setData({
      wordList
    })
  },

  // 点击搜索内容事件
  toWord(e){
    let id = e.currentTarget.dataset.id;
    let clazz = e.currentTarget.dataset.clazz;
    wx.navigateTo({//跳转
      url: '/pages/word/word',
      success:function(res){
        res.eventChannel.emit('toword',{id: id,clazz:clazz})
      }
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
    console.log("这里的词汇集ID是什么："+this.data.wlid)
    if(this.data.wlid != null && this.data.wlid != ""){
      this.getWordData()//返回重新加载
    }
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
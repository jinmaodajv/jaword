// pages/zwhzc/zwhzc.js
import request from '../../utils/request'
const  app =  getApp();//引用全局变量，获取雇主的openid
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isCC: 0,//是否为做错过的词汇




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

    eventChannel.on('toCCZW', function (res) {
      console.log("res的数据：" + res.iscc); // 打印 res 的数据
      _this.setData({
        isCC: res.iscc, // 更新 data 中的 wlId
      }, () => {
        // setData 回调函数，确保数据更新后执行
        _this.getWordData()
      });
    });
  },
  

  // 获取词汇集中词汇数据
  async getWordData(){
    let isCC = this.data.isCC
    let wordList = this.data.wordList
    console.log("isCC是什么"+isCC)


    if (typeof isCC === 'boolean') {
      console.log('value 是布尔类型');
    } else {
      console.log('value 不是布尔类型');
    }


    if(isCC == 1){//是选择做错词汇
      let R = await request('/test/'+app.globalData.openid+'?isCC=true');
       // 发请求获取词汇数据
      console.log("里面isCC是什么"+isCC)
      console.log("是错题："+R.data)
      wordList = R.data
      this.setData({
        wordList
      })
    }else{//是掌握词汇
      let R = await request('/test/'+app.globalData.openid);
      // 发请求获取词汇数据
      console.log("是掌握："+R.data)
      console.log("里面isCC是什么"+isCC)
      wordList = R.data
      this.setData({
        wordList
      })
    }
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
    //this.getWordData()//返回重新加载
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
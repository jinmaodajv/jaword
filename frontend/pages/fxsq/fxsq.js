// pages/fxsq/fxsq.js

import request from '../../utils/request'
const  app =  getApp();//引用全局变量，获取雇主的openid
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shareData:[],//分享数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let _this = this;
    //0.35秒后执行获取数据
    setTimeout(function() {
      _this.getWordListData()//获取词汇集数据
    }, 350);
  },




  //查看词汇集中的词汇 有用
  cxWord(event){
    if(event.currentTarget.dataset.wordcount == 0){
      wx.showToast({
        title: '该单词书无词汇',
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




  //通过词汇集ID添加 有用
  async addWLById(event){
    let user = wx.getStorageSync("user");
    let wlid = event.currentTarget.dataset.wlid//词汇集ID
    let R = await request('/uwl',{id:wlid,user:user.id,code:'1111',name:'1111'},'POST');
    if(R.data){//添加成功
      wx.showToast({
        title: '添加成功',//XX成功
        icon: 'success',
        duration: 2000
      })
      this.getWordListData()//更新
    }
  },




  //获取分享数据
  async getWordListData(){//获取词汇集数据
    let R = await request('/share/'+app.globalData.openid);
    let shareData = R.data
    console.log("shareData:"+shareData)
    this.setData({//赋值
      shareData,
    })
  },


   // 复制分享码到剪切板
   copyCode(event) {
    let code = event.currentTarget.dataset.code//分享码
    wx.setClipboardData({
      data: code, // 要复制的文字
      success(res) {
        wx.showToast({
          title: '复制成功',
          icon: 'success',
        });
      },
      fail(err) {
        wx.showToast({
          title: '复制失败',
          icon: 'none',
        });
        console.error('复制失败:', err);
      },
    });
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
// pages/wtest/wtest.js
import request from '../../utils/request'
const  app =  getApp();//引用全局变量，获取雇主的
Page({

  /**
   * 页面的初始数据
   */
  data: {
    guoCount:0,//已掌握词汇数
    wordListData:{},//词汇集信息
    progress:50,//当前进度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let _this = this
    this.setData({
      wordListData:app.globalData.wordListData
    },()=>{
      _this.getGuoCount();//获取已掌握词汇数
    })
  },

  //是否有已学词汇
  isYouYX(){
    console.log("已学词汇:"+this.data.wordListData.yxShu)
    if(this.data.wordListData.yxShu == 0){
      console.log("还没有已学词汇")
      wx.showToast({//提示还没有已学词汇
        title: '您没有已学词汇',
        icon: 'success',
        duration: 1000 // 提示框显示 1 秒
      })
      //1秒后执行跳回测试页面
      setTimeout(function() {
        wx.switchTab({//跳回测试页面
          url: '/pages/home/home'
        })
      }, 1000);
    }else{
      return true
    }
  },

  //跳转到听音速记
  toTYSJ(){
    if(this.isYouYX()){//是否有已学词汇
      wx.navigateTo({
        url: '/pages/tysj/tysj',
      });
    }
  },


  //跳转到已学复习
  toYXFX(){
    if(this.isYouYX()){//是否有已学词汇
      wx.navigateTo({
        url: '/pages/yxfx/yxfx',
      });
    }
  },

  //跳转到错题专项或综合测试
  toCTZX(event){
    if(this.isYouYX()){//是否有已学词汇
      let isctzx = event.currentTarget.dataset.isctzx
      wx.navigateTo({
        url: '/pages/ctzx/ctzx',
        success:function(res){
          res.eventChannel.emit('toCTZX',{isctzx: isctzx})
        }
      });
    }
  },

  //跳转到八种测试页面
  toTest(event){
    if(this.isYouYX()){//是否有已学词汇
      let testclazz = event.currentTarget.dataset.testclazz
      wx.navigateTo({
        url: '/pages/jutitest/jutitest',
        success:function(res){
          res.eventChannel.emit('toTest',{testclazz: testclazz})
        }
      });
    }
  },



  //获取已掌握词汇数
  async getGuoCount(){//获取已掌握词汇数
    let R = await request('/study/'+app.globalData.wlid+'/'+app.globalData.openid);
    let guoCount = R.data
    let progress = guoCount/this.data.wordListData.yxShu*100
    console.log("guoCount:"+guoCount)
    this.setData({//赋值
      progress,
      guoCount
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
    this.onLoad()//测试完返回刷新
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
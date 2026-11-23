// pages/zwkj/zwkj.js
// pages/zwhzc/zwhzc.js
import request from '../../utils/request'
const  app =  getApp();//引用全局变量，获取雇主的openid
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wlid:"",//词汇集ID
    kanjiList:[],//词汇集合
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getKanjiData()
  },
  

  // 学习汉字数据
  async getKanjiData(){
    let R = await request('/skj/'+app.globalData.openid);
    // 发请求获取汉字数据
    console.log("是学习过的汉字："+R.data)
    let kanjiList = R.data
    this.setData({
      kanjiList
    }, () => {
      if(this.data.kanjiList.length == 0){
        wx.showToast({//提示您暂时没有学习
          title: '您没有学习汉字',
          icon: 'success',
          duration: 1000 // 提示框显示 1 秒
        })
        //1秒后执行跳回测试页面
        setTimeout(function() {
          wx.switchTab({//跳回测试页面
            url: '/pages/home/home'
          })
        }, 1000);
      }
    })
  },

  // 点击搜索内容事件
  toKanji(e){
    let id = e.currentTarget.dataset.id;
    let kanji = e.currentTarget.dataset.kanji;
    let kid = e.currentTarget.dataset.kid;
    let kana = e.currentTarget.dataset.kana;
    wx.navigateTo({//跳转
      url: '/pages/kanji/kanji',
      success:function(res){
        res.eventChannel.emit('tokanji',{id: id,kanji:kanji,kid:kid,kana:kana})
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
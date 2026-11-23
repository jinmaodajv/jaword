// pages/kanji/kanji.js
// pages/word/word.js
import request from '../../utils/request'
const  app =  getApp();//引用全局变量，获取雇主的openid
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",//汉字ID
    kanji: "",//汉字
    kana: {},//假名集合
    kanaWord: {},//假名词汇集合
    kkId: "",//当前显示的kkId
    kkKana: "",//当前显示的汉字假名
    isNull: false,//假名词汇是否为空
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // let _this = this;
    // this.setData({
    //   id: 90, // 汉字ID
    //   kanji: "自", // 汉字
    //   kkId: 223, // 汉字假名ID
    //   kkKana: "し" // 汉字假名
    // }, () => {
    //   _this.getKana()//获取汉字假名信息
    // })



    let _this = this;
    const eventChannel = this.getOpenerEventChannel();
    this.eventChannel = eventChannel;

    eventChannel.on('tokanji', function (res) {
      console.log("res的数据：" + res.kid); // 打印 res 的数据
      _this.setData({
        id: res.kid, // 汉字ID
        kanji: res.kanji, // 汉字
        kkId: res.id, // 汉字假名ID
        kkKana: res.kana // 汉字假名
      }, () => {
        _this.getKana()//获取汉字假名信息
        console.log("汉字ID：" + _this.data.id); // 打印更新后的 id
      });
    });
  },

    

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  //获取假名数据
  async getKana(){//获取假名数据
    let R = await request('/kk/'+ this.data.id);
    let kana = R.data
    let _this = this;
    console.log("kanaData:"+kana)
    this.setData({//赋值
      kana
    }, () => {
      _this.getKanaWord()
    })
  },

  //获取假名词汇信息
  async getKanaWord(){//获取假名词汇信息
    let R = await request('/wk/'+this.data.kkId);
    let kanaWord = R.data
    console.log("kanaWordData:"+kanaWord)
    let isNull = false
    if(Object.keys(kanaWord).length === 0){//是空
      isNull = true
    }
    this.setData({//赋值
      kanaWord,
      isNull
    })
  },

  //更换汉字假名并获取对应词汇
  getWord(event){
    let kkId =  event.currentTarget.dataset.kkid //汉字假名ID
    let kkKana = event.currentTarget.dataset.kkkana //汉字假名
    this.setData({//赋值
      kkId,
      kkKana
    }, () => {
      this.getKanaWord()
    })
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
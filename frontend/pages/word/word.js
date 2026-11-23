// pages/word/word.js
import request from '../../utils/request'
const  app =  getApp();//引用全局变量，获取雇主的openid
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    clazz: "",
    word: {},//  id:"",//词汇ID clazz:"",//词性ID word:"",//词汇名 kana:"",//假名 translate:"",//释义  sound:""//发音
    isFavoritePanelOpen: false, // 收藏夹面板是否展开
    wordList:{},// 收藏夹信息
    sentence:{},// 例句信息
    audioContext: null //音频上下文对象
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    const eventChannel = this.getOpenerEventChannel();
    this.eventChannel = eventChannel;

    eventChannel.on('toword', function (res) {
      console.log("res的数据：" + res.id); // 打印 res 的数据
      _this.setData({
        id: res.id, // 更新 data 中的 id
        clazz:res.clazz
      }, () => {
        // setData 回调函数，确保数据更新后执行
        _this.getWord()//获取词汇信息
        _this.getSentence()//获取例句信息
        _this.getClazz()//获取词性
        _this.getWordListData()//获取收藏夹信息
        console.log("单词ID：" + _this.data.id); // 打印更新后的 id
      });
    });

    const audioContext = wx.createInnerAudioContext({
      useWebAudioImplement: true // 是否使用 WebAudio 作为底层音频驱动，默认关闭。对于短音频、播放频繁的音频建议开启此选项，开启后将获得更优的性能表现。由于开启此选项后也会带来一定的内存增长，因此对于长音频建议关闭此选项
    })
    this.setData({
      audioContext
    });

  },

    

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  //确认收藏
  async isSouChang(){
    let R = await request('/wlw',{wid:this.data.id,wll:this.data.wordList},'POST');
    console.log("是否成功："+R.data)
    if(R.data){
      wx.showToast({//提示修改成功
        title: '修改成功',
        icon: 'success',
        duration: 1000 // 提示框显示 1 秒
      })
      this.getWordListData()//重新获取收藏夹信息
    }
  },


  //设置收藏
  setSouChang(event){
    let index = event.currentTarget.dataset.index //当前元素索引
    let id =  event.currentTarget.dataset.id //当前收藏夹id
    let xz = event.currentTarget.dataset.xz //当前收藏夹是否选中
    let wordcount = event.currentTarget.dataset.wordcount //当前点击前的词汇总数
    if(xz){//之前是在收藏夹中，点击后不在，及减一
      wordcount = wordcount - 1
    }else{//之前不在收藏夹中，点击后在，及加一
      wordcount = wordcount + 1
    }
    console.log("id:"+ id + "选中：" + xz)
    this.setData({
      [`wordList[${index}].state`]: !xz,
      [`wordList[${index}].wordcount`]:wordcount
    })
  },


  //播放音频
  getMP3(event){
    let audioContext = this.data.audioContext
    audioContext.src = event.currentTarget.dataset.src
  
    audioContext.play() // 播放
  
    //innerAudioContext.pause() // 暂停
  
    //innerAudioContext.stop() // 停止
  
    //innerAudioContext.destroy() // 释放音频资源
  },

  //获取词性
  async getClazz(){//获取词性
    let R = await request('/clazz/'+this.data.clazz);
    let clazz = R.data.name
    console.log("clazzData:"+clazz)
    this.setData({//赋值
      clazz
    })
  },

  //获取收藏夹信息
  async getWordListData(){//获取收藏夹信息
    let R = await request('/wlw/'+this.data.id+'/'+app.globalData.openid);
    let wordList = R.data
    console.log("wordListData:"+wordList)
    this.setData({//赋值
      wordList
    })
  },

  //获取例句
  async getSentence(){//获取例句数据
    let R = await request('/sentence/'+this.data.id);
    let sentence = R.data
    console.log("sentenceData:"+sentence)
    this.setData({//赋值
      sentence
    })
  },

  //获取词汇数据
  async getWord(){//获取词汇数据
    let R = await request('/word/one',{id: this.data.id});
    let word = R.data
    console.log("wordData:"+word)
    this.setData({//赋值
      word
    })
  },


  // 切换收藏夹面板
  toggleFavoritePanel() {
    this.setData({
      isFavoritePanelOpen: !this.data.isFavoritePanelOpen,
    });
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
    // 页面卸载时销毁音频上下文对象
    const audioContext = this.data.audioContext;
    if (audioContext) {
      audioContext.destroy();
    }
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
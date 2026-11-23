// pages/tysj/tysj.js
import request from '../../utils/request'
const  app =  getApp();//引用全局变量，获取雇主的openid
Page({

  /**
   * 页面的初始数据
   */
  data: {

    interval: 0, // 默认时间间隔
    repeat: 0, // 默认重复次数
    intervalOptions: ['0', '1', '2', '3','4', '5','6', '7','8','9','10'], // 时间间隔选项
    repeatOptions: ['0', '1', '2', '3','4', '5','6', '7', '8', '9','10'], // 重复次数选项
    showIntervalPicker: false, // 是否显示时间间隔选择器
    showRepeatPicker: false, // 是否显示重复次数选择器
    isPlaying:false,//是否在播放
    playCount: 0, // 当前播放次数
    isDianJi:false,//是否有点击操作





    wlid: "",//词汇集ID
    wordData:{},//词汇数据
    currentIndex: 0, // 当前显示的数据索引
    isXiangQing:false,//是否显示词汇详情页面
    isChuSiHua:false,//数据是否加载完成
    wordCount: 0,//词汇数


 

    
    //页面详情页数据
    id: "",
    clazz: "",
    word: {},//  id:"",//词汇ID clazz:"",//词性ID word:"",//词汇名 kana:"",//假名 translate:"",//释义  sound:""//发音
    isFavoritePanelOpen: false, // 收藏夹面板是否展开
    wordList:{},// 收藏夹信息
    audioContext: null //音频上下文对象
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initAudioContext(); // 初始化音频上下文
    this.setData({
      wlid: app.globalData.wlid, // 更新 data 中的 wlId
    }, () => {
      this.getWordListWordData(); // 获取词汇数据
    });
  },
  

  //继续听音
  jxTY(){
    this.setData({
      isXiangQing:false,
      isDianJi:false,//设置为没有点击事件
    },() => {//继续播放
      this.audioContext.play();
    })
  },


  // 初始化音频上下文
  initAudioContext() {
    const audioContext = wx.createInnerAudioContext({
      useWebAudioImplement: true, // 使用 WebAudio 提高性能
    });
    this.audioContext = audioContext;

    // 监听播放结束事件
    audioContext.onEnded(() => {
      this.handleAudioEnded();
    });

    // 监听播放错误事件
    audioContext.onError((err) => {
      console.error('音频播放失败', err);
      this.setData({
        isPlaying: false,
      });
    });
  },


  // 处理音频播放结束
  handleAudioEnded() {
    const { interval, repeat, playCount, currentIndex, wordCount,isDianJi } = this.data;
    const intervalMs = interval * 1000; // 时间间隔（毫秒）
    const maxPlayCount = repeat + 1; // 最大播放次数
    const nextIndex = currentIndex + 1; // 下一个词汇索引
    if(isDianJi){//有点击事件 重置播放次数
      this.setData({
        isPlaying: false,
        playCount: 0, // 重置播放次数
      });
    }else{//没有点击事件
      if (playCount < maxPlayCount) {
        // 继续播放当前词汇
        console.log(`第 ${playCount} 次播放结束，开始第 ${playCount + 1} 次播放`);
        this.setData({
          playCount: playCount + 1,
        });
        this.audioContext.play();
      } else {
        // 当前词汇播放完成，准备播放下一个词汇
        console.log('音频播放结束，已达到最大播放次数');
        this.setData({
          isPlaying: false,
          playCount: 0, // 重置播放次数
        });
        if (nextIndex < wordCount) {// 还有剩余词汇
          if (intervalMs > 0) {// 有时间间隔
            setTimeout(() => {
              this.playNextWord(nextIndex);
            }, intervalMs);
          } else {// 没有时间间隔
            this.playNextWord(nextIndex);
          }
        } else {// 没有词汇了 - 循环播放
          console.log('所有词汇播放完成');
          this.setData({
            currentIndex:0//循环
          },()=>{
            this.audioContext.play();
          })
        }
      }
    }
  },

  // 播放下一个词汇
  playNextWord(nextIndex) {
    this.setData({
      currentIndex: nextIndex,
    }, () => {
      this.getWordListData(); // 获取下一个词汇的收藏夹信息
      this.getClazz(); // 获取下一个词汇的词性
      this.playAudio(); // 播放音频
    });
  },



  // 播放音频
  playAudio() {
    const { currentIndex, wordData } = this.data;
    if (this.data.isPlaying) {
      console.log('音频正在播放');
      return;
    }
    this.audioContext.src = wordData[currentIndex].word.sound
    this.audioContext.play();
    this.setData({
      isPlaying: true,
      playCount: 1, // 初始化播放次数
    });
  },
  



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },



  // 显示时间间隔选择器
  showIntervalPicker() {
    this.setData({
      showIntervalPicker: true,
      showRepeatPicker: false,
      isDianJi:true,//设置为有点击事件
    });
  },

  // 显示重复次数选择器
  showRepeatPicker() {
    this.setData({
      showRepeatPicker: true,
      showIntervalPicker: false,
      isDianJi:true,//设置为有点击事件
    });
  },

  // 处理时间间隔选择
  handleIntervalChange(e) {
    const selectedIndex = e.detail.value;
    const interval = this.data.intervalOptions[selectedIndex];
    this.setData({
      interval: parseInt(interval),
      showIntervalPicker: false,
      isDianJi:false,//设置没有有点击事件
    },() => {
      this.audioContext.play();
    });
  },

  // 处理重复次数选择
  handleRepeatChange(e) {
    const selectedIndex = e.detail.value;
    const repeat = this.data.repeatOptions[selectedIndex];
    this.setData({
      repeat: parseInt(repeat),
      showRepeatPicker: false,
      isDianJi:false,//设置没有有点击事件
    },() => {
      this.audioContext.play();
    });
  },


  //确认收藏
  async isSouChang(){
    let currentIndex = this.data.currentIndex
    if(this.data.isXC){
        currentIndex = this.data.testCount
    }
    let R = await request('/wlw',{wid:this.data.wordData[currentIndex].word.id,wll:this.data.wordList},'POST');
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



  //显示详情
  setIsrXiangQing(){
    let isXiangQing = !this.data.isXiangQing
    this.setData({
      isXiangQing,
      isDianJi:true,//设置没有有点击事件
    })
  },


  //获取词汇集词汇学习
  async getWordListWordData(){
    let _this = this;
    let R = await request('/wordlist/'+this.data.wlid+'/'+app.globalData.openid+'?isYX=true');
    let wordData = R.data
    let wordCount = R.data.length//词汇数量
    console.log("wordData:"+wordData)
    this.setData({//赋值
      wordData,
      isChuSiHua:true,
      wordCount
    }, () => {//赋值完成后获取词性和收藏夹信息
      console.log("执行了吗")
      _this.getClazz();//获取词性
      _this.getWordListData();//获取收藏夹信息
      _this.playAudio()
    });
  },

  //获取词性
  async getClazz(){//获取词性
    let currentIndex = this.data.currentIndex; // 从 data 中获取
    let R = await request('/clazz/'+this.data.wordData[currentIndex].word.clazz);
    let clazz = R.data.name
    console.log("clazzData:"+clazz)
    this.setData({//赋值
      clazz
    })
  },

  //获取收藏夹信息
  async getWordListData(){//获取收藏夹信息
    let currentIndex = this.data.currentIndex; // 从 data 中获取
    let R = await request('/wlw/'+this.data.wordData[currentIndex].word.id+'/'+app.globalData.openid);
    let wordList = R.data
    console.log("wordListData:"+wordList)
    this.setData({//赋值
      wordList
    })
  },


  //播放音频
  getMP3(event){
    this.audioContext.src = event.currentTarget.dataset.src
    this.audioContext.play() // 播放
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
    const audioContext = this.audioContext;
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
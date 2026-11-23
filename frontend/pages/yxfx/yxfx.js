// pages/yxfx/yxfx.js
import request from '../../utils/request'
const  app =  getApp();//引用全局变量，获取雇主的openid
Page({

  /**
   * 页面的初始数据
   */
  data: {

    wlid: "",//词汇集ID
    wordData:{},//词汇数据
    currentIndex: 0, // 当前显示的数据索引
    isXiangQing:false,//是否显示词汇详情页面
    isChuSiHua:false,//数据是否加载完成
    wordCount: 0,//词汇数
    wordTestData:[],//词汇测试数据


 

    
    //页面详情页数据
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
    _this.setData({
      wlid: app.globalData.wlid, // 更新 data 中的 wlId
    }, () => {
      // setData 回调函数，确保数据更新后执行
      _this.getWordListWordData()
    });

    //创建音频上下文
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





  //测试选对设为已学
  async isStudy(testCount){
    let R = await request('/study',this.data.wordData[testCount].id,'PUT');
    console.log("是否成功："+R.data)
    if(R.data){
      console.log("已学完词汇："+this.data.wordData[testCount].word.word)
    }
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
      isXiangQing
    })
  },




  //下一个词汇
  nextWord(){
    let _this = this;
    let currentIndex = this.data.currentIndex + 1 //已显示词汇数
    let isXiangQing = !this.data.isXiangQing//关闭显示详情
    let wordCount = this.data.wordCount//词汇总数
    console.log("索引数："+currentIndex+"  词汇总数："+wordCount)
    if(currentIndex==wordCount){//如果学习到最后一个，则设置开启测试和测试完结束
      console.log("复习完成了！")
      wx.showToast({//提示本次复习完成
        title: '本次复习完成',
        icon: 'success',
        duration: 1000 // 提示框显示 1 秒
      })
      //1秒后执行跳回测试页面
      setTimeout(function() {
        wx.switchTab({//跳回测试页面
          url: '/pages/wtest/wtest'
        })
      }, 1000);
    }else{//不是最后一个词
      this.setData({
        currentIndex,//到下一个词汇
        isXiangQing //关闭显示详情
      }, () => {
        _this.yinPin();//播放音频
        _this.getWordListData();//获取下一个词汇的收藏夹信息
        _this.getClazz();//获取下一个词汇的词性
      })
    }
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
      _this.yinPin();
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



  yinPin(){
    let audioContext = this.data.audioContext
    let currentIndex = this.data.currentIndex
    let _this = this;
    console.log("变化执行了吗")
    if((!this.data.isXiangQing)&&this.data.isChuSiHua){
      console.log("赋值完成了变化执行了吗")
      audioContext.src = _this.data.wordData[currentIndex].word.sound
      audioContext.play() // 播放
    }
  },









  //播放音频
  getMP3(event){
    let audioContext = this.data.audioContext
    audioContext.src = event.currentTarget.dataset.src
    audioContext.play() // 播放
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
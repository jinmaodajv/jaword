// pages/learning/learning.js
import request from '../../utils/request'
const  app =  getApp();//引用全局变量，获取雇主的openid
Page({

  /**
   * 页面的初始数据
   */
  data: {

    testClazz: "",//测试类型ID
    wlid: "",//词汇集ID
    wordData:{},//词汇数据
    currentIndex: 0, // 当前显示的数据索引
    isXiangQing:false,//是否显示词汇详情页面
    isChuSiHua:false,//数据是否加载完成
    isShi:true,//监听词汇长度是否还剩10及以上
    shi: 0,//计数器是否到时
    wordCount: 0,//词汇数
    testCount: 0,//测试开始数 完成一次测试是设置 testCount = currentIndex
    isJieShu:false,//是否测试完结束
    isTest:false,//是否开始测试
    wordTestData:[],//词汇测试数据
    isTingYin:false,//是否为听音测试
    isYXZ:false,//是否已选择
    isXC:false,//是否选错
    testXX:[//测试内容信息
      {//答案
        id:"",
        xx:"题目",
        buttonType:"default",//按钮颜色
      },
      {//选项A
        id:"",
        xx:"A",
        buttonType:"default",//按钮颜色
      },
      {//选项B
        id:"",
        xx:"B",
        buttonType:"default",//按钮颜色
      },
      {//选项C
        id:"",
        xx:"C",
        buttonType:"default",//按钮颜色
      },
      {//选项D
        id:"",
        xx:"D",
        buttonType:"default",//按钮颜色
      },
    ],

        
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
    let cd = "http://localhost:8080/jaword/sound/word/6.mp3"
    console.log("音频长度："+cd.length)
    let _this = this;
    const eventChannel = this.getOpenerEventChannel();
    this.eventChannel = eventChannel;

    eventChannel.on('toStudy', function (res) {
      console.log("res的数据：" + res); // 打印 res 的数据
      console.log("res的数据：" + res.wlid); // 打印 res 的数据
      _this.setData({
        wlid: res.wlid, // 更新 data 中的 wlId
      }, () => {
        // setData 回调函数，确保数据更新后执行
        _this.getWordListWordData()
      });
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


  //测试结果响应
  async testDC(testCount,guo){
    let uid = wx.getStorageSync('user').id
    let R = await request('/test',{id:null,testclazz:this.data.testClazz,studyword:this.data.wordData[testCount].id,user:uid,guo:guo,right:null,error:null},'PUT');
    console.log("是否成功："+R.data)
    if(R.data){
      console.log("测试结果响应成功，词汇："+this.data.wordData[testCount].word.word)
    }
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


  //继续测试
  jxTest(){//将是选错改成false
    this.setData({
      isXC:false,
      isYXZ:false,//设置为还没有选择
      [`testXX[1].buttonType`]: "default",
      [`testXX[2].buttonType`]: "default",
      [`testXX[3].buttonType`]: "default",
      [`testXX[4].buttonType`]: "default",
    })
  },


  //判断选项对错
  xzDC(event){
    console.log("触发了事件！")
    let _this = this;
    let testCount = this.data.testCount//测试开始数
    const selectedId = event.currentTarget.dataset.id; // 获取点击按钮的 id
    const correctId = this.data.testXX[0].id; // 正确答案的 id
    let i = event.currentTarget.dataset.i; // 获取点击按钮为第几个选项
    if(!_this.data.isYXZ){//没有选择选择
      if (selectedId === correctId) {//选对进入下一个词汇测试
        // 如果相等，设置为 primary（绿色）
        this.setData({
          [`testXX[${i}].buttonType`]: "primary",
          isYXZ:true//设置为已经选择了
        }, () => {//获取测试数据下一个并在0.5秒后执行
          let timerId = setTimeout(function() {
            _this.setData({//测试加一并且是听音改成false
              testCount: testCount + 1,//选对测试加一
              isTingYin:false,//是听音改成false
            }, () => {
              let guo = true
              _this.isStudy(testCount);//设置为已学
              _this.testDC(testCount,guo)//测试结果响应
              _this.getTestData();//获取下一个测试数据
            })
          }, 500);
          //
        });
      } else {//选错进入词汇详情页
        // 如果不相等，设置为 warn（红色）
        this.setData({
          [`testXX[${i}].buttonType`]: "warn",
          isYXZ:true//设置为已经选择了
        }, () => {//获取测试数据下一个并在0.5秒后执行
          let timerId = setTimeout(function() {
            _this.setData({
              isXC:true//是选错 选错进入词汇详情页
            }, () => {
              let guo = false
              _this.testDC(testCount,guo)//测试结果响应
            })
          }, 500);
        });
      }
    }//选择了就不能再选了
  },


  //显示详情
  setIsrXiangQing(){
    let isXiangQing = !this.data.isXiangQing
    this.setData({
      isXiangQing
    })
  },


  // 在 1 到 n 范围内随机选择一个数
  getRandomNumber(n) {
    return Math.floor(Math.random() * n) + 1;
  },

  // Fisher-Yates 洗牌算法
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  },


  //选择测试类型 日语选汉字  汉字选假名 汉字选日语 听音选释义
  xuanZeClazz(wordTestData){
    const randomNumber = this.getRandomNumber(4); // 1 到 4 的随机数
    const testXX = this.data.testXX
    testXX[0].id = wordTestData[3].id//设置正确选项ID
    const originalArray = [0, 1, 2, 3];
    const shuffledArray = this.shuffleArray(originalArray);
    console.log("随机数组："+shuffledArray)
    console.log("数："+randomNumber)
    if(randomNumber==1){//日语选汉字
      testXX[0].xx = wordTestData[3].word//题目
      for(let i=0,j=1;i<4;i++,j++){
        console.log("1选项ID："+wordTestData[shuffledArray[i]].id)
        console.log("索引：", shuffledArray[i]);
        console.log("数据：", wordTestData[shuffledArray[i]]);
        testXX[j].id = wordTestData[shuffledArray[i]].id
        testXX[j].xx = wordTestData[shuffledArray[i]].translate
      }
      this.setData({
        testXX,//赋值
        testClazz:1
      })
    }
    if(randomNumber==2){//汉字选假名
      testXX[0].xx = wordTestData[3].translate//题目
      for(let i=0,j=1;i<4;i++,j++){
        console.log("2选项ID："+wordTestData[shuffledArray[i]].id)
        console.log("索引：", shuffledArray[i]);
        console.log("数据：", wordTestData[shuffledArray[i]]);
        //console.log("2word选项ID："+wordTestData[shuffledArray[i]].word.id)
        testXX[j].id = wordTestData[shuffledArray[i]].id
        testXX[j].xx = wordTestData[shuffledArray[i]].kana
      }
      this.setData({
        testXX,//赋值
        testClazz:3
      })
    }if(randomNumber==3){//汉字选日语
      testXX[0].xx = wordTestData[3].translate//题目
      for(let i=0,j=1;i<4;i++,j++){
        //console.log("3选项ID："+wordTestData[shuffledArray[i]].id)
        console.log("索引：", shuffledArray[i]);
        console.log("数据：", wordTestData[shuffledArray[i]]);
        //console.log("3word选项ID："+wordTestData[shuffledArray[i]].word.id)
        testXX[j].id = wordTestData[shuffledArray[i]].id
        testXX[j].xx = wordTestData[shuffledArray[i]].word
      }
      this.setData({
        testXX,//赋值
        testClazz:2
      })
    }if(randomNumber==4){//听音选释义
      testXX[0].xx = wordTestData[3].sound//题目
      for(let i=0,j=1;i<4;i++,j++){
        console.log("4选项ID："+wordTestData[shuffledArray[i]].id)
        console.log("索引：", shuffledArray[i]);
        console.log("数据：", wordTestData[shuffledArray[i]]);
        //console.log("4word选项ID："+wordTestData[shuffledArray[i]].word.id)
        testXX[j].id = wordTestData[shuffledArray[i]].id
        testXX[j].xx = wordTestData[shuffledArray[i]].translate
      }
      this.setData({
        isTingYin:true,//设置为听音
        testXX,//赋值
        testClazz:7
      })
      //播放音频
      let audioContext = this.data.audioContext
      audioContext.src = wordTestData[3].sound
      audioContext.play() // 播放
    }
  },
  //获取测试数据
  async getTestData(){
    let _this = this;
    let testCount = this.data.testCount//测试开始数
    let currentIndex = this.data.currentIndex +1//已显示词汇数
    let wordTestData = this.data.wordTestData 
    if(testCount<currentIndex){//没有测试完
      console.log("测试词汇ID："+this.data.wordData[testCount].word.id)
      let R = await request('/test/'+this.data.wordData[testCount].word.id+'/'+this.data.wlid);
      wordTestData = R.data 
      this.setData({
        [`testXX[1].buttonType`]: "default",
        [`testXX[2].buttonType`]: "default",
        [`testXX[3].buttonType`]: "default",
        [`testXX[4].buttonType`]: "default",
        wordTestData,//赋值测试数据
        isTest:true,//开始测试
        isYXZ:false,//设置为还没有选择
        //isXC:false//将是选错改成false
      }, () => {
        _this.xuanZeClazz(wordTestData);//选择测试类型并随机生成选项 （假名选日语）日语选汉字  汉字选假名 汉字选日语 （日语选假名） 听音选释义 （听音选日语） 
      })
    }else{//测试完成退出测试
      if(_this.data.isJieShu){//是结束
        wx.showToast({//提示学习完成
          title: '学习完成',
          icon: 'success',
          duration: 1000 // 提示框显示 1 秒
        })
        //0.5秒后执行跳回主页
        setTimeout(function() {
          wx.switchTab({//跳回主页
            url: '/pages/home/home'
          })
        }, 1000);
        
      }else{//不是结束//获取洗一个词汇信息
        this.setData({
          isTest:false,//推出测试
          currentIndex,//到下一个词汇
          isXiangQing:false //关闭显示详情
        }, () => {
          _this.yinPin();//播放音频
          _this.getWordListData();//获取下一个词汇的收藏夹信息
          _this.getClazz();//获取下一个词汇的词性
        })
      }
    }  
  },

  //下一个词汇
  nextWord(){
    let _this = this;
    let currentIndex = this.data.currentIndex + 1 //已显示词汇数
    let shi = this.data.shi + 1 //连续显示词汇数
    let isXiangQing = !this.data.isXiangQing//关闭显示详情
    //let testCount = this.data.testCount//测试开始数
    let wordCount = this.data.wordCount//词汇总数
    console.log("索引数："+currentIndex+"  词汇总数："+wordCount)
    if(currentIndex==wordCount){//如果学习到最后一个，则设置开启测试和测试完结束
      console.log("学习完成了！")
      this.setData({
        isJieShu:true,//测试完结束
      })
      _this.getTestData()//获取测试信息
    }else{//不是最后一个词
      if(shi==10){//到达连续显示最大值
        this.setData({
          shi:0//重置计数
        })
        _this.getTestData()//获取测试信息
      }else{//没有达到最大显示数且不是最后一个
        this.setData({
          shi,//记录连续显示数量
          currentIndex,//到下一个词汇
          isXiangQing //关闭显示详情
        }, () => {
          _this.yinPin();//播放音频
          _this.getWordListData();//获取下一个词汇的收藏夹信息
          _this.getClazz();//获取下一个词汇的词性
        })
      }
    }

  },

  //获取词汇集词汇学习
  async getWordListWordData(){
    let _this = this;
    let R = await request('/wordlist/'+this.data.wlid+'/'+app.globalData.openid);
    let wordData = R.data
    let wordCount = R.data.length//词汇数量
    let yu = wordCount/10
    if(yu==0){
      console.log("wordData:"+wordData)
      this.setData({//赋值
        wordData,
        isChuSiHua:true,
        wordCount,
        isShi:false
      }, () => {//赋值完成后获取词性和收藏夹信息
        console.log("执行了吗")
        _this.getClazz();//获取词性
        _this.getWordListData();//获取收藏夹信息
        _this.yinPin();
      });
    }else{
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
    }
    
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
  
    //innerAudioContext.pause() // 暂停
  
    //innerAudioContext.stop() // 停止
  
    //innerAudioContext.destroy() // 释放音频资源
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
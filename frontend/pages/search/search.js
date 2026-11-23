import request from '../../utils/request'
const  app =  getApp();//引用全局变量，获取雇主的openid
let isSend = false; // 函数节流使用
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchContent: '', // 用户输入的表单项数据
    searchList: [], // 关键字模糊匹配的数据
    historyList: [], // 搜索历史记录
    zr:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取初始化数据
    // this.getInitData();
    
    // 获取历史记录
    this.getSearchHistory();
  },
  
  zr(){
    let zr = !this.data.zr
    this.setData({
      zr
    })
  },


  //点击历史记录
  record(e){
    let record = e.currentTarget.dataset.record;
    //设置输入框内容
    this.setData({
      searchContent: record
    })
    //获取集合
    this.getSearchList();
  },

  // 添加历史记录
  add(){
    let {searchContent, historyList} = this.data;
    if(historyList.indexOf(searchContent) !== -1){
      historyList.splice(historyList.indexOf(searchContent), 1)
    }
    historyList.unshift(searchContent);
    this.setData({
      historyList
    })
    
    wx.setStorageSync('searchHistory', historyList)
  },

  // 输入框回车跳转
  carriageReturn(){
    let name = this.data.searchContent;
    let that = this
    if(name==null||name==""){

    }else{
      if(!app.globalData.isLogin){
        this.isLogin();
      }
      else{
        that.add();//添加搜索记录
        wx.navigateTo({
          url: '/pages/searchshop/searchshop',
          success:function(res){
            res.eventChannel.emit('toshopsearchpage',{name: name})
          }
        })
      }
    }
  },

  // 取消搜索
  toHome(){
    wx.switchTab({
      url: '/pages/home/home'
    })
  },

  // 点击搜索内容事件
  toWord(e){
    let zr = e.currentTarget.dataset.zr;
    let id = e.currentTarget.dataset.id;
    let word = e.currentTarget.dataset.word;
    let translate = e.currentTarget.dataset.translate;
    let clazz = e.currentTarget.dataset.clazz;
    // let kana = e.currentTarget.dataset.kana;
    // let sound = e.currentTarget.dataset.sound;
    let that = this
    console.log(e)
    console.log(e.currentTarget.dataset.zr)//true 为中 false 为日
    console.log(e.currentTarget.dataset.id)
    if(zr){//为中文
      that.setData({
        searchContent: translate
      })
      that.add();//添加搜索记录
    }else{
      that.setData({
        searchContent: word
      })
      that.add();//添加搜索记录
      // 跳转
    }
    wx.navigateTo({//跳转
      url: '/pages/word/word',
      success:function(res){
        res.eventChannel.emit('toword',{id: e.currentTarget.dataset.id,clazz:clazz})
      }


      // success:function(res){
      //   res.eventChannel.emit('toword',{id: id,word:word,translate:translate,clazz:clazz,sound:sound,kana:kana})
      // }
    })
  },
  
  // 获取本地历史记录的功能函数
  getSearchHistory(){
    let historyList = wx.getStorageSync('searchHistory');
    if(historyList){
      this.setData({
        historyList
      })
    }
  },
  

  // 表单项内容发生改变的回调
   handleInputChange(event){
    // console.log(event);
    // 更新searchContent的状态数据
    this.setData({
      searchContent: event.detail.value.trim()
    })
     if(isSend){
       return
     }
     isSend = true;
     this.getSearchList();
     // 函数节流
    setTimeout( () => {
      isSend = false;
    }, 300)
    
  },

  // 获取搜索数据的功能函数
  async getSearchList(){
    if(!this.data.searchContent){
      this.setData({
        searchList: []
      })
      return;
    }
    // 发请求获取关键字模糊匹配数据
    let searchListData = await request('/search/'+this.data.zr+'/'+this.data.searchContent);
    searchListData = searchListData.data
    this.setData({
      searchList: searchListData
    })
    
  },


  // 清空搜索内容
  clearSearchContent(){
    this.setData({
      searchContent: '',
      searchList: []
    })
  },
  
  // 删除搜索历史记录
  deleteSearchHistory(){
    wx.showModal({
      content: '确认删除吗?',
      success: (res) => {
        if(res.confirm){
          // 清空data中historyList
          this.setData({
            historyList: []
          })
          // 移除本地的历史记录缓存
          wx.removeStorageSync('searchHistory');
        }
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

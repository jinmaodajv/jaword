// pages/lzfx/lzfx.js

import request from '../../utils/request'
const  app =  getApp();//引用全局变量，获取雇主的
Page({

  /**
   * 页面的初始数据
   */
  data: {
    xzf:1,//1-系统自带词汇集(用户1) 2-用户创建词汇集(用户ID) 3-用户分享词汇集(非用户ID)
    wordListData:[],//词汇集列表
    wlid:"",//选择的词汇集ID
    isXZ:false,//是否有已选中词汇集
    isytzd:true,//系统自带
    isndsc:false,//您的收藏
    isyhfx:false,//用户分享
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let _this = this;
    //1秒后执行获取数据
    setTimeout(function() {
      _this.getWordList()
    }, 350);
  },


 




  //选中 有用
  xuanZhong(event){
    const {isXZ,wordListData} = this.data
    let wlid = event.currentTarget.dataset.id //词汇集ID
    let state = event.currentTarget.dataset.state//是否分享
    for(let i=0;i<wordListData.length;i++){
      if(wordListData[i].id==wlid){
        wordListData[i].isxz = true //选中
      }else{
        wordListData[i].isxz = false //没有选中
      }
    }
    this.setData({
      wordListData,
      wlid//更新选中词汇集ID
    },()=>{
      this.onChangeBook(wlid,state)
    })
  },


  //删除词汇集 有用
  async deleteWordList(wlid){
    let R = await request('/wordlist/'+wlid+'/'+app.globalData.openid,{},'DELETE');
    if(R.data){//删除成功
      wx.showToast({
        title: '删除成功',//XX成功
        icon: 'success',
        duration: 2000
      })
      this.getWordList()//更新
    }
  },




  //获取词汇集数据 有用
  async getWordList(){
    let R = await request('/uwl/'+3+'/'+app.globalData.openid);
    let wordList = R.data
    const wordListData = wordList.map(item => {
      //每一个对象添加新属性
      item.isxz = false; //添加选择属性
      return item;
    })
    this.setData({
      wordListData
    })
  },


  //通过分享码添加 有用
  async addWLByCode(code){
    let user = wx.getStorageSync("user");
    let R = await request('/uwl/code',{user:user.id,code:code,name:'1111'},'POST');
    if(R.data){//添加成功
      wx.showToast({
        title: '添加成功',//XX成功
        icon: 'success',
        duration: 2000
      })
      this.getWordList()//更新
    }
  },

  //分享码添加 有用
  addByFXM(){
    let _this = this
    wx.showModal({
      title: "分享码添加",//标题
      editable: true,
      placeholderText: "请输入分享码",//请输入提示

      success (res) {
        if (res.confirm) {
          let code = res.content
          if(res.content==null||res.content==""){
            wx.showToast({
              title: '分享码为空',//XX为空
              icon: 'error',
              duration: 2000
            })
          }else{//内容不为空
            _this.addWLByCode(code)
          }
        } else if (res.cancel) {//XX失败
          wx.showToast({
            title: '添加失败',
            icon: 'error',
            duration: 2000
          })
        }
      }
    })
  },



  //单词书事件 删除 有用
  onChangeBook: function (wlid) {
    let _this = this
    console.log('更换单词书');
    // 这里可以弹出单词书选择列表
    wx.showActionSheet({
      itemList: ['删除'],
      success: (res) => {
        const selectedBook = ['删除'][res.tapIndex];
        console.log("是什么单词书："+res.tapIndex)
        console.log('选择的单词书:', selectedBook);
        if(res.tapIndex == 0){//删除
          _this.deleteWordList(wlid)//删除
        }   
      },
    });
  },



  //单词书事件 添加来自分享 有用
  addFX: function (wlid,state) {
    let _this = this
    console.log('更换单词书');
    // 这里可以弹出单词书选择列表
    wx.showActionSheet({
      itemList: ['分享码','分享社区'],
      success: (res) => {
        const selectedBook = ['分享码','分享社区'][res.tapIndex];
        console.log("是什么单词书："+res.tapIndex)
        console.log('选择的单词书:', selectedBook);
        if(res.tapIndex == 0){//分享码添加
            _this.addByFXM();//分享码添加
        }if(res.tapIndex == 1){//分享社区
          wx.navigateTo({
            url: '/pages/fxsq/fxsq',
          })
        }   
      },
    });
  },








  //查看词汇集中的词汇 
  cxWord(event){
    if(event.currentTarget.dataset.wordcount == 0){
      wx.showToast({
        title: '请先添加词汇',
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
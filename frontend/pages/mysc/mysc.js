// pages/mysc/mysc.js

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
    let code = event.currentTarget.dataset.code//分享码
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
      this.onChangeBook(wlid,state,code)
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





  //修改词汇集状态和名称 有用
  async renameAndState(wlid,name,isfx){
    let user = wx.getStorageSync("user");
    if(isfx){//是分享
      let R = await request('/wordlist',{id:wlid,user:user.id,code:'1111',name:'1111',state:true},'PUT');
      if(R.data){//设置成功
        wx.showToast({
          title: '设置成功',//XX成功
          icon: 'success',
          duration: 2000
        })
        this.getWordList()//更新
      }else{
        wx.showToast({
          title: '设置失败',
          icon: 'error',
          duration: 2000
        })
      }
    }else{//是重命名
      let R = await request('/wordlist',{id:wlid,user:user.id,code:'1111',name:name,state:false},'PUT');
      if(R.data){//修改成功
        wx.showToast({
          title: '修改成功',//XX成功
          icon: 'success',
          duration: 2000
        })
        this.getWordList()//更新
      }
    }

    
  },



  //新建词汇集 有用
  async addWordList(name){
    let user = wx.getStorageSync("user");
    let R = await request('/wordlist',{user:user.id,code:'1111',name:name},'POST');
    if(R.data){//添加成功
      wx.showToast({
        title: '添加成功',//XX成功
        icon: 'success',
        duration: 2000
      })
      this.getWordList()//更新
    }
  },


  //输入交互 有用
  shuRuJiaoHu(wlid,isxj,t1,t2,t3){
    let _this = this
    wx.showModal({
      title: t1,//标题
      // content: '请输入反馈内容',
      editable: true,
      placeholderText: t2,//请输入反馈内容 提示

      success (res) {
        if (res.confirm) {
          let name = res.content
          if(res.content==null||res.content==""){
            wx.showToast({
              title: t3+'为空',//XX为空
              icon: 'error',
              duration: 2000
            })
          }else{//内容不为空
            if(isxj){//如果是新建
              _this.addWordList(name)
            }else{//是重命名
              let isfx = false//不是分享
              _this.renameAndState(wlid,name,isfx)
            }
          }
        } else if (res.cancel) {//XX失败
          wx.showToast({
            title: t3+'失败',
            icon: 'error',
            duration: 2000
          })
        }
      }
    })
  },

  // 复制分享码到剪切板
  copyCode(code) {
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


  //单词书事件 修改 新建 删除  有用
  fxBook: function (wlid,code) {
    let _this = this
    console.log('更换单词书');
    // 这里可以弹出单词书选择列表
    wx.showActionSheet({
      itemList: ['复制分享码','取消分享'],
      success: (res) => {
        if(res.tapIndex == 0){//复制分享码
          _this.copyCode(code);//复制分享码
        }
        if(res.tapIndex == 1){//取消分享
          wx.showModal({
            title: '取消分享',//标题
            success (res) {
              if (res.confirm) {//用户点击了确认
                let isfx = true
                let name = '1111'
                _this.renameAndState(wlid,name,isfx)//取消分享
              } 
            }
          })
        }
      }
    })
  },






  //单词书事件 修改 新建 删除  有用
  onChangeBook: function (wlid,state,code) {
    let _this = this
    console.log('更换单词书');
    // 这里可以弹出单词书选择列表
    wx.showActionSheet({
      itemList: ['新建','分享', '重命名', '删除'],
      success: (res) => {
        const selectedBook = ['新建','分享', '重命名', '删除'][res.tapIndex];
        console.log("是什么单词书："+res.tapIndex)
        let xzf = res.tapIndex + 1
        console.log('选择的单词书:', selectedBook);
        if(res.tapIndex == 0){//新建
          let isxj = true
          let t1 = '新建单词书'
          let t2 = '请输入有效名称'
          let t3 = '新建'
          _this.shuRuJiaoHu(wlid,isxj,t1,t2,t3)
        }if(res.tapIndex == 1){//分享
          if(state){//取消分享或复制分享码
            _this.fxBook(wlid,code);//取消分享或复制分享码
          }else{//开启分享
            wx.showModal({
              title: '开启分享',//标题
              success (res) {
                if (res.confirm) {//用户点击了确认
                  let isfx = true
                  let name = '1111'
                  _this.renameAndState(wlid,name,isfx)//开启分享
                } 
              }
            })
          }
        }if(res.tapIndex == 2){//重命名
          let isxj = false
          let t1 = '重命名单词书'
          let t2 = '请输入有效名称'
          let t3 = '修改'
          _this.shuRuJiaoHu(wlid,isxj,t1,t2,t3)
        }if(res.tapIndex == 3){//删除
          if(this.data.wordListData.length == 1){
            wx.showToast({
              title: '无法全部删除',
              icon: 'error',
              duration: 2000
            })
          }else{
            _this.deleteWordList(wlid)//删除
          }  
        }
      },
    });
  },










  //更新正在学习的词汇集
  async updateUsed(){
    let wlid = this.data.wlid
    let uid = wx.getStorageSync("user").id;
    console.log("wlid:"+wlid +"uid:" +uid)
    if(wlid == null){//没有选择
      wx.showToast({//提示请选择
        title: '请先选择',
        icon: 'error',
        duration: 1000 // 提示框显示 1 秒
      })
    }else{
      let R = await request('/used',{id:null,userwordlist:wlid,user:uid},'PUT');
      if(R){//更新成功
        wx.showToast({//提示更换成功
          title: '更换成功',
          icon: 'success',
          duration: 1000 // 提示框显示 1 秒
        })
        //1秒后执行跳回主页面
        setTimeout(function() {
          wx.switchTab({//跳回主页面
            url: '/pages/home/home'
          })
        }, 1000);
      }else{
        wx.showToast({//提示更换失败
          title: '更换失败',
          icon: 'error',
          duration: 1000 // 提示框显示 1 秒
        })
      }
    }
  },




  //查看词汇集中的词汇 有用
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








  //获取词汇集数据
  async getWordList(){
    let R = await request('/uwl/'+2+'/'+app.globalData.openid);
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
import {nowtime} from '../../utils/utils';
Page({
  data:{
    openid: '',
    name: '',
    imageUrl: '/static/default.png',
    nowDate: '',
    index: '',
    totalNum: '',
    list: []
  },
  //用户登录
  getUserName(e) {
    //调用微信接口，获取当前用户信息
    wx.getUserProfile({
      desc: '正在登陆',
    })
    .then(res => {
      this.setData({
        name: res.userInfo.nickName,
        imageUrl: res.userInfo.avatarUrl,
        index: '0',
        nowDate: nowtime('yyyy-MM-dd')
      })
      wx.cloud.callFunction({//拿到用户的唯一标识openid作为判断依据
        name: 'getData'
      }).then(res => {
        this.setData({
          openid: res.result.openid
        })
        this.detect()//检测是否重复登录
        var app = getApp() //将用户的头像和昵称 赋值给 全局变量 供其他页面 使用
        app.globalData.userName = this.data.name
        app.globalData.userImageUrl = this.data.imageUrl
      })
    }).catch(err => {
      wx.showToast({
        icon: 'none',
        title: '登陆失败',
      })
    })
  },
  //检测用户是否重复登录
  get() {
    let len = this.data.list.length
    if(len < this.data.totalNum) {
      wx.cloud.database().collection('users')
      .skip(len)
      .get()
      .then(res => {
        this.setData({
          list: this.data.list.concat(res.data)
        })
        this.get()
      })
    } 
    else {//数据库全部遍历结束
      console.log(this.data.list)
      for (var item of this.data.list) {
        if (item._openid == this.data.openid) {//查看数据库是否有这个用户
          if (item.time == this.data.nowDate) {//查看进入时间是否是今天
            //同时满足这两个条件的话，就不让用户使用首页功能了
            var app = getApp()
            app.globalData.userLoginIndex = '1'
            wx.showToast({
              icon: 'none',
              duration: 2500,
              title: '每天只能获取一个，你今天已经使用过小程序了哦'
            })
            return
          } 
          else { //不是今天进入的，则可以使用首页功能
            var app = getApp()
            app.globalData.userLoginIndex = '0'
            wx.showToast({
              icon: 'none',
              duration: 2500,
              title: '每天来一次，爱情来找你，冲冲冲'
            })
            this.update(item._id) //前往修改登录时间
          }
          return
        }
      }
      var app = getApp()
      app.globalData.userLoginIndex = '0'
      wx.showToast({
        icon: 'none',
        duration: 2500,
        title: '新人呀，追求幸福冲冲冲呀'
      })
      this.add() //此用户不存在，新用户，直接入库
      return
    }
  },
  detect() { 
    wx.cloud.database().collection('users').count()
    .then(res => {
      this.setData({
        totalNum: res.total
      })
      this.get()
    })
  },
  update(id) {
    wx.cloud.database().collection('users')
    .doc(id)
    .update({
      data: {
        time: this.data.nowDate
      }
    })
  },
  add() {
    wx.cloud.database().collection('users')
    .add({
      data: {
        name: this.data.name,
        time: this.data.nowDate
      }
    })
  },

  //跳转"用前须知"的页面
  tip() { 
    wx.navigateTo({
      url: './tip/tip'
    })
  },

  //跳转"关于我们"的页面
  aboutour() { 
    wx.navigateTo({
      url: '../aboutour/aboutour'
    })
  },
  //每次进入这个页面就执行的函数
  onShow() {
    if (getApp().globalData.userName == '') { //如果用户没有登陆,就直接执行下面的语句
      this.setData({
        index: '1'
      })
    } else {
      this.setData({
        index: '0'
      })
    }
  }
})
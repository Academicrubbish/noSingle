import {nowtime} from '../../utils/utils';
Page({
  data: {
    nowText: '',
    textList: []
  },
  inputtext(e) { //将用户输入的信息存放在nowText中
    this.setData({
      nowText: e.detail.value
    })
  },
  go() {
    if(getApp().globalData.userName === '') { //检测是否登录
      wx.showToast({
        icon: 'none',
        title: '登陆一下咯'
      })
    } else if (this.data.nowText === '') { //检测输入是否为空
      wx.showToast({
        icon: 'none',
        title: '不能输入为空'
      })
    }else {
      this.add();
    }
  },
  //将用户输入的信息,连上他的头像,昵称,时间 一并传入数据库以供留言展示
  add() { 
    wx.cloud.database().collection('text')
    .add({
      data: {
        userName: getApp().globalData.userName,
        userImageUrl: getApp().globalData.userImageUrl,
        userTime: nowtime('yyyy-MM-dd hh:mm:ss'),
        text: this.data.nowText
      }
    }).then(res => {
      this.setData({
        nowText: ''
      })
      wx.showToast({
        title: '留言成功'
      })
    }).catch(err => {
      wx.showToast({
        title: '留言失败'
      })
    })
  },
  //如果用户登录了,就展示留言界面
  onShow() {
    if (getApp().globalData.userName != '') { 
      wx.cloud.database().collection('text')
      .get()
      .then(res => {
        this.setData({
          textList: res.data
        })
      }).catch(err => {
        wx.showToast({
          title: '加载失败',
        })
      })
    }
  },
  //下拉分页加载
  onReachBottom() {
    wx.showLoading({
      title: '加载中'
    })
    let len = this.data.textList.length
    wx.cloud.database().collection('text')
    .skip(len)
    .get()
    .then(res => {
      this.setData({
        textList: this.data.textList.concat(res.data),
        nowText: ''
      })
      wx.hideLoading()
    }).catch(err => {
      wx.hideLoading()
      wx.showToast({
        title: '加载失败',
      })
    })
  }
})
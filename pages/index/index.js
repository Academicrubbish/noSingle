Page({
  data: {
    index: '',
    gender: '',
    wec: '',
    outWec: '',
    noList: [],
    list: [],
    totalNum: '',
    totalNoNum: ''
  },
  //用户输入社交帐号
  inputwec(e) {
    this.setData({//获取用户输入信息wec
      wec: e.detail.value
    })
  },
  //用户选择自己性别
  btnclick(e) {
    wx.showToast({
      icon: 'none',
      title: '选择自己的性别噢'
    })
    this.setData({
      gender: e.target.id
    })
    if(this.data.gender === '男') {
      this.setData({
        index: '0'
      })
    }else {
      this.setData({
        index: '1'
      })
    }
  },
  gayclick() {
    wx.showToast({
      icon: 'none',
      title: '你信了？拜托，别闹'
    })
  },
  //点击事件
  postwec(){
    if(getApp().globalData.userName === '') {
      wx.showToast({
        icon: 'none',
        title: '登陆一下咯'
      })
    } else if(this.data.wec.length<=2){//数据校验，如果字符长度小于2
      wx.showToast({
        title: '输入无效',
      })
    } else if(getApp().globalData.userLoginIndex === '1') {
      wx.showToast({
        icon: 'none',
        duration: 2500,
        title: '专情一点，先去聊着，你今天已经使用过了噢'
      })
    } else {//在这做性别判断，把表也输入进去
      if (this.data.gender === '男') {
        this.get(this.data.wec, 'man')
        this.reveal('wom')
      } else {
        this.get(this.data.wec, 'wom')
        this.reveal('man')
      }
      var app = getApp()
      app.globalData.userLoginIndex = '1'
    }
  },
  //1.查看库里有没有用户输入的社交账号
  get(wec, gender) {
    wx.cloud.database().collection(gender).count()
    .then(res => {
      this.setData({
        totalNum: res.total
      })
      this.getDataList(wec, gender)
    })
  },
  //2.用于给数据库添加用户社交帐号
  add(wec,gender) {
    wx.cloud.database().collection(gender)
    .add({
      data: {
        wec: wec
      }
    })
  },
  //3.从另一个性别的数据库里随机拿出一个社交帐号展示
  reveal(gender) {
    wx.cloud.database().collection(gender).count()
    .then(res => {
      this.setData({
        totalNoNum: res.total
      })
      this.getNoList(gender)
    })
  },

  getNoList(gender) {
    let len = this.data.noList.length
    if(len < this.data.totalNoNum) {
      wx.cloud.database().collection(gender)
      .skip(len)
      .get()
      .then(res => {
        this.setData({
          noList: this.data.noList.concat(res.data)
        })
        this.getNoList(gender)
      })
    } else {//数据库全部遍历结束
      var rand
      rand = Math.ceil(Math.random()*this.data.noList.length) - 1 //拿到数据库长度范围内的随机数
      this.setData({
        outWec: '快冲，你的另一半：' + this.data.noList[rand].wec
      })
      return
    }
  },

  getDataList(wec, gender) {
    let len = this.data.list.length
    if(len < this.data.totalNum) {
      wx.cloud.database().collection(gender)
      .skip(len)
      .get()
      .then(res => {
        this.setData({
          list: this.data.list.concat(res.data)
        })
        this.getDataList(wec, gender)
      })
    } else {//数据库全部遍历结束
      for (var item of this.data.list) {//遍历数据库
        if (item.wec === wec) {//判断该社交帐号是否存在，如果存在就不往数据库添加
          return
        }
      }
      this.add(wec, gender)
      return
    }
  }
})
App({
  globalData: {//用于存放用户的头像和昵称
    userName: '', //用户昵称
    userImageUrl: '', //用户头像
    userLoginIndex: '' //用户登入次数
  },
  onLaunch() {
    // console.log('小程序开始启动啦')
    wx.cloud.init({
      env: 'no-single-9g7jpzjo517f5f97'
    })
  }
})
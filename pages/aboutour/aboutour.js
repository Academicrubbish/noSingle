Page({
  data: {
    version: ''
  },
  process() {
    wx.navigateTo({
      url: './process/process'
    })
  },
  developer() {
    wx.navigateTo({
      url: './developer/developer'
    })
  },
  feedback() {
    wx.navigateTo({
      url: './feedback/feedback'
    })
  },
  onShow() {
    const accountInfo = wx.getAccountInfoSync();
    this.setData({
      version: accountInfo.miniProgram.version
    })
  }
})
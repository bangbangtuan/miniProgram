// pages/msg/msg_success.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalHidden: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var body = JSON.parse(options.body);
    body.image = decodeURIComponent(body.image);
    console.log(body);
    this.setData({
      body: body
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    if (res.from === 'button') {
      
    }
    this.setData({
      modalHidden: false
    })
    return {
      title: this.data.body.title,
      path: this.data.body.path,
      imageUrl: this.data.body.image,
    }
  },

  modalConfirm: function () {
    // do something
    this.setData({
      modalHidden: true
    })
  }
})
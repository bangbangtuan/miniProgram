Page({

  /**
   * 页面的初始数据
   */
  data: {
    cpDetail: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: 'https://api.bangneedu.com/messagePush',
      method: 'GET',
      header: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + wx.getStorageSync('token')
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          messages: res.data.data.reverse()
        })
        if (res.data.status == 401) {
          wx.showToast({
            title: '登陆过期',
            duration: 1000
          });
          wx.navigateTo({
            url: '/pages/login/login',
          })
        }
      },
      fail: function (err) {
        console.log(err);
      }
    });
    wx.request({
      url: 'https://api.bangneedu.com/cpDetails',
      method: 'GET',
      header: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + wx.getStorageSync('token')
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          cpDetail: res.data.data
        })
        if (res.data.status == 401) {
          wx.showToast({
            title: '登陆过期，请重新登陆',
            icon: 'none',
            duration: 1000
          });
          setTimeout(function () {
            wx.navigateTo({
              url: '/pages/login/login',
            })
          }, 1000)

        }
      },
      fail: function (err) {
        console.log(err);
      }
    });
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
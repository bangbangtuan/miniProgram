Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    var token = wx.getStorageSync('token');
    if (token) {
      this.setData({
        logedin: token
      })
      var that = this;
      wx.request({
        url: 'https://api.bangneedu.com/user',
        method: 'GET',
        header: {
          "content-type": "application/json",
          "Authorization": "Bearer " + token
        },
        success: function (res) {
          console.log(res.data.data);
          that.setData({
            userInfo: res.data.data
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
      })
    } else {
      var logedin = false;
      wx.setStorageSync('token', logedin);
      this.setData({
        logedin: logedin
      })
    }

    if (!this.data.logedin) {
      wx.redirectTo({
        url: '/pages/login/login',
      })
    }
  },

  navigate: function () {
    var userInfo = this.data.userInfo;
    userInfo.headPortrait = encodeURIComponent(userInfo.headPortrait);
    wx.navigateTo({
      url: '/pages/userInfo/userInfo?userInfo=' + JSON.stringify(userInfo),
    })
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
// pages/user_daka/user_daka.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    daka: '',
    postList: [],
    pageNum: 1,
    isEmpty: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserDakaList('https://api.bangneedu.com/punchTheClock/user?current=1&size=10');
  },

  getUserDakaList: function(url) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + wx.getStorageSync('token')
      },
      success: function (res) {
        console.log(res.data.data.records);
        var totalPosts = [];
        if (!that.data.isEmpty) {
          totalPosts = that.data.postList.concat(res.data.data.records);
        } else {
          totalPosts = res.data.data.records;
          that.data.isEmpty = false;
        }
        that.setData({
          postList: totalPosts,
          pageNum: that.data.pageNum + 1
        })
        wx.hideNavigationBarLoading();
      },
      fail: function (err) {
        console.log(err);
      }
    });
  },

  handleTap: function (e) {
    console.log(e.currentTarget.dataset.type);
    var postItem = e.currentTarget.dataset.type;
    postItem.headPortrait = encodeURIComponent(postItem.headPortrait);
    wx.navigateTo({
      url: '/pages/article/article?cat=' + JSON.stringify(postItem),
    })
  },

  bindFormSubmit: function (e) {
    var that = this;
    console.log(e.detail.value.textarea);
    that.setData({
      daka: e.detail.value.textarea
    })
    if (that.data.daka) {
      wx.request({
        url: 'https://api.bangneedu.com/punchTheClock',
        method: 'POST',
        data: {
          "content": e.detail.value.textarea
        },
        header: {
          "content-type": "application/json",
          "Authorization": "Bearer " + wx.getStorageSync('token')
        },
        success: function (res) {
          console.log(res);
          if (res.data.status == 200) {
            wx.showToast({
              title: '打卡成功',
              icon: 'success',
              duration: 1000
            })
            that.setData({
              daka: ''
            })
            that.onLoad();
          } else if (res.data.status == 500) {
            wx.showModal({
              title: '发生错误啦',
              content: res.data.msg ? res.data.msg : '不知名错误，请联系阳叔',
              success(res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
        },
        fail: function (err) {
          console.log(err);
        }
      })
    }
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
    var nextUrl = 'https://api.bangneedu.com/punchTheClock/user?current=' + this.data.pageNum + "&size=10";
    wx.showNavigationBarLoading();
    this.getUserDakaList(nextUrl);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
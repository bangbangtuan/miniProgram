// pages/userInfo/userInfo.js
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
    console.log(options.userInfo);
    var userInfo = JSON.parse(options.userInfo);
    userInfo.headPortrait = decodeURIComponent(userInfo.headPortrait);
    console.log(userInfo);
    this.setData({
      userInfo: userInfo
    })
  },

  uploadImg: function () {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log(res.tempFilePaths);
        const tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: 'https://api.bangneedu.com/upload',
          header: {
            "content-type": "application/json",
            "Authorization": "Bearer " + wx.getStorageSync('token')
          },
          filePath: tempFilePaths[0],
          name: 'file',
          success(res) {
            var img = JSON.parse(res.data).data;
            console.log(img);
            wx.request({
              url: 'https://api.bangneedu.com/user',
              method: 'PUT',
              header: {
                "content-type": "application/json",
                "Authorization": "Bearer " + wx.getStorageSync('token')
              },
              data: {
                "headPortrait": img
              },
              success: function (res) {
                console.log(res.data);
                that.refreshUserInfo();
              },
              fail: function (err) {
                console.log(err);
              }
            })
          }
        })
      }
    })
  },

  refreshUserInfo: function() {
    var that = this;
    wx.request({
      url: 'https://api.bangneedu.com/user',
      method: 'GET',
      header: {
        "content-type": "application/json",
        "Authorization": "Bearer " + wx.getStorageSync('token')
      },
      success: function (res) {
        console.log(res.data.data);
        that.setData({
          userInfo: res.data.data
        })
      },
      fail: function (err) {
        console.log(err);
      }
    })
  },

  bindFormSubmit: function (e) {
    var that = this;
    var form = e.detail.value;
    console.log(e.detail.value);
    console.log()
    wx.request({
      url: 'https://api.bangneedu.com/user',
      method: 'PUT',
      header: {
        "content-type": "application/json",
        "Authorization": "Bearer " + wx.getStorageSync('token')
      },
      data: {
        "id": that.data.userInfo.id,
        "name": form.name,
        "sex": form.sex,
        "phone": form.phone,
        "weixin": form.weixin,
        "description": form.description
      },
      success: function (res) {
        console.log(res.data);
        that.refreshUserInfo();
        wx.showToast({
          title: '修改成功',
          duration: 1000
        });
      },
      fail: function (err) {
        console.log(err);
      }
    })
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
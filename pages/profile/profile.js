import {
  ProfileModel
} from '../../models/profile.js'

let profileModel = new ProfileModel ()

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
    console.log('个人主页初次渲染')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var token = wx.getStorageSync('token');
    console.log('token: ', token)
    if (token) {
      this.setData({
        logedin: token
      })
      var that = this;
      let getUserInfoCallback = function (res) {
        if (res.status === 401) {
          wx.showToast({
            title: '登陆过期，请重新登陆',
            icon: 'none',
            duration: 1500
          });
        } else if (res.status === 200) {
          that.setData({
            userInfo: res.data
          })
        } else {
          wx.showToast({
            title: '服务器异常',
            icon: 'none',
            duration: 1500
          })
        }
      }
      let header = {
        "content-type": "application/json",
        "Authorization": "Bearer " + token
      }
      profileModel.getUserInfo(header, getUserInfoCallback)
    } else {
      // 表示未登录
      var logedin = false;
      wx.setStorageSync('token', logedin);
      this.setData({
        logedin: logedin,
        userInfo: false
      })
    }
  },
  toMessage: function () {
    //url="/pages/message/message"
    let token = wx.getStorageSync('token');
    if (token) {
      wx.navigateTo({
        url: '/pages/message/message'
      })
    } else {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 1500
      })
    }
  },
  toUserDaka: function () {
    //url="/pages/user_daka/user_daka"
    let token = wx.getStorageSync('token');
    if (token) {
      wx.navigateTo({
        url: '/pages/user_daka/user_daka'
      })
    } else {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 1500
      })
    }
  },
  toUserInfo: function () {
    var userInfo = this.data.userInfo;
    userInfo.headPortrait = encodeURIComponent(userInfo.headPortrait);
    wx.navigateTo({
      url: '/pages/userInfo/userInfo?userInfo=' + JSON.stringify(userInfo),
    })
  },
  toLogin: function () {
    wx.navigateTo({
      url: '/pages/login/login',
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

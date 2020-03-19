// pages/userInfo/userInfo.js
import {
  UserInfoModel
} from '../../models/userinfo.js'

import {config} from '../../config.js'

let userInfoModel = new UserInfoModel ()

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
          url: `${config.api_blink_url}upload`,
          header: {
            "content-type": "application/json",
            "Authorization": "Bearer " + wx.getStorageSync('token')
          },
          filePath: tempFilePaths[0],
          name: 'file',
          success(res) {
            var img = JSON.parse(res.data).data;
            let data = {
              "id": that.data.userInfo.id,
              "headPortrait": img
            }

            userInfoModel.uploadHeaderProtrait(data)
            .then((res) => {
              wx.showToast({
                title: '上传头像成功',
                icon: 'none',
                duration: 1500
              })
              that.refreshUserInfo();
            })
          }
        })
      }
    })
  },

  refreshUserInfo: function() {
    var that = this;
    userInfoModel.getUserInfo()
    .then((res) => {
      console.log('refresh: ',  res)
      that.setData({
        userInfo: res.data
      })
    })
  },

  logout: function () {
    let that = this
    wx.removeStorage({
      key: 'token',
      success: function(res) {
        wx.showToast({
          title: '退出成功',
          icon: 'success',
          duration: 1500
        })
        wx.navigateTo({
          url: '/pages/login/login'
        })
      }
    })
  },

  bindFormSubmit: function (e) {
    var that = this;
    var form = e.detail.value;
    let data = {
      id: that.data.userInfo.id,
      name: form.name,
      sex: form.sex,
      phone: form.phone,
      weixin: form.weixin,
      description: form.description
    }

    userInfoModel.changeUserInfo(data)
    .then((res) => {
      that.refreshUserInfo();
      wx.showToast({
        title: '修改成功',
        icon: 'sucess',
        duration: 1500
      });
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

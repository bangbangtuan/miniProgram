import {
  MessageModel
} from '../../models/message.js'

let messageModel = new MessageModel()

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
    messageModel.getMessage()
    .then((res) => {
      if (res.status === 200) {
        that.setData({
          messages: res.data.reverse()
        })
      } else if (res.status === 401) {
        wx.showToast({
          title: '登陆过期',
          icon: 'none',
          duration: 1500
        });
        wx.navigateTo({
          url: '/pages/login/login',
        })
      } else {
          wx.showToast({
            title: '出现点小意外',
            icon: 'none',
            duration: 1500
          });
        }
      }
    )

    messageModel.getCpDetail ()
    .then ((res) => {
      if (res.status == 401) {
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

      } else {
        that.setData({
          cpDetail: res
        })
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

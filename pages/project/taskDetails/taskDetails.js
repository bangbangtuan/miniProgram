// pages/project/taskDetails/taskDetails.js
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
    console.log(options.id)
    this.setData({
      id: options.id
    })
    this.getTaskDetails();
  },

  getTaskDetails: function() {
    var that = this;
    wx.request({
      url: 'https://api.bangneedu.com/projectTask/task?id=' + this.data.id,
      method: 'GET',
      header: {
        "content-type": "application/json"
      },
      success: function (res) {
        console.log(res.data.data);
        that.setData({
          task: res.data.data,
        })
      },
      fail: function (err) {
        console.log(err);
      }
    })
  },

  receiveTask: function() {
    var body = {
      "projectTaskId": this.data.task.id
    };
    if (wx.getStorageSync('token')) {
      wx.request({
        url: 'https://api.bangneedu.com/projectTaskUser',
        method: 'POST',
        header: {
          "content-type": "application/json",
          "Authorization": "Bearer " + storage.get('token')
        },
        success: function (res) {
          console.log(res.data.data);
          if (res.data.status === 200 && res.data.data === true) {
            wx.showToast({
              title: '任务领取成功，请到个人中心查看',
              icon: 'success',
              duration: 1000
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 1000
            })
          }
        },
        fail: function (err) {
          console.log(err);
        }
      })
    } else {
      wx.showToast({
        title: '请登陆后提交',
        icon: 'none',
        duration: 1000
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
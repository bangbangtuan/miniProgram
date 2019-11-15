// pages/project/joinTeam/joinTeam.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radioCheckVal: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id)
    this.setData({
      id: options.id
    })
    var that = this;
    var token = wx.getStorageSync('token');
    if (token) {
      this.setData({
        logedin: token
      })
      var that = this;
      wx.request({
        url: 'https://api.bangneedu.com/classify',
        method: 'GET',
        header: {
          "content-type": "application/json",
          "Authorization": "Bearer " + wx.getStorageSync('token')
        },
        success: function (res) {
          console.log(res.data);
          if (res.data.status == 401) {
            wx.showToast({
              title: '登陆过期，请重新登陆',
              icon: 'none',
              duration: 1000
            });
          }
          console.log(res.data.data[0].childList);
          that.setData({
            frontend: res.data.data[0].childList[1].childList,
            backend: res.data.data[0].childList[0].childList
          })
        },
        fail: function (err) {
          console.log(err);
        }
      })
    } else {
      wx.showToast({
        title: '登陆过期，请重新登陆',
        icon: 'none',
        duration: 1000
      });
      var logedin = false;
      wx.setStorageSync('token', logedin);
      this.setData({
        logedin: logedin
      })
    }
  },

  radioChange: function (e) {
    console.log('radio携带value值为：', e.detail.value);
    this.setData({
      radioCheckVal: e.detail.value
    });
  },

  bindFormSubmit: function() {
    console.log(this.data.radioCheckVal)
    var token = wx.getStorageSync('token');
    if (!token) {
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
    if (this.data.radioCheckVal) {
      wx.request({
        url: 'https://api.bangneedu.com/projectTeam',
        data: {
          "projectId": this.data.id,
          "technology": this.data.radioCheckVal
        },
        method: 'POST',
        header: {
          "content-type": "application/json",
          "Authorization": "Bearer " + token
        },
        success: function (res) {
          console.log(res);
          if (res.data.msg == "请不要重复组队") {
            wx.showToast({
              title: res.data.msg,
              icon: "none"
            })
          } else {
            var body = {
              path: "/pages/project/project",
              content: "邀请好友一起组队做项目，分享完成既可加入项目微信群",
              title: "我正在组队练手，邀请你一起做项目",
              image: "/images/Picture3.png",
              alert: "既可加入项目微信群"
            }
            body.image = encodeURIComponent(body.image);
            wx.navigateTo({
              url: "/pages/msg/msg_success?body=" + JSON.stringify(body),
            })
          }
        },
        fail: function (err) {
          console.log(err);
        }
      })
    } else {
      wx.showToast({
        title: '请选择技术栈',
        icon: 'none',
        duration: 1000
      });
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
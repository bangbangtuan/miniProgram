// pages/team/team.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedFlag: [false, false, false, false],
    notes: [
      {
        id: "1",
        note: "CP组队是概率事件，总能碰到自己合适的。"
      },
      {
        id: "2",
        note: "组队之后请移步学习日记进行监督分享学习。"
      },
      {
        id: "3",
        note: "未匹配成功之前请勿重复提交匹配信息。"
      }
    ],
    stack: [],
    radioCheckVal: ''
  },

  // 展开折叠选择  
  changeToggle: function(e) {
    var index = e.currentTarget.dataset.index;
    if (this.data.selectedFlag[index]) {
      this.data.selectedFlag[index] = false;
    } else {
      this.data.selectedFlag[index] = true;
    }

    this.setData({
      selectedFlag: this.data.selectedFlag
    })
  },

  bindFormSubmit: function(e) {
    console.log(this.data.radioCheckVal);
    var tech = this.data.radioCheckVal;
    wx.request({
      url: 'https://api.bangneedu.com/cpMatching/technology',
      data: {
        "technology": tech
      },
      method: 'PUT',
      header: {
        "content-type": "application/json",
        "Authorization": "Bearer " + wx.getStorageSync('token')
      },
      success: function(res) {
        console.log("更新技术栈: " + res);
        wx.request({
          url: 'https://api.bangneedu.com/cpMatching',
          data: {
            "technology": tech
          },
          method: 'POST',
          header: {
            "content-type": "application/json",
            "Authorization": "Bearer " + wx.getStorageSync('token')
          },
          success: function(res) {
            console.log(res);
            if (res.statusCode == 200) {
              wx.showToast({
                title: '提交成功',
                icon: 'success',
                duration: 1000
              })
            } else if (res.statusCode == 500) {
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
          fail: function(err) {
            console.log(err);
          }
        })
      },
      fail: function(err) {
        console.log(err);
      }
    })

  },

  radioChange: function(e) {
    console.log('radio携带value值为：', e.detail.value);
    this.setData({
      radioCheckVal: e.detail.value
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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
            setTimeout(function () {
              wx.navigateTo({
                url: '/pages/login/login',
              })
            }, 1000)

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
  onShareAppMessage: function() {

  }
})
// pages/resetPassword/resetPassword.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    count: 60
  },

  savePhoneNumber: function (e) {
    console.log(e.detail.value)
    this.setData({
      phoneNumber: e.detail.value
    });
  },

  getValidCode: function () {
    if (this.data.phoneNumber && this.data.count == 60) {
      this.tick();
      wx.request({
        url: 'https://api.bangneedu.com/captcha/' + this.data.phoneNumber,
        method: 'GET',
        header: {
          "Content-Type": "application/text"
        },
        success: function (res) {
          console.log(res.data);
        },
        fail: function (err) {
          console.log(err);
        }
      })
    } else if (!this.data.phoneNumber) {
      wx.showToast({
        title: '请填写电话号码',
        icon: 'loading',
        duration: 1000
      })
    }
  },

  tick: function () {
    var vm = this
    if (vm.data.count > 0) {
      vm.setData({
        count: vm.data.count - 1
      });
      setTimeout(function () {
        return vm.tick()
      }, 1000)
    } else {
      vm.setData({
        count: 60
      });
    }
  },

  bindFormSubmit: function (e) {
    var form = e.detail.value;
    if (form.password && form.password2 && form.captcha) {
      if (form.password !== form.password2) {
        wx.showToast({
          title: '两次密码不一致',
          icon: 'loading',
          duration: 1000
        })
      } else {
        console.log(e.detail.value);
        wx.request({
          url: 'https://api.bangneedu.com/password',
          data: {
            "captcha": e.detail.value.captcha,
            "password": e.detail.value.password,
            "phone": e.detail.value.phone
          },
          method: 'PUT',
          header: {
            "content-type": "application/json"
          },
          success: function (res) {
            console.log(res);
            if (res.data.status == 200) {
              wx.navigateTo({
                url: '/pages/login/login',
              })
            } else if (res.data.status == 500) {
              wx.showModal({
                title: '修改失败',
                content: res.data.msg,
                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    wx.navigateTo({
                      url: '/pages/resetPassword/resetPassword',
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })

            }

          },
          fail: function (err) {
            console.log(err);
            wx.showToast({
              title: '修改失败',
              duration: 1000
            });
          }
        })
      }
    } else {
      wx.showToast({
        title: '请填写必填项',
        icon: 'loading',
        duration: 1000
      })
    }
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
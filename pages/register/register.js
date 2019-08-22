// pages/register/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    count: 60
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
          // this.setData({
          //   captcha: res.data.result.data["BizId"]
          // })
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

  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },

  bindFormSubmit: function (e) {
    var form = e.detail.value;
    if (form.username && form.password && form.password2 && form.weixin && form.phone ) {
      if(form.password !== form.password2) {
        wx.showToast({
          title: '两次密码不一致',
          icon: 'loading',
          duration: 1000
        })
      } else {
        console.log(e.detail.value);
        wx.request({
          url: 'https://api.bangneedu.com/register',
          data: {
            "username": e.detail.value.username,
            "password": e.detail.value.password,
            "phone": e.detail.value.phone,
            "weixin": e.detail.value.weixin,
            "captcha": e.detail.value.captcha,
          },
          method: 'POST',
          header: {
            "content-type": "application/json"
          },
          success: function (res) {
            console.log(res);
            if(res.data.status == 200) {
              wx.navigateTo({
                url: '/pages/login/login',
              })
            } else if (res.data.status == 500) {
              wx.showModal({
                title: '注册失败',
                content: res.data.msg,
                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    wx.navigateTo({
                      url: '/pages/register/register',
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
              title: '注册失败',
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
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    password: '',
    user_code: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.createCode();
  },

  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      var that = this;
      console.log("用户的信息如下：");
      console.log(e.detail.userInfo);
      that.setData({
        isHide: false
      });
      wx.request({
        url: 'https://api.bangneedu.com/register',
        data: {
          "username": e.detail.userInfo.nickName
        },
        method: 'POST',
        header: {
          "content-type": "application/json"
        },
        success: function (res) {
          console.log(res);
          wx.switchTab({
            url: '/pages/profile/profile',
          })
        },
        fail: function (err) {
          console.log(err);
        }
      })
    } else {
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
    }
  },

  changeAnother() {
    this.createCode()
  },

  createCode() {
    var code;
    code = '';
    var codeLength = 4;
    var random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
    for (var i = 0; i < codeLength; i++) {
      var index = Math.floor(Math.random() * 36);
      code += random[index];
    }
    this.setData({
      code: code
    })
  },

  bindFormSubmit: function (e) {
    var that = this;
    console.log(e.detail.value);
    console.log(this.data.code);
    if (e.detail.value.username && e.detail.value.password && e.detail.value.code && e.detail.value.type) {
      if (e.detail.value.code.toUpperCase() == this.data.code) {
        wx.request({
          url: 'https://api.bangneedu.com/login',
          data: {
            "username": e.detail.value.username,
            "password": e.detail.value.password,
            "type": e.detail.value.type
          },
          method: 'POST',
          header: {
            "content-type": "application/json"
          },
          success: function (res) {
            console.log(res.data);
            that.setData({
              token: res.data.data
            })
            if (res.data.status === 200 && that.data.token ) {
              wx.showToast({
                title: '登陆成功',
                icon: 'success',
                duration: 1000,
                success: function () {
                  if (that.data.token) {
                    wx.setStorageSync('token', that.data.token);
                    wx.switchTab({
                      url: '/pages/profile/profile',
                    })
                  }
                }
              })
            } else {
              that.setData({
                user_code: ''
              })
              that.changeAnother();
              wx.showToast({
                title: "登录失败，请输入正确的账号密码，或选择正确的登录方式",
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
          title: '验证码错误',
          icon: 'none',
          duration: 2000
        });
        that.setData({
          user_code: ''
        })
        that.changeAnother();
      }
    } else {
      wx.showToast({
        title: '请填写必填项并选择登陆方式',
        icon: 'none',
        duration: 2000
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
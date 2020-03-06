// pages/register/register.js

import {
  RegisterModel
} from '../../models/register.js'

let registerModel = new RegisterModel ()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    count: 60,
    sexual: '1'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  changeSexual: function (e) {
    this.setData({
      sexual: e.target.dataset.sexual
    })
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
      let getCaptchaCallback = function (res) {
        if (res.status === 200) {
          wx.showToast({
            title: '验证码已发送',
            icon: 'success',
            duration: 1500
          })
        } else {
          wx.showToast({
            title: '验证码发送失败',
            icon: 'none',
            duration: 1500
          })
        }
      }

      registerModel.getCaptcha(
        this.data.phoneNumber,
        getCaptchaCallback
      )

    } else if (!this.data.phoneNumber) {
      wx.showToast({
        title: '请填写电话号码',
        icon: 'none',
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
    if (form.username && form.password && form.password2 && form.weixin && form.phone && form.captcha ) {
      if(form.password !== form.password2) {
        wx.showToast({
          title: '两次密码不一致',
          icon: 'loading',
          duration: 1500
        })
      } else {
        let registerCallback = function (res) {
          if(res.status == 200) {
            wx.showToast({
              title: '注册成功',
              icon: 'success',
              duration: 1500
            })
            wx.navigateTo({
              url: '/pages/login/login',
            })
          } else if (res.status == 500) {
            wx.showToast({
              title: res.data.msg,
              duration: 1500
            })
          }
        }
        registerModel.register(
          e.detail.value.username,
          e.detail.value.password,
          e.detail.value.phone,
          e.detail.value.weixin,
          e.detail.value.captcha,
          registerCallback
        )
      }
    } else {
      wx.showToast({
        title: '请填写必填项',
        icon: 'none',
        duration: 1500
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

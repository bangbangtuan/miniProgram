import {
  HTTP
} from '../utils/http.js'

class RegisterModel extends HTTP {
  constructor() {
    super()
  }

  getCaptcha(phoneNumber, success) {
    var params = {
      url: `captcha/${phoneNumber}`,
      success: success
    }
    this.request(params)
  }

  register(username, password, phone, weixin, captcha, success) {
    // data 是表示传递的数据
    // success 是表示成功的回调函数
    let params = {
      url: 'register',
      success: success,
      method: 'POST',
      data: {
        username: username,
        password: password,
        phone: phone,
        weixin: weixin,
        captcha: captcha
      },
      error: (err) => {
        wx.showToast({
          title: '注册失败',
          icon: 'none',
          duration: 1500
        })
      }
    }
    this.request(params)
  }
}

export {
  RegisterModel
}
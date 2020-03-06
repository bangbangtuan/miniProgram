import {
  HTTP
} from '../utils/http.js'

class LoginModel extends HTTP {
  constructor() {
    super()
  }

  login(username, password, type, success) {
    // data 是表示传递的数据
    // success 是表示成功的回调函数
    let params = {
      url: 'login',
      success: success,
      method: 'POST',
      data: {
        username: username,
        password: password,
        type: type
      },
      error: (err) => {
        wx.showToast({
          title: '登录失败',
        })
      }
    }
    this.request(params)
  }
}

export {
  LoginModel
}

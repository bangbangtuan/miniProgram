import {
  HTTP
} from '../utils/http.js'

import {
  HTTP_P
} from '../utils/http-p.js'


class LoginModel extends HTTP_P {
  constructor() {
    super()
  }


  login(data) {
    // data 是表示传递的数据
    // success 是表示成功的回调函数

    return this.request({
      url: 'member/login',
      data: data,
      method: 'POST'
    })
  }
}

export {
  LoginModel
}

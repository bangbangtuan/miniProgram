import {
  HTTP
} from '../utils/http.js'

import {
  HTTP_P
} from '../utils/http-p.js'


class UserInfoModel extends HTTP_P {
  constructor() {
    super()
  }

  uploadHeaderProtrait (data) {
    return this.request({
      url: 'user',
      data: data,
      method: 'PUT'
    })
  }

  getUserInfo () {
    return this.request({
      url: 'user'
    })
  }


  changeUserInfo (data) {

    return this.request({
      url: 'user',
      data: data,
      method: 'PUT'
    })
  }


}

export {
  UserInfoModel
}

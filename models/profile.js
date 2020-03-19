import {
  HTTP
} from '../utils/http.js'

class ProfileModel extends HTTP {
  constructor() {
    super()
  }

  getUserInfo(header, success) {
    console.log('header: ', header)
    var params = {
      url: 'user',
      header: {
        ...header
      },
      success: success,
      error: (err) => {
        wx.showToast({
          title: '服务器异常',
          icon: 'none',
          duration: 1500
        })
      }
    }
    this.request(params)
  }

  // getUserInfo(username, password, type, success) {
  //   // data 是表示传递的数据
  //   // success 是表示成功的回调函数
  //   let params = {
  //     url: 'login',
  //     success: success,
  //     method: 'POST',
  //     data: {
  //       username: username,
  //       password: password,
  //       type: type
  //     },
  //     error: (err) => {
  //       wx.showToast({
  //         title: '登录失败',
  //       })
  //     }
  //   }
  //   this.request(params)
  // }
}

export {
  ProfileModel
}

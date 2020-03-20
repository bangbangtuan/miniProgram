import { config } from '../config.js'

const tips = {
  1: '出现一个错误',
  1007: "appkey无效",
  401: "登陆过期，请重新登陆"
}

class HTTP_P {
  constructor() {
    this.baseRestUrl = config.api_blink_url
  }
  request({url, data={}, method="GET"}) {
    // 不需要传递 suceess 函数
    return new Promise((resolve, reject) => {
      // 异步回调函数
      this._request(url, resolve, reject ,data, method)
    })
  }
  //http 请求类, 当noRefech为true时，不做未授权重试机制
  _request(url, resolve, reject ,data, method) {
    var that = this
    var url = this.baseRestUrl + url;

    //console.log('Authorization: ', params.header.Authorization)\
    console.log('token: ', wx.getStorageSync('token'))
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync('token')? `Bearer ${wx.getStorageSync('token')}`: ''
      },
      success: function (res) {
        // 判断以2（2xx)开头的状态码为正确
        // 异常不要返回到回调中，就在request中处理，记录日志并showToast一个统一的错误即可
        console.log('res.statusCode: ', res.statusCode)
        const code = res.statusCode.toString();
        var startChar = code.charAt(0);
        if (startChar == '2') {
          resolve(res.data)
        } else {
          reject()
          let error_code = res.data.status
          console.log('error_code: ', error_code)
          that._show_error(error_code)
        }
      },
      fail: function (err) {
        reject()
        // params.fail && params.fail(err)

        that._show_error(1)
      }
    });
  }

  _show_error(error_code) {
    if (!error_code) {
      error_code = 1
    }
    console.log('kkk')
    wx.showToast({
      title: tips[error_code]? tips[error_code]:tips[1],
      icon: 'none',
      duration: 1500
    })
  }
};

export { HTTP_P };

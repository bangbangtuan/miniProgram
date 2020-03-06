import { config } from '../config.js'


class HTTP {
  constructor() {
    this.baseRestUrl = config.api_blink_url
  }

  //http 请求类, 当noRefech为true时，不做未授权重试机制
  request(params) {
    var that = this
    var url = this.baseRestUrl + params.url;

    if (!params.method) {
      params.method = 'GET';
    }

    //console.log('Authorization: ', params.header.Authorization)
    wx.request({
      url: url,
      data: params.data,
      method: params.method,
      header: {
        'content-type': 'application/json',
        'Authorization': params.header && params.header.Authorization? params.header.Authorization:''
      },
      success: function (res) {
        // 判断以2（2xx)开头的状态码为正确
        // 异常不要返回到回调中，就在request中处理，记录日志并showToast一个统一的错误即可
        console.log('res.statusCode: ', res.statusCode)
        var code = res.statusCode.toString();
        var startChar = code.charAt(0);
        if (startChar == '2') {
          params.success && params.success(res.data);
        } else {
          params.error && params.error(res);
        }
      },
      fail: function (err) {
        params.fail && params.fail(err)
      }
    });
  }
};

export { HTTP };

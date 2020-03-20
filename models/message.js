import {
  HTTP_P
} from '../utils/http-p.js'


class MessageModel extends HTTP_P {
  constructor() {
    super()
  }
  getMessage() {
    return this.request({
      url: 'messagePush'
    })
  }
  getCpDetail () {
    return this.request({
      url: 'cpDetails'
    })
  }
}

export {
  MessageModel
}

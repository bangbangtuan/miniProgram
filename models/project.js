import {
  HTTP
} from '../utils/http.js'

import {
  HTTP_P
} from '../utils/http-p.js'


class ProjectItem extends HTTP_P {
  constructor() {
    super()
  }


  login(data) {
    // data 是表示传递的数据
    // success 是表示成功的回调函数

    return this.request({
      url: 'login',
      data: data,
      method: 'POST'
    })
  }

  getProjectItem () {
    return this.request({
      url: 'project'
    })
  }

  getProjectTeam (id) {
    return this.request({
      url: `projectTeam/${id}`
    })
  }
}

export {
  ProjectItem
}

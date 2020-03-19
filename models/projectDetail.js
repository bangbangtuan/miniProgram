import {
  HTTP
} from '../utils/http.js'

import {
  HTTP_P
} from '../utils/http-p.js'


class ProjectDetail extends HTTP_P {
  constructor() {
    super()
  }


  getProject (id) {
    return this.request ({
      url: `project/${id}`
    })
  }

  getProjectTask (id) {
    return this.request({
      url: `projectTask/${id}`
    })
  }
}

export {
  ProjectDetail
}

import {
  HTTP_P
} from '../utils/http-p.js'

class TeamModel extends HTTP_P {
  constructor() {
    super()
  }

  getClassify() {

    return this.request({
      url: 'classify'
    })

  }

  getLearnPathTeam () {
    return this.request({
      url: 'learningPathTeam'
    })
  }

  selectTechnology (data) {
    return this.request({
      url: 'cpMatching/technology',
      data: data,
      method: 'PUT'
    })
  }

  cpMatching (data) {
    return this.request({
      url: 'cpMatching',
      data: data,
      method: 'POST'
    })
  }

  joinTeam (data) {
    return this.request({
      url: 'learningPathTeam/people',
      data: data,
      method: 'POST'
    })
  }
}

export {
  TeamModel
}

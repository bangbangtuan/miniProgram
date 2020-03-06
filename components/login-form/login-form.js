Component({
  /**
   * 组件的属性列表
   */

  properties: {
    code: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    username: String,
    password: '',
    type: ''
  },

  onLoad: function() {
    console.log('code： ', this.properties.code)
 },

  /**
   * 组件的方法列表
   */
  methods: {

    changeAnother: function (event) {
      this.triggerEvent('changeCode', {}, {})
    },
    bindFormSubmit: function (event) {
      console.log('event: ', event.detail.value.username)
      this.triggerEvent('submitForm', {
        username: event.detail.value.username,
        type: event.detail.value.type,
        password: event.detail.value.password,
        code: event.detail.value.code
      }, {})
    }
  }
})

Component({
  /**
   * 组件的属性列表
   */

  properties: {
    userInfo: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    sexual: '1'
  },

  attached: function() {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    //handleSubmit
    bindFormSubmit: function (event) {
      let that = this
      event.detail.value.sex = that.data.sexual
      console.log('event.detail: ', event.detail)
      this.triggerEvent('handleSubmit', event.detail, {})
    },
    handleSelect: function (e) {
      console.log('e.target.dataset.sexual',  e.target.dataset.sexual)
      this.setData({
        sexual: e.target.dataset.sexual
      })
    }
  }
})

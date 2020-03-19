Component({
  /**
   * 组件的属性列表
   */

  properties: {
    headPortrait: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    defaultHeadPortrait: "/images/icon/upload.png"
  },

  attached: function() {

 },

  /**
   * 组件的方法列表
   */
  methods: {
    uploadImg: function (e) {
      this.triggerEvent('uploadImg', {}, {})
    }
  }
})

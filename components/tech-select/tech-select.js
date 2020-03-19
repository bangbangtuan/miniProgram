
const SELECT = true
const UN_SELECT = false

Component({
  /**
   * 组件的属性列表
   */

  properties: {
    fontend: Object,
    backend: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    fontImg: "./images/study@font.png",
    backImg: "./images/study@backend.png",
    selected: '2', // 1表示已选择 2表示未选择
    fontend: Object,
    backend: Object
  },

  attached () {

   console.log('this.properties.backend: ', this.data)
 },
 ready: function () {
   console.log('this.data.fontend: ', this.data)
 },

  /**
   * 组件的方法列表
   */
  methods: {
    handleSelect: function (e) {
      console.log('this.properties.fontend: ', this.data.fontend)
      console.log('e.target.dataset.item',  e.target.dataset.item)
      // 分别遍历 fontend 和 backend
      // 如果字符相等，则设置为1，否则设置为2
      for (let i = 0; i < this.data.fontend.length; i++) {
        if (this.data.fontend[i].name === e.target.dataset.item) {
          this.data.fontend[i].selected = SELECT
        } else {
            this.data.fontend[i].selected = UN_SELECT
        }
      }

      for (let j = 0; j < this.data.backend.length; j++) {
        if (this.data.backend[j].name === e.target.dataset.item) {
          this.data.backend[j].selected = SELECT
        } else {
          this.data.backend[j].selected = UN_SELECT
        }
      }
      this.setData({
        fontend: this.data.fontend,
        backend:this.data.backend
      })
      this.triggerEvent("selectTechno", {
        selected: e.target.dataset.item
      }, {})
    }
  }
})

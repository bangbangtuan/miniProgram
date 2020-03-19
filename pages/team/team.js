import {
  TeamModel
} from '../../models/team.js'

let teamModel = new TeamModel()

var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedFlag: [false, false, false, false],
    notes: [
      {
        id: "1",
        note: "CP组队是概率事件，总能碰到自己合适的。"
      },
      {
        id: "2",
        note: "组队之后请移步学习日记进行监督分享学习。"
      },
      {
        id: "3",
        note: "未匹配成功之前请勿重复提交匹配信息。"
      }
    ],
    stack: [],
    radioCheckVal: '',
    tabs: ["学习伙伴", "自学团"],
    tag: '0'
  },

  clickIn(e) {
    let teamId=e.currentTarget.dataset.index;
    if (wx.getStorageSync('token')) {
      var body = {
        path: "/pages/team/team",
        content: "邀请好友加入自学团，分享完成即可加入",
        title: "邀请你一起加入神秘的IT自学团队",
        image: "/images/Picture2.png",
        alert: "既可加入自学团"
      }
      body.image = encodeURIComponent(body.image);

      let data = {
        learningPathTeamId: teamId
      }

      teamModel.joinTeam(data)
      .then((res) => {
        if (res.status === 200) {
          wx.showToast({
            title: '加入自学团',
            icon: 'success',
            duration: 1500
          })
          wx.navigateTo({
            url: "/pages/msg/msg_success?body=" + JSON.stringify(body),
          })
        } else if (res.status == 500) {
          wx.showToast({
            title: '请不要重复加入',
            icon: 'none',
            duration: 1500
          })
        } else {
          wx.showToast({
            title: '不知名错误，请联系阳叔',
            icon: 'none',
            duration: 1500
          })
        }
      })
    } else {
      wx.showToast({
        title: '请登录后点击加入',
        icon: 'none',
        duration: 1000
      });
      setTimeout(function () {
        wx.navigateTo({
          url: '/pages/login/login',
        })
      }, 1000)
    }
  },

  selectTechno (e) {
    console.log('eeeeeeee: ', e.detail.selected)
    this.setData({
      radioCheckVal: e.detail.selected
    })
  },
  bindFormSubmit: function(e) {
    console.log(this.data.radioCheckVal);
    // 拿到那一个为true 的技术栈
    // 如果没有那一个技术栈，就提示请选择技术栈
    var tech = this.data.radioCheckVal;
    if (wx.getStorageSync('token')) {
      if(!tech) {
        wx.showToast({
          title: '请选择技术栈',
          icon: 'none',
          duration: 1500
        })
      } else {
        let data = {
          "technology": tech
        }
        teamModel.selectTechnology(data)
        .then((res) => {
          return teamModel.cpMatching(data)
        }).then((res) => {
          const body = {
            path: "/pages/team/team",
            content: "分享给好友既可开始匹配",
            title: "点击免费匹配你的专属学习伙伴",
            image: "/images/Picture1.png",
            alert: "既可获得学习伙伴微信号"
          }

          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 1000
          })

          body.image = encodeURIComponent(body.image);
          wx.navigateTo({
            url: "/pages/msg/msg_success?body=" + JSON.stringify(body),
          })
        })
      }
    } else {
      wx.showToast({
        title: '请登录后提交组队信息',
        icon: 'none',
        duration: 1000
      });
      setTimeout(function () {
        wx.navigateTo({
          url: '/pages/login/login',
        })
      }, 1000)
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var token = wx.getStorageSync('token');

    let p1 = teamModel.getClassify()
    let p2 = teamModel.getLearnPathTeam()

    Promise.all([p1, p2]).then((res) => {

      that.setData({
        study:res[1].data.records,
        frontend: res[0].data[0].childList[1].childList,
        backend: res[0].data[0].childList[0].childList
      })
    }).catch((err) => {
      console.log(err)
    })
    if (token) {
      this.setData({
        logedin: token
      })

    } else {
      var logedin = false;
      wx.setStorageSync('token', logedin);
      this.setData({
        logedin: logedin
      })
    }
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  },

  btn: function (e) {
    var that = this;
    // console.log(e.currentTarget.dataset.index, "点击")
    var tag = e.currentTarget.dataset.index;
    that.setData({
      tag: tag,
    })
  },
  handleSlide: function (e) {
    let that = this;
    console.log(e, "滑动")
    that.setData({
      tag: e.detail.current.toString()
    });
  },

  bindChange: function (e) {
    var that = this;
    console.log('e.detail: ', e.target.dataset.tag)
    that.setData({
      tag: e.target.dataset.tag
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})

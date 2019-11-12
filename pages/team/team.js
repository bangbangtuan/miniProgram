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
    tag: 0,
  },

  // 展开折叠选择  
  changeToggle: function(e) {
    var index = e.currentTarget.dataset.index;
    if (this.data.selectedFlag[index]) {
      this.data.selectedFlag[index] = false;
    } else {
      this.data.selectedFlag[index] = true;
    }

    this.setData({
      selectedFlag: this.data.selectedFlag
    })
  },
  clickIn(e) {
    let teamId=e.currentTarget.dataset.index;
    if (wx.getStorageSync('token')) {
      var body = {
        path: "/pages/team/team",
        content: "邀请好友加入自学团，分享完成即可加入",
        title: "邀请你一起加入神秘的IT自学团队",
        image: "/images/Picture2.png"
      }
      body.image = encodeURIComponent(body.image);
      wx.navigateTo({
        url: "/pages/msg/msg_success?body=" + JSON.stringify(body),
      })
      wx.request({
        url: 'https://api.bangneedu.com/learningPathTeam/people',
        method: 'POST',
        header: {
          "content-type": "application/json",
          "Authorization": "Bearer " + wx.getStorageSync('token')
        },
        data: {
          learningPathTeamId: teamId
        },
        success: function (res) {
          console.log(res);
          if (res.statusCode == 200) {
            wx.showToast({
              title: '加入自学团',
              icon: 'success',
              duration: 1000
            })
          } else if (res.statusCode == 500) {
            wx.showModal({
              title: '发生错误啦',
              content: res.data.msg ? res.data.msg : '不知名错误，请联系阳叔',
              success(res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
        },
        fail: function (err) {
          console.log(err);
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
  bindFormSubmit: function(e) {
    console.log(this.data.radioCheckVal);
    var tech = this.data.radioCheckVal;
    if (wx.getStorageSync('token')) {
      var body = {
        path: "/pages/team/team",
        content: "分享给好友既可开始匹配",
        title: "点击免费匹配你的专属学习伙伴",
        image: "/images/Picture1.png"
      }
      body.image = encodeURIComponent(body.image);
      wx.navigateTo({
        url: "/pages/msg/msg_success?body=" + JSON.stringify(body),
      })
      if(!tech) {
        wx.showToast({
          title: '请选择技术栈',
          icon: 'none'
        })
      } else {
        wx.request({
          url: 'https://api.bangneedu.com/cpMatching/technology',
          data: {
            "technology": tech
          },
          method: 'PUT',
          header: {
            "content-type": "application/json",
            "Authorization": "Bearer " + wx.getStorageSync('token')
          },
          success: function (res) {
            console.log("更新技术栈: " + res);
            wx.request({
              url: 'https://api.bangneedu.com/cpMatching',
              data: {
                "technology": tech
              },
              method: 'POST',
              header: {
                "content-type": "application/json",
                "Authorization": "Bearer " + wx.getStorageSync('token')
              },
              success: function (res) {
                console.log(res);
                if (res.statusCode == 200) {
                  wx.showToast({
                    title: '提交成功',
                    icon: 'success',
                    duration: 1000
                  })
                } else if (res.statusCode == 500) {
                  wx.showModal({
                    title: '发生错误啦',
                    content: res.data.msg ? res.data.msg : '不知名错误，请联系阳叔',
                    success(res) {
                      if (res.confirm) {
                        console.log('用户点击确定')
                      } else if (res.cancel) {
                        console.log('用户点击取消')
                      }
                    }
                  })
                }
              },
              fail: function (err) {
                console.log(err);
              }
            })
          },
          fail: function (err) {
            console.log(err);
          }
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

  radioChange: function(e) {
    console.log('radio携带value值为：', e.detail.value);
    this.setData({
      radioCheckVal: e.detail.value
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var token = wx.getStorageSync('token');
    if (token) {
      this.setData({
        logedin: token
      })
      var that = this;
      wx.request({
        url: 'https://api.bangneedu.com/classify',
        method: 'GET',
        header: {
          "content-type": "application/json",
          "Authorization": "Bearer " + wx.getStorageSync('token')
        },
        success: function (res) {
          console.log(res.data);
          if (res.data.status == 401) {
            wx.showToast({
              title: '登陆过期，请重新登陆',
              icon: 'none',
              duration: 1000
            });
          }
          console.log(res.data.data[0].childList);
          that.setData({
            frontend: res.data.data[0].childList[1].childList,
            backend: res.data.data[0].childList[0].childList
          })
        },
        fail: function (err) {
          console.log(err);
        }
      }),
      wx.request({
        url: 'https://api.bangneedu.com/learningPathTeam',
        method: 'GET',
        header: {
          "content-type": "application/json",
          "Authorization": "Bearer " + wx.getStorageSync('token')
        },
        success: function (res) {
          that.setData({
            study:res.data.data.records
          })
        },
        fail: function (err) {
          console.log(err);
        }
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

  bindChange: function (e) {
    // console.log(e, "滑动")
    var that = this;
    that.setData({
      tag: e.detail.current
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
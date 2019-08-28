Page({

  /**
   * 页面的初始数据
   */
  data: {
    postList: [],
    daka: '',
    pageNum: 1,
    isEmpty: true,
    actionSheetHidden: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  handleTap: function(e) {
    console.log(e.currentTarget.dataset.type);
    var postItem = e.currentTarget.dataset.type;
    postItem.headPortrait = encodeURIComponent(postItem.headPortrait);
    wx.navigateTo({
      url: '/pages/article/article?cat=' + JSON.stringify(postItem),
    })
  },

  bindFormSubmit: function(e) {
    var that = this;
    console.log(e.detail.value.textarea);
    that.setData({
      daka: e.detail.value.textarea
    });
    var token = wx.getStorageSync('token');
    if (token) {
      if (that.data.daka) {
        wx.request({
          url: 'https://api.bangneedu.com/punchTheClock',
          method: 'POST',
          data: {
            "content": e.detail.value.textarea
          },
          header: {
            "content-type": "application/json",
            "Authorization": "Bearer " + wx.getStorageSync('token')
          },
          success: function(res) {
            console.log(res.data);
            if (res.data.status == 200 && res.data.data) {
              that.setData({
                daka: '',
              })
              var testObj = res.data.data;
              if (testObj.headPortrait) {
                testObj.headPortrait = encodeURIComponent(testObj.headPortrait);
              }
              wx.showToast({
                title: '打卡成功',
                icon: 'success',
                duration: 1000
              })
              wx.navigateTo({
                url: '/pages/postModal/postModal?cat=' + JSON.stringify(testObj)
              })
            } else if (res.data.status == 500 || (res.data.status == 200 && !res.data.data)) {
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
            } else if (res.data.status == 401) {
              wx.showToast({
                title: '登陆过期，请重新登陆',
                icon: 'none',
                duration: 1000
              });
              setTimeout(function() {
                wx.navigateTo({
                  url: '/pages/login/login',
                })
              }, 1000)

            }
          },
          fail: function(err) {
            console.log(err);
          }
        })
      }
      // var testObj = {
      //   commentNumber: "0",
      //   content: "Js中dom学习",
      //   createTime: "2019-08-23 23:16:13",
      //   day: "1",
      //   praiseNumber: "0",
      //   id: "1164919276688117761",
      //   name: "嘻嘻嘻",
      //   praiseNumber: "0",
      //   userId: "1150054988370677761"
      // }
      // if(testObj.headPortrait) {
      //   testObj.headPortrait = encodeURIComponent(testObj.headPortrait);
      // }
      // wx.navigateTo({
      //   url: '/pages/postModal/postModal?cat=' + JSON.stringify(testObj),
      // })
    } else {
      wx.redirectTo({
        url: '/pages/login/login',
      })
    }
  },

  getDakaList: function(url) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "Content-Type": "application/json"
      },
      success: function(res) {
        console.log(res.data.data.records);
        var totalPosts = [];
        if (!that.data.isEmpty) {
          totalPosts = that.data.postList.concat(res.data.data.records);
        } else {
          totalPosts = res.data.data.records;
          that.data.isEmpty = false;
        }
        that.setData({
          postList: totalPosts,
          pageNum: that.data.pageNum + 1
        })
        wx.hideNavigationBarLoading();
      },
      fail: function(err) {
        console.log(err);
      }
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
    var url = 'https://api.bangneedu.com/punchTheClock?current=1&size=20';
    this.getDakaList(url);
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
    var nextUrl = 'https://api.bangneedu.com/punchTheClock?current=' + this.data.pageNum + "&size=20";
    wx.showNavigationBarLoading();
    this.getDakaList(nextUrl);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
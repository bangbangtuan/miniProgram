Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 1,
    flag: false
  },

  getProjects: function () {
    var that = this;
    wx.request({
      url: 'https://api.bangneedu.com/project?current' + this.data.current + '&size=10',
      method: 'GET',
      header: {
        "content-type": "application/json"
      },
      success: function (res) {
        console.log(res.data.data);
        for (let i = 0; i < res.data.data.records.length; i++) {
          wx.request({
            url: 'https://api.bangneedu.com/projectTeam/' + res.data.data.records[i].id,
            method: 'GET',
            header: {
              "content-type": "application/json"
            },
            success: function (result) {
              console.log(result.data.data);
              res.data.data.records[i].teamMembers = result.data.data.slice(0,3)
              that.setData({
                flag: true,
                projects: res.data.data.records,
                pages: parseInt(res.data.data.pages)
              })
            },
            fail: function (err) {
              console.log(err);
            }
          })
        }
        console.log(that.data.projects)
      },
      fail: function (err) {
        console.log(err);
      }
    })
  },

  navigateToDetails: function(e) {
    // console.log(e.currentTarget.dataset['id']);
    wx.navigateTo({
      url: '/pages/project/projectDetails/projectDetails?id=' + e.currentTarget.dataset['id'],
    })
  },

  joinTeam: function(e) {
    wx.navigateTo({
      url: '/pages/project/joinTeam/joinTeam?id=' + e.currentTarget.dataset['id'],
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getProjects();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
import {
  ProjectItem
} from '../../models/project.js'

let projectItem = new ProjectItem ()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 1,
    flag: false
  },

  addTeamMembers: function(project, teams) {
    project.teamMembers = teams.slice(0, 4)
    project.totalMembers = teams
  },

  getProjects: function () {
    var that = this;
    let item = []
    projectItem.getProjectItem()
    .then ((res) => {
      that.setData({
        projects: res.data.records
      })
      for (let i = 0; i < that.data.projects.length; i++) {
         item.push(projectItem.getProjectTeam(that.data.projects[i].id))
      }
      return Promise.all(item)
    }).then((res) => {
      for (let i = 0; i < that.data.projects.length; i++) {
        let project = that.data.projects[i]
        let teams = res[i].data
        console.log('team: ', teams)
        this.addTeamMembers(project, teams)
      }
      that.setData({
        projects: that.data.projects
      })
      console.log('projects: ', that.data.projects)
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

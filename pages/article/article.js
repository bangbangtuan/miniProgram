import Poster from '../../miniprogram_dist/poster/poster';
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputTxt: '',
    actionSheetHidden: true,
    liked: ""
  },

  onPosterSuccess(e) {
    const {
      detail
    } = e;
    wx.previewImage({
      current: detail,
      urls: [detail]
    })
  },
  onPosterFail(err) {
    console.error(err);
  },

  onCreatePoster() {
    var date = new Date();
    var month = (date.getMonth() + 1).toString();
    var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var posterConfig = {
      width: 750,
      height: 1220,
      backgroundColor: '#fff',
      debug: false,
      pixelRatio: 2,
      blocks: [{
        x: 320,
        y: 425,
        width: 100,
        height: 50,
        backgroundColor: '#ffffff'
      }, {
        x: 370,
        y: 280,
        width: 2,
        height: 80,
        backgroundColor: '#444444',
      }, {
        x: 200,
        y: 450,
        width: 100,
        height: 2,
        backgroundColor: '#ffffff',
      }, {
        x: 440,
        y: 450,
        width: 100,
        height: 2,
        backgroundColor: '#ffffff',
      }],
      texts: [{
          x: 190,
          y: 110,
          baseLine: 'middle',
          text: this.data.postItem.name,
          fontSize: 36,
          color: '#333333',
        },
        {
          x: 550,
          y: 95,
          baseLine: 'middle',
          text: day,
          fontSize: 46,
          color: '#000000',
        },
        {
          x: 590,
          y: 100,
          baseLine: 'middle',
          text: '/',
          fontSize: 60,
          color: '#999999',
          fontStyle: 'italic',
        },
        {
          x: 610,
          y: 110,
          baseLine: 'middle',
          text: month + '月',
          fontSize: 30,
          color: '#444444',
        },
        {
          x: 150,
          y: 280,
          baseLine: 'middle',
          textAlign: 'center',
          text: [{
              text: '打卡时间',
              fontSize: 34,
              color: '#444444',
            },
            {
              text: '已坚持打卡',
              fontSize: 34,
              color: '#444444',
              marginLeft: 20,
            }
          ]
        },
        {
          x: 150,
          y: 350,
          baseLine: 'middle',
          text: [{
              text: hour + ':' + minute,
              fontSize: 50,
              color: '#000000',
            },
            {
              text: this.data.postItem.day,
              marginLeft: 60,
              fontSize: 50,
              color: '#000000',
            }, {
              text: '天',
              marginLeft: -10,
              fontSize: 40,
              color: '#666666',
            }
          ]
        },
        {
          x: 370,
          y: 450,
          baseLine: 'middle',
          text: '打卡',
          fontSize: 36,
          color: '#e3c9c9',
          zIndex: 1,
          textAlign: 'center'
        },
        {
          x: 100,
          y: 520,
          text: this.data.postItem.content,
          fontSize: 36,
          color: '#000000',
          lineNum: 3,
          width: 1000,
          lineHeight: 40
        },
        {
          x: 370,
          y: 1190,
          baseLine: 'middle',
          text: "请长按图片保存后，分享到朋友圈",
          fontSize: 30,
          color: '#000000',
          textAlign: 'center'
        }
      ],
      images: [{
          width: 110,
          height: 110,
          x: 60,
          y: 60,
          borderRadius: 100,
          url: this.data.postItem.headPortrait == undefined ? "http://bbt-oss.oss-cn-beijing.aliyuncs.com/bbt-oss/2019-08-28/f3983927d1a34fb2a7056d4bd2142314-file?Expires=4720619017&OSSAccessKeyId=LTAICSpdWLfNbeYk&Signature=9UqtxjkI7wV%2B6x%2FisCOKR6btv%2FM%3D" : this.data.postItem.headPortrait,
        },
        {
          width: 710,
          height: 1200,
          x: 20,
          y: 0,
          // url: '../../images/bac.png',
          url: "http://bbt-oss.oss-cn-beijing.aliyuncs.com/bbt-oss/2019-08-27/4e6becba0940464c80561f41030bc1ee-file?Expires=4720515358&OSSAccessKeyId=LTAICSpdWLfNbeYk&Signature=7%2B1t69UAQg4eg5G%2B8LpTQ15GrsY%3D",
          zIndex: -1
        },
        {
          width: 650,
          height: 79,
          x: 50,
          y: 750,
          // url: 'https://i.imgur.com/mc1XXPz.png',
          url: "https://bbt-oss.oss-cn-beijing.aliyuncs.com/bbt-oss/2019-08-26/9567e503d6204ab991c1fe96f37fd558-file?Expires=4720450770&OSSAccessKeyId=LTAICSpdWLfNbeYk&Signature=LMLefGCndryaVV9u7orX%2Bq38b%2Fs%3D",
        },
        {
          width: 270,
          height: 105,
          x: 240,
          y: 830,
          // url: 'https://i.imgur.com/D4coSSS.png',
          url: 'https://bbt-oss.oss-cn-beijing.aliyuncs.com/bbt-oss/2019-08-26/e92c26c20e7848cfa1aa68a69d25474a-file?Expires=4720450640&OSSAccessKeyId=LTAICSpdWLfNbeYk&Signature=3Tmp1A6Divce%2BuSVdKPQ7ExsqDU%3D',
        },
        {
          width: 200,
          height: 200,
          x: 280,
          y: 970,
          // url: '../../images/scan.jpg',
          url: "https://bbt-oss.oss-cn-beijing.aliyuncs.com/bbt-oss/2019-08-27/39d97b8fb54a4470aa7ec3a7f83827b5-file?Expires=4720513649&OSSAccessKeyId=LTAICSpdWLfNbeYk&Signature=L%2F7dQo0%2BlBs4BxRR7iD29EX9HYU%3D"
        }
      ]

    }
    this.setData({
      posterConfig: posterConfig
    }, () => {
      // Poster.create();
      Poster.create(true);
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('optionsoptions',options.cat)
    var postItem = JSON.parse(options.cat);
   
    let title='评论 · '+postItem.commentNumber;
    wx.setNavigationBarTitle({
      title: title
    })
    postItem.icon = decodeURIComponent(postItem.icon);
    if (postItem.image){
      postItem.image = decodeURIComponent(postItem.image);
    }
    
    console.log(postItem);

    this.setData({
      postItem: postItem,
      currentPostId: postItem.id,
    });
    this.getComments();
  },
  onShow:function(){
  },
  previewImage: function (e) {
    console.log(e)
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: [this.data.postItem.image]// 需要预览的图片http链接列表
    })
  },
  getComments: function() {
    var that = this;
    wx.request({
      url: app.globalData.URL+'punch_the_clock_comment?id=' + that.data.currentPostId,
      method: 'GET',
      header: {
        "content-type": "application/json",
        "Authorization": "Bearer " + wx.getStorageSync('token')
      },
      success: function(res) {
        console.log('rescomments9999999999',res.data.data.records);
        that.setData({
          comments: res.data.data.records ? res.data.data.records : ''
        });
        if (res.statusCode == 401) {
          wx.showToast({
            title: '登陆过期，请重新登陆',
            icon: 'none',
            duration: 1000
          });
        }
      },
      fail: function(err) {
        console.log(err);
      }
    })
  },

  getPostItem: function() {
    var that = this;
    wx.request({
      url: app.globalData.URL+'punch_the_clock/' + that.data.currentPostId,
      method: 'GET',
      header: {
        "content-type": "application/json",
        "Authorization": "Bearer " + wx.getStorageSync('token')
      },
      success: function(res) {
        console.log(res.data);
        that.setData({
          postItem: res.data.data
        });
        console.log('commentNumber',that.data.postItem.commentNumber);
        let title='评论 · '+that.data.postItem.commentNumber;
        wx.setNavigationBarTitle({
          title: title
        })
      },
      fail: function(err) {
        console.log(err);
      }
    })
  },

  openActionSheet(e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    });

  },
  listenerActionSheet: function() {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },

  closeAction: function() {
    this.setData({
      actionSheetHidden: true
    })
  },

  onBindChange: function(event) {
    var that = this;
    console.log(event.detail.value);
    that.setData({
      inputTxt: event.detail.value
    })
    wx.request({
      url: app.globalData.URL+'punch_the_clock_comment',
      method: 'POST',
      data: {
        "content": event.detail.value,
        "punchTheClockId": this.data.postItem.id
      },
      header: {
        "content-type": "application/json",
        "Authorization": "Bearer " + wx.getStorageSync('token')
      },
      success: function(res) {
        console.log(res.data);
        if (res.data.status == 200) {
          wx.showToast({
            title: '评论成功',
            icon: 'success',
            duration: 1000
          });
          that.setData({
            inputTxt: ''
          })
          that.getComments();
          that.getPostItem();
        } else {
          wx.showToast({
            title: '评论失败',
            icon: 'waiting',
            duration: 1000
          });
        }
      },
      fail: function(err) {
        console.log(err);
      }
    })
  },

  onSubmit: function(event) {
    var that = this;
    console.log(event.detail.value.comment);
    that.setData({
      inputTxt: event.detail.value.comment
    })
    var token = wx.getStorageSync('token');
    if(token){
      if (event.detail.value != undefined && event.detail.value != '') {
        wx.request({
          url: app.globalData.URL+'punch_the_clock_comment',
          method: 'POST',
          data: {
            "content": event.detail.value.comment,
            "punchTheClockId": this.data.postItem.id
          },
          header: {
            "content-type": "application/json",
            "Authorization": "Bearer " + wx.getStorageSync('token')
          },
          success: function(res) {
            console.log('22222233333',res.data);
            if (res.data.code == 0) {
              wx.showToast({
                title: '评论成功',
                icon: 'success',
                duration: 1000
              });
              that.setData({
                inputTxt: ''
              })
              that.getComments();
              that.getPostItem();
            } else {
              wx.showToast({
                title: '评论失败',
                icon: 'waiting',
                duration: 1000
              });
            }
          },
          fail: function(err) {
            console.log(err);
          }
        })
      }
    }else{
      wx.showToast({
        title: '请登陆后进行评论',
        icon:'none',
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
 

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
  onShareAppMessage: function(options) {
    var that = this;
    that.data.postItem.icon = encodeURIComponent(that.data.postItem.icon);
    console.log(that.data.postItem);
    var shareObj = {
      // title: "棒棒团",
      path: '/pages/article/article?cat=' + JSON.stringify(that.data.postItem), // 默认是当前页面，必须是以‘/’开头的完整路径
      // imgUrl: '', //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
      success: function(res) {　
        wx.showToast({
          title: '分享成功',
          icon: 'success',
          duration: 1000
        });
      },
      fail: function() {
        wx.showToast({
          title: '分享失败',
          icon: 'loading',
          duration: 1000
        })
      }
    };
    return shareObj;
  }
})
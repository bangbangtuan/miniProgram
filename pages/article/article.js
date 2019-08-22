import Poster from '../../miniprogram_dist/poster/poster';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputTxt: '',
    actionSheetHidden: true,
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
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var posterConfig = {
      width: 750,
      height: 1220,
      backgroundColor: '#fff',
      debug: false,
      pixelRatio: 2,
      blocks: [{
        x: 320,
        y: 475,
        width: 100,
        height: 50,
        backgroundColor: '#ffffff'
      }],
      lines: [{
        startX: 370,
        startY: 280,
        endX: 371,
        endY: 360,
        borderWidth: 1,
        color: '#444444',
        }, {
        startX: 200,
        startY: 500,
        endX: 300,
        endY: 501,
        borderWidth: 1,
        color: '#ffffff',
        }, {
        startX: 440,
        startY: 500,
        endX: 540,
        endY: 501,
        borderWidth: 1,
        color: '#ffffff',
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
              text: '起床时间',
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
          y: 500,
          baseLine: 'middle',
          text: '打卡',
          fontSize: 36,
          color: '#e3c9c9',
          zIndex: 1,
          textAlign: 'center'
        },
        {
          x: 250,
          y: 580,
          baseLine: 'middle',
          text: this.data.postItem.content,
          fontSize: 40,
          color: '#000000', 
          textAlign: 'center'
        },
        {
          x: 50,
          y: 680,
          baseLine: 'top',
          text: [{
              text: '生活',
              fontSize: 75,
              color: '#000000',
            },
            {
              text: '像一个个习惯的缩影',
              marginLeft: -100,
              fontSize: 36,
              color: '#000000',
            }
          ]
        }, {
          x: 220,
          y: 760,
          text: '每一处都结出果实般的故事',
          fontSize: 32,
          color: '#000000',
          baseLine: 'bottom'
        }, {
          x: 50,
          y: 810,
          baseLine: 'top',
          text: [{
              text: '盛开',
              fontSize: 75,
              color: '#000000',
            },
            {
              text: '像花儿一样的喜怒哀乐',
              marginLeft: -100,
              fontSize: 36,
              color: '#000000',
            }
          ]
        }, {
          x: 220,
          y: 890,
          text: '每一刻都充满朝气焕发神采',
          fontSize: 32,
          color: '#000000',
          baseLine: 'bottom'
        }
      ],
      images: [{
          width: 110,
          height: 110,
          x: 60,
          y: 60,
          borderRadius: 100,
          url: this.data.postItem.headPortrait,
        },
        {
          width: 710,
          height: 1200,
          x: 20,
          y: 0,
          // url: '../../images/bac.png',
          url: 'http://bbt-oss.oss-cn-beijing.aliyuncs.com/bbt-oss/2019-08-22/d5ac90832cc44ccc874f7d5e95a18231-file?Expires=4720081042&OSSAccessKeyId=LTAICSpdWLfNbeYk&Signature=WoYO35pB%2F%2BTYK%2Bo%2BOoKDGWzaTxg%3D',
          zIndex: -1
        },
        {
          width: 200,
          height: 200,
          x: 280,
          y: 990,
          // url: '../../images/scan.jpg',
          url: 'http://bbt-oss.oss-cn-beijing.aliyuncs.com/bbt-oss/2019-08-22/8a807c6b81374b7289b4954b6db8b548-file?Expires=4720081412&OSSAccessKeyId=LTAICSpdWLfNbeYk&Signature=TcpZ5fyTk7ZHDnBvzXX0rwc%2FrBA%3D'
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
    var postItem = JSON.parse(options.cat);
    postItem.headPortrait = decodeURIComponent(postItem.headPortrait);
    console.log(postItem);

    this.setData({
      postItem: postItem,
      currentPostId: postItem.id,
    });

    this.getComments();

    var likeCollection = wx.getStorageSync('like_collection');
    if (likeCollection) {
      var likeCollected = likeCollection[this.data.postItem.id];
      if (likeCollected) {
        this.setData({
          liked: likeCollected
        })
      }
    } else {
      var likeCollection = {};
      likeCollection[this.data.postItem.id] = false;
      wx.setStorageSync('like_collection', likeCollection)
    }
  },

  getComments: function() {
    var that = this;
    wx.request({
      url: 'https://api.bangneedu.com/punchTheClockComment/' + that.data.currentPostId,
      method: 'GET',
      header: {
        "content-type": "application/json",
        "Authorization": "Bearer " + wx.getStorageSync('token')
      },
      success: function(res) {
        console.log(res.data);
        that.setData({
          comments: res.data.data ? res.data.data : ''
        });
        if (res.data.status == 401) {
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
  },

  getPostItem: function() {
    var that = this;
    wx.request({
      url: 'https://api.bangneedu.com/punchTheClock/' + that.data.currentPostId,
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
      },
      fail: function(err) {
        console.log(err);
      }
    })
  },

  onLikeTap: function() {
    var that = this;
    var likeCollection = wx.getStorageSync('like_collection');
    var likeCollected = likeCollection[this.data.currentPostId];
    likeCollected = !likeCollected;
    likeCollection[this.data.currentPostId] = likeCollected;

    wx.setStorageSync('like_collection', likeCollection);
    this.setData({
      liked: likeCollected
    })

    var extention = this.data.liked ? 'like' : 'not_like';
    var id = this.data.currentPostId;

    wx.request({
      url: 'https://api.bangneedu.com/punchTheClock/' + extention,
      method: 'PUT',
      data: {
        "punchTheClockId": id
      },
      header: {
        "content-type": "application/json",
        "Authorization": "Bearer " + wx.getStorageSync('token')
      },
      success: function(res) {
        console.log(res.data);
        if (res.data.status == 200) {
          wx.showToast({
            title: that.data.liked ? '点赞成功' : '取消点赞',
            duration: 1000
          });
          that.getPostItem();
        }
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
      url: 'https://api.bangneedu.com/punchTheClockComment',
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
    if (event.detail.value != undefined && event.detail.value != '') {
      wx.request({
        url: 'https://api.bangneedu.com/punchTheClockComment',
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
  onShareAppMessage: function(options) {
    var that = this;
    var shareObj = {
      // title: "棒棒团",
      path: '/pages/index/index', // 默认是当前页面，必须是以‘/’开头的完整路径
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
import Poster from '../../miniprogram_dist/poster/poster';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    postList: [],
    postItem: {},
    daka: '',
    pageNum: 1,
    myFavor: [],
    isEmpty: true,
    isDetail: false,
    saveId: {},
    actionSheetHidden: true,
    isClickable: true,
    t_length: 0,
    type: '',
    comment: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    // var url = 'https://api.bangneedu.com/punchTheClock?current=1&size=20';
    // this.getDakaList(url);
    console.log('onload----')
  },

  bindText: function (e) {
    var t_text = e.detail.value.length;
    // if (t_text.test(/[^\x00-\xff]/ig) != null) {
    //   t_text += 1;
    // }
    // console.log(t_text)
    this.setData({
      t_length: t_text
    })
  },
  likeTap(e) {
    var that = this;
    var likeCollection = wx.getStorageSync('like_collection1');
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    var likeCollected = likeCollection[id];
    likeCollected = !likeCollected;
    likeCollection[id] = likeCollected;
    wx.setStorageSync('like_collection1', likeCollection);
    var num = "";
    console.log(this.data.postList)
    if (likeCollected) {
      num = parseInt(that.data.postList[index].praiseNumber) + 1
    } else {
      num = parseInt(that.data.postList[index].praiseNumber) - 1
    }
    console.log(that.data.postList[index].liked)
    var like_str = 'postList[' + index + '].liked'
    console.log(likeCollected)
    console.log(that.data.postList[index].liked)
    this.setData({
      [like_str]: likeCollected,
      ['postList[' + index + '].praiseNumber']: num,
    })
    var extention = likeCollected ? 'like' : 'not_like';
    console.log(e.currentTarget.dataset.id)
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
      success: function (res) {
        console.log(res.data);
        if (res.data.status == 200) {
          wx.showToast({
            title: res.data.msg,
            duration: 1000
          });
          // }
        }
      },
      fail: function (err) {
        console.log(err);
      },
    })
  },
  getAllLike() {
    var that = this;
    var url = 'https://api.bangneedu.com/punchTheClock/allLike';
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + wx.getStorageSync('token')
      },
      success: function (res) {
        if(res.data.status == 200){
          // console.log(res.data.data);
          // that.data.myFavor = res.data.data;
          var likeCollection = {};
          res.data.data.forEach(item => {
            likeCollection[item.punchTheClockId] = true;
          })
          wx.setStorageSync('like_collection1', likeCollection);
          var url = 'https://api.bangneedu.com/punchTheClock?current=1&size=20';
          that.getDakaList(url);
        }
        
      },
      fail: function (err) {
        console.log(err);
      }
    });
  },
  handleTap: function (e) {
    console.log('999')
    console.log(e.currentTarget.dataset);
    var postItem = e.currentTarget.dataset.type;
    postItem.headPortrait = encodeURIComponent(postItem.headPortrait);
    this.data.isDetail = true;
    this.data.saveId.id = postItem.id;
    this.data.saveId.index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '/pages/article/article?cat=' + JSON.stringify(postItem),
    })
  },

  radioChange: function (e) {
    console.log('radio携带value值为：', e.detail.value);
    this.setData({
      type: e.detail.value
    });
  },

  getClassify: function () {
    var that = this;
    var url = 'https://api.bangneedu.com/classify';
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        console.log(res.data.data);
        that.setData({
          classifies: res.data.data
        })
      },
      fail: function (err) {
        console.log(err);
      }
    });
  },

  bindFormSubmit: function (e) {
    var that = this;
    console.log(e.detail.value);
    that.setData({
      daka: e.detail.value.textarea,
      type: e.detail.value.type
    })
    var token = wx.getStorageSync('token');
    if (token) {
      if (!that.data.daka || !that.data.type) {
        wx.showToast({
          title: '请输入打卡内容并选择打卡类别',
          icon: 'none',
          duration: 1000
        })
      } else {
        that.setData({
          daka: '',
          type: '',
          isClickable: false
        });
        wx.cloud.init()
        wx.cloud.callFunction({
          name: 'securityMsg',
          data: ({
            text: e.detail.value.textarea
          })

        }).then(res => {
          console.log(res.result);
          if (res.result.errCode === 87014) {
            wx.showToast({
              title: '输入的内容包含敏感词语，请检查后再发',
              icon: 'none',
            })
            that.setData({
              isClickable: true,
              isEmpty: true,
              t_length: 0
            })
          } else {
            wx.request({
              url: 'https://api.bangneedu.com/punchTheClock',
              method: 'POST',
              data: {
                "content": e.detail.value.textarea,
                "type": e.detail.value.type
              },
              header: {
                "content-type": "application/json",
                "Authorization": "Bearer " + wx.getStorageSync('token')
              },
              success: function (res) {
                console.log(res.data);
                if (res.data.status == 200 && res.data.data) {
                  var testObj = res.data.data;
                  that.setData({
                    isClickable: true,
                    isEmpty: true,
                    postItem: testObj,
                    t_length: 0
                  })
                
                  var url = 'https://api.bangneedu.com/punchTheClock?current=1&size=20';
                  that.setData({
                    pageNum: 1
                  })
                  that.getDakaList(url);
                  wx.showToast({
                    title: '打卡成功',
                    icon: 'success',
                    duration: 1000
                  })
                  that.onCreatePoster();
                  // wx.navigateTo({
                  //   url: '/pages/postModal/postModal?cat=' + JSON.stringify(testObj)
                  // })
                } else if (res.data.status == 500 || (res.data.status == 200 && !res.data.data)) {
                  that.setData({
                    isClickable: true
                  })
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
                  setTimeout(function () {
                    wx.navigateTo({
                      url: '/pages/login/login',
                    })
                  }, 1000)

                }
              },
              fail: function (err) {
                console.log(err);
              }
            })
          }
        })
      }
    } else {
      wx.redirectTo({
        url: '/pages/login/login',
      })
    }
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
      Poster.create(true);
    });
  },
  getDakaList: function (url) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        console.log(res.data.data.records);
        // var records=res.data.data.records;
        var totalPosts = [];
        console.log(that.data.isEmpty)
        if (!that.data.isEmpty) {
          console.log('1111')
          totalPosts = that.data.postList.concat(res.data.data.records);
        } else {
          totalPosts = res.data.data.records;
          that.data.isEmpty = false;
        }
        console.log(totalPosts)
        var likeCollection = wx.getStorageSync('like_collection1');
        if (likeCollection) {
          console.log(totalPosts.length - 1)
          console.log(totalPosts.slice(totalPosts.length - 20, totalPosts.length))
          let list = totalPosts.slice(totalPosts.length - 20, totalPosts.length);
          list.forEach(item => {
            item.liked = "";
            var likeCollected = likeCollection[item.id]
            if (likeCollected) {
              console.log(item.id)
              item.liked = likeCollected;
            }
            wx.request({
              url: 'https://api.bangneedu.com/punchTheClockComment/' + item.id,
              method: 'GET',
              header: {
                "content-type": "application/json",
                "Authorization": "Bearer " + wx.getStorageSync('token')
              },
              success: function (res) {
                // console.log(res.data.data[0]);
                if (res.data.data[0]) {
                  console.log('存在')
                  console.log(res.data.data)
                  item.comm_name = res.data.data[0].name + ": ";
                  item.comment = res.data.data[0].content;
                }
                that.setData({
                  postList: totalPosts,
                })
                wx.hideNavigationBarLoading();
                wx.stopPullDownRefresh();
                if (res.data.status == 401) {
                  wx.showToast({
                    title: '登陆过期，请重新登陆',
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
              fail: function (err) {
                console.log(err);
              }
            })
          })
        }
        that.setData({
          pageNum: that.data.pageNum + 1
        })
      },
      fail: function (err) {
        console.log(err);
      }
    });
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },
  getcommentByid(id) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'https://api.bangneedu.com/punchTheClockComment/' + id,
        method: 'GET',
        header: {
          "content-type": "application/json",
          "Authorization": "Bearer " + wx.getStorageSync('token')
        },
        success: function (res) {
          // console.log(res.data.data[0]);
          resolve(res.data.data)
          if (res.data.status == 401) {
            wx.showToast({
              title: '登陆过期，请重新登陆',
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
        fail: function (err) {
          reject(err)
        }
      })


    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('onready----')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var token = wx.getStorageSync('token');
    if(token){
      if (this.data.isDetail) {
        console.log('从详情返回');
        this.data.isDetail = false;
        wx.request({
          url: 'https://api.bangneedu.com/punchTheClock/' + that.data.saveId.id,
          method: 'GET',
          header: {
            "content-type": "application/json",
            "Authorization": "Bearer " + wx.getStorageSync('token')
          },
          success: function (res) {
            var str = 'postList[' + that.data.saveId.index + '].commentNumber'
            that.setData({
              [str]: res.data.data.commentNumber
            });
            that.getcommentByid(that.data.saveId.id).then(res => {
              var str_name = 'postList[' + that.data.saveId.index + '].comm_name';
              var str_comm = 'postList[' + that.data.saveId.index + '].comment';
              if (res.length > 0) {
                that.setData({
                  [str_name]: res[0].name + ': ',
                  [str_comm]: res[0].content
                })
              }

            })
          },
          fail: function (err) {
            console.log(err);
          }
        })
      } else if (this.data.isEmpty) {
        this.getAllLike();
        // var url = 'https://api.bangneedu.com/punchTheClock?current=1&size=20';
        // this.getDakaList(url);
      }
      this.getClassify();
    }else{
      wx.showToast({
        title: '登陆过期，请重新登陆',
        icon: 'none',
        duration: 1000
      });
      setTimeout(function () {
        wx.navigateTo({
          url: '/pages/login/login',
        })
      }, 3000)
    }
   
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
    var url = 'https://api.bangneedu.com/punchTheClock?current=1&size=20';
    this.getDakaList(url);
    this.setData({
      daka: '',
      pageNum: 1,
      isEmpty: true,
    })
    wx.showNavigationBarLoading();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var nextUrl = 'https://api.bangneedu.com/punchTheClock?current=' + this.data.pageNum + "&size=20";
    wx.showNavigationBarLoading();
    this.getDakaList(nextUrl);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    console.log(res)
    var postItem = res.target.dataset.value;
    postItem.headPortrait = encodeURIComponent(postItem.headPortrait);
    var that = this;
    var shareObj = {
      // title: "棒棒团",
      path: '/pages/article/article?cat=' + JSON.stringify(postItem), // 默认是当前页面，必须是以‘/’开头的完整路径
      // imgUrl: '', //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
      success: function (res) {
        wx.showToast({
          title: '分享成功',
          icon: 'success',
          duration: 1000
        });
      },
      fail: function () {
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
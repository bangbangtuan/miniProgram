import Poster from '../../miniprogram_dist/poster/poster';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    postList: [],
    postItem: {},
    image: [],
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
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      count:1,
      sizeType: ['original', 'compressed'], 
      sourceType: ['album', 'camera'],
      success: function (res) {
        // that.setData({
        //   image: res.tempFilePaths
        // });
        let tempFilePath = res.tempFilePaths;
      
          wx.uploadFile({
            url: 'https://api.bangneedu.com/upload', 
            header: {
              "content-type": "multipart/form-data",
              "Authorization": "Bearer " + wx.getStorageSync('token')
            },
            filePath: tempFilePath[0],
            name: 'file',
            success(res) {
             let data=JSON.parse(res.data)
              if(data.status == 401){
                  wx.showToast({
                    title: '请登陆后上传图片',
                    icon:'none',
                    duration:1000
                  })
              }
              if(data.status == 200){
                let img = data.data;
                let arr = [];
                arr.push(img);
                that.setData({
                  image: arr
                });
              }
            }
          })
       
       
      }
    })
  },
  previewImage: function (e) {
    console.log(e)
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.image // 需要预览的图片http链接列表
    })
  },
  deleteImg(){
    this.setData({
      image:''
    })
  },
  getAllLike() {
    var that = this;
    wx.request({
      url: 'https://api.bangneedu.com/user',
      method: 'GET',
      header: {
        "content-type": "application/json",
        "Authorization": "Bearer " + wx.getStorageSync('token')
      },
      success: function (res) {
        console.log(res.data.data);
        if (res.data.status == 401) {
          wx.showToast({
            title: '请登陆后进行打卡',
            icon: 'none',
            duration: 1000
          });
          var url = 'https://api.bangneedu.com/punchTheClock?current=1&size=20';
          that.getDakaList(url);
        } else if (res.data.status == 200 && res.data.data) {
          wx.request({
            url: 'https://api.bangneedu.com/punchTheClock/allLike',
            method: 'GET',
            header: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + wx.getStorageSync('token')
            },
            success: function (res) {
              if (res.data.status == 200) {
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
        }
      },
      fail: function (err) {
        console.log(err);
      }
    })    
  },
  handleTap: function (e) {
    console.log(e.currentTarget.dataset);
    var postItem = e.currentTarget.dataset.type;
    postItem.headPortrait = encodeURIComponent(postItem.headPortrait);
    if (postItem.image){
      postItem.image = encodeURIComponent(postItem.image);
    }
    this.data.isDetail = true;
    this.data.saveId.id = postItem.id;
    this.data.saveId.index = e.currentTarget.dataset.index;
    console.log(postItem)
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

  getTags: function () {
    var that = this;
    var url = 'https://api.bangneedu.com/tag';
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        console.log(res.data.data);
        that.setData({
          tags: res.data.data.records
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
    let image=that.data.image[0];
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
          image:[],
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
                "type": e.detail.value.type,
                "image": image
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
                  that.setData({
                    isClickable: true,
                    isEmpty: true,
                    t_length: 0
                  })
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

  // clipImage : (index, content, cb) => {  
  //   var filePath = wx.env.USER_DATA_PATH;
  //   console.log(filePath)
  //   var shareImg = "../../images/shareImg.jpeg";
  //   // ‘canvas’为前面创建的canvas标签的canvas-id属性值
  //   let ctx = wx.createCanvasContext('canvas' + index);  
  //   let canvasW = 640, canvasH = 512;
  
  //   // 将图片绘制到画布
  //   ctx.drawImage(shareImg, 0, 0, canvasW, canvasH, 0, 0, canvasW, canvasH) 
  //   // draw()必须要用到，并且需要在绘制成功后导出图片
  //   var that = this;
  //   ctx.draw(false, () => {
  //     setTimeout(() => {
  //       //  导出图片
  //       wx.canvasToTempFilePath({
  //         width: canvasW,
  //         height: canvasH,
  //         destWidth: canvasW,
  //         destHeight: canvasH,
  //         canvasId: 'canvas' + index,
  //         fileType: 'jpg',
  //         success: (res) => {
  //           // res.tempFilePath为导出的图片路径
  //           typeof cb == 'function' && cb(res.tempFilePath);
  //           content.shareImg = res.tempFilePath
  //         }
  //       }, that)
  //     }, 300);
  //   })
  // },

  getDakaList: function (url) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        var totalPosts = [];
        console.log(res.data.data.records);
        // for(var i = 0; i < res.data.data.records.length; i++) {
        //   that.clipImage(i, res.data.data.records[i], (img) => {
        //     // console.log(img);  // img为最终裁剪后生成的图片路径，我们可以用来做为转发封面图
        //     // res.data.data.records[i].shareImg = img
        //     that.setData({
        //       totalPosts: res.data.data.records
        //     })
        //   }); 
        // }
        console.log(res.data.data.records)
        console.log(that.data.isEmpty)
        if (!that.data.isEmpty) {
          totalPosts = that.data.postList.concat(res.data.data.records);
        } else {
          totalPosts = res.data.data.records;
          that.data.isEmpty = false;
        }
        var likeCollection = wx.getStorageSync('like_collection1');
        if (likeCollection) {
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
                // "Authorization": "Bearer " + wx.getStorageSync('token')
              },
              success: function (res) {
                console.log(res.data);
                if (res.data.data[0]) {
                  console.log(res.data.data)
                  item.comm_name = res.data.data[0].name + ": ";
                  item.comment = res.data.data[0].content;
                }
                wx.hideNavigationBarLoading();
                wx.stopPullDownRefresh();
                if (res.data.status == 401) {
                  wx.showToast({
                    title: '登陆过期，请重新登陆',
                    icon: 'none',
                    duration: 1000
                  });
                }
              },
              fail: function (err) {
                console.log(err);
              }
            })
          })
        }
        console.log(totalPosts)
        that.setData({
          pageNum: that.data.pageNum + 1,
          postList: totalPosts,
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
          resolve(res.data.data)
          if (res.data.status == 401) {
            wx.showToast({
              title: '登陆过期，请重新登陆',
              icon: 'none',
              duration: 1000
            });
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.setData({
    //   isEmpty: true
    // })
    this.getTags();
    var that = this;
    var token = wx.getStorageSync('token');
    if(token){
      if (this.data.isDetail) {
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
      }
    }else{
      wx.showToast({
        title: '未登陆状态登陆',
        icon: 'none',
        duration: 1000
      });
      if (that.data.isEmpty){
        var url = 'https://api.bangneedu.com/punchTheClock?current=1&size=20';
        this.getDakaList(url);
      }
      
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

  shareClock: function() {
    this.onShareAppMessage
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var postItem = res.target.dataset.value;
    console.log(res.target.dataset);
    var that = this;
    if(postItem.image) {
      that.setData({
        picUrl: postItem.image
      });
    } else {
      that.setData({
        picUrl: postItem.shareImg ? postItem.shareImg : "/images/shareBac.jpeg"
      });
      
    }
    postItem.headPortrait = encodeURIComponent(postItem.headPortrait);
    var shareObj = {
      title: postItem.content,
      imageUrl: that.data.picUrl,
      path: '/pages/article/article?cat=' + JSON.stringify(postItem),
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
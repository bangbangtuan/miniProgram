

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    postList: [],
    postItem: {},
    icon:'/images/icon/touxiang.png',
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
  onLoad: function (options) {},
  likeTap(e) {
    var that = this;
    var likeCollection = wx.getStorageSync('like_collection1');
    console.log('collection',likeCollection)
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    console.log('id',id);
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
      // url:  app.globalData.URL+'punch_the_clock_like/' + extention,
      url:  app.globalData.URL+'punch_the_clock_like/' +id,
      method: likeCollected?'POST':'DELETE',
      header: {
        "content-type": "application/json",
        "Authorization": "Bearer " + wx.getStorageSync('token')
      },
      success: function (res) {
        console.log(res);
        if (res.data.code == 0) {
          wx.showToast({
            title: likeCollected ? '点赞成功':'取消点赞',
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
    wx.request({
      url:  app.globalData.URL+'member',
      method: 'GET',
      header: {
        "content-type": "application/json",
        "Authorization": "Bearer " + wx.getStorageSync('token')
      },
      success: function (res) {
        console.log('resresgetAllLike',res);
        if (res.statusCode == 401) {
          wx.showToast({
            title: '请登陆后进行打卡',
            icon: 'none',
            duration: 1000
          });
         
          var url =  app.globalData.URL+'punch_the_clock?current=1&size=20';
         
          that.getDakaList(url);
        } else if (res.data.code == 0 && res.data.data) {
          that.setData({
            icon: res.data.data.icon
          })
          wx.request({
            url:  app.globalData.URL+'punch_the_clock_like',
            method: 'GET',
            header: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + wx.getStorageSync('token')
            },
            success: function (res) {
              if (res.data.code == 0) {
                var likeCollection = {};
                res.data.data.forEach(item => {
                  likeCollection[item.punchTheClockId] = true;
                })
                wx.setStorageSync('like_collection1', likeCollection);
                console.log('getAlllike')
                setTimeout(()=>{
                  var url =  app.globalData.URL+'punch_the_clock?current=1&size=20';
                  that.setData({
                    isEmpty:true,
                    pageNum: 1
                  })
                  that.getDakaList(url);
                },1000);
              
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
  goPublish(){
    wx.navigateTo({
      url: '/pages/post/post',
    })
  },
  handleTap: function (e) {
    console.log('333333',e.currentTarget.dataset);
    var postItem = e.currentTarget.dataset.type;
    postItem.icon = encodeURIComponent(postItem.icon);
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
        console.log(res.data.data.records)
        console.log(that.data.isEmpty)
        res.data.data.records.forEach(item=>{
            if(item.praiseNumber == null){
                item.praiseNumber=0;
            }
        })
        if (!that.data.isEmpty) {
          totalPosts = that.data.postList.concat(res.data.data.records);
        } else {
          totalPosts = res.data.data.records;
          that.data.isEmpty = false;
        }
        var likeCollection = wx.getStorageSync('like_collection1');
        if (likeCollection) {
          let list = totalPosts.slice(totalPosts.length - 20, totalPosts.length);

          //list数据中我是否赞过
          list.forEach(item => {
            item.liked = "";
            var likeCollected = likeCollection[item.id]
            if (likeCollected) {
              console.log(item.id)
              item.liked = likeCollected;
            }
            //某条打卡的评论
            wx.request({
              url:  app.globalData.URL+'punch_the_clock_comment?id=' + item.id,
              method: 'GET',
              header: {
                "content-type": "application/json",
                "Authorization": "Bearer " + wx.getStorageSync('token')
              },
              success: function (res) {
                console.log('某条打卡的评论',res.data);
                if (res.data.data.records[0]) {
                  console.log(res.data.data)
                  item.comm_name = res.data.data.records[0].nickname+" : " ;
                  item.comment = res.data.data.records[0].content;
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
        console.log('totalPoststotalPosts',totalPosts)
        setTimeout(() => {
          that.setData({
            pageNum: that.data.pageNum + 1,
            postList: totalPosts,
          })
        }, 1000);
        // that.setData({
        //   pageNum: that.data.pageNum + 1,
        //   postList: totalPosts,
        // })
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
        url:  app.globalData.URL+'punch_the_clock_comment?id=' + id,
        method: 'GET',
        header: {
          "content-type": "application/json",
          // "Authorization": "Bearer " + wx.getStorageSync('token')
        },
        success: function (res) {
          resolve(res.data.data.records)
          if (res.statusCode == 401) {
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
    var that = this;
    var token = wx.getStorageSync('token');
    if(token){
      if (this.data.isDetail) {
        this.data.isDetail = false;
        wx.request({
          url:  app.globalData.URL+'punch_the_clock/' + that.data.saveId.id,
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
                  [str_name]: res[0].name + " : ",
                  [str_comm]: res[0].content
                })
              }

            })
          },
          fail: function (err) {
            console.log(err);
          }
        })}else {
          this.getAllLike();
        }
    }else{
      wx.showToast({
        title: '未登陆状态登陆',
        icon: 'none',
        duration: 1000
      });
      this.setData({
        icon:'/images/icon/touxiang.png'
      })
      if (that.data.isEmpty){
          console.log(app.globalData.URL);
        var url = app.globalData.URL +'punch_the_clock?current=1&size=20';
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
    var url =  app.globalData.URL+'punch_the_clock?current=1&size=20';
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
    var nextUrl =  app.globalData.URL+'punchTheClock?current=' + this.data.pageNum + "&size=20";
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
    postItem.icon = encodeURIComponent(postItem.icon);
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
// pages/post/post.js
import Poster from '../../miniprogram_dist/poster/poster';
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isClickable: true,
    daka:'',
    type:'',
    image:[]
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
  getTags: function () {
    var that = this;
    var url =  app.globalData.URL+'tag';
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
  radioChange: function (e) {
    console.log('radio携带value值为：', e.detail.value);
    this.setData({
      type: e.detail.value
    });
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
            url:  app.globalData.URL+'upload', 
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
              url:  app.globalData.URL+'punchTheClock',
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
                  that.onCreatePoster();
                  wx.showToast({
                    title: '打卡成功',
                    icon: 'success',
                    duration: 1000
                  })
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
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getTags();
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
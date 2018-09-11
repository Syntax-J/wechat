// pages/rule/rule.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    times:-1,
    logged: false,
    takeSession: false,
    requestResult: '',
    isDoneResText: ""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    //   app.globalData.logged = true;
    // } else if (this.data.canIUse) {
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //     app.globalData.logged = true;
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //       app.globalData.logged = true;
    //     }
    //   })
    // }
  },
log(){
  console.log(1)
},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // let that = this;
    // let db = wx.getStorageSync("userInfo")
    // console.log(db)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if(app.globalData.logged)
    {
      let that = this;
      let id = app.globalData.id;
       console.log(id)
      wx.request({
        url: config.service.getResultUrl,
        method: 'POST',
        data: {
          open_id: id
        },
        success(res) {
          console.log(res)
          let temp = res.data.data.success_time[0].succession_time;
          that.setData({
            times: temp
          })
        }
      })
    }
    
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

  },
  getUserInfo: function (e) {
    let that=this;
    wx.showLoading();
    wx.setStorageSync("userInfo", e.detail.userInfo)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    this.sertUserInfo();
    
    
  },
  sertUserInfo: function () {
    let db = app.globalData.userInfo;

    console.log(db)
    let that=this
    let id = app.globalData.id;
    console.log(id)
    wx.request({
      url: config.service.sertInfoUrl,
      method: "POST",
      data: {
        open_id: id,
        nick_name: db.nickName,
        avatar_url: db.avatarUrl
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        wx.request({
          url: config.service.getResultUrl,
          method: 'POST',
          data: {
            open_id: id
          },
          success(res) {
            let temp = res.data.data.success_time[0].succession_time;
            that.setData({
              times: temp
            })
            app.globalData.logged = true;
            wx.hideLoading();
          }
        })
      },
      fail(res){
        console.log(res)
      }
    })
  },
  askRes: function() {
    let db = wx.getStorageSync("userInfo")
    var that = this
    wx.request({
      url: `${config.service.guessDataUrl}`,
      method: "POST",
      data: {
        open_id: db.openId,
        nick_name: db.nickName,
        avatar_url: db.avatarUrl
      },
      success: res => {
        console.log(res.data.data)
        let data = res.data.data
        // this.setData({
        //   isDoneResText: wx.getStorageSync("userInfo")
        // })
        // 数据还未更新
        if (data.msg == 3) {
          that.setData({
            isDoneResText: "数据还未更新"
          })
        } else if (data.msg !== 3 && data.db_min_result === 0) {
          return that.setData({
            isDoneResText: "本次结果是跌"
          })
        } else if (data.msg !== 3 && data.db_min_result === 1) {
          return that.setData({
            isDoneResText: "本次结果是涨"
          })
        }
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    })
  },

})

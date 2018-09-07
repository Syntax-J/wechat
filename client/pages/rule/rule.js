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
  signIn(){
    wx.login({
      success: res => {
        let code = res.code
        console.log(res)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  clear(){
    wx.clearStorage()
  },
  onLoad: function(options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
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
    // this.askRes()
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
    wx.request({
      url: config.service.getId,
      method: 'POST',
      data: {
        code: app.globalData.code
      },
      success: function (res) {
        wx.setStorageSync("id", res.data.data)
        let a=wx.getStorageSync("id")
        that.sertUserInfo();
        app.globalData.logged = true
      },
    })
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    wx.hideLoading();
    
  },
  sertUserInfo: function () {
    let db = wx.getStorageSync("userInfo")
  
    let id = wx.getStorageSync("id")
    console.log(id.data, db.nickName, db.avatarUrl)
    wx.request({
      url: `${config.service.sertInfoUrl}`,
      method: "POST",
      data: {
        open_id: id.data,
        nick_name: db.nickName,
        avatar_url: db.avatarUrl
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
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

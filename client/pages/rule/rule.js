// pages/rule/rule.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    rules: {
      // title:'HERONODE猜涨跌规则',
      details: [{
          context: '猜中1次得5HER'
        },
        {
          context: '连续猜中5次得500HER'
        },
        {
          context: '连续猜中10次得50000HER'
        },
      ],
      users: {
        avatar: "../static/img/user-unlogin.png",
        userScore: 10
      },
      instrusction: '本活动由HeroNode发起',
      res: "本次未能猜中 继续加油~"
    },
    userInfo: {
      nickName: "请登录"
    },
    logged: false,
    takeSession: false,
    requestResult: '',
    isDoneResText: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
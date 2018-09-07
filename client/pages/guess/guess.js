// pages/guess/guess.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    coinArrays: [{
        msg: "大饼",
        url: "../static/img/0.png"
      },
      {
        msg: "以太",
        url: "../static/img/1.png"
      },
      {
        msg: "柚子",
        url: "../static/img/2.png"
      },
    ],
    /**
     * @modalArrays:页面状态
     * @dayModal:趋势英雄人数模块显示
     * @dayUpNum:趋势英雄人数涨
     * @dayDownNum:趋势英雄人数跌
     */
    modalArrays: [{
        //0:大饼
        dayModal: false,
        dayUpNum: 0,
        dayDownNum: 0,
        dayChoice: -1,
        minChoice: -1,
        minModal: false,
        minUpNum: 0,
        minDownNum: 0
      },
      {
        //1: 以太
        dayModal: false,
        dayUpNum: 0,
        dayDownNum: 0,
        dayChoice: -1,
        minChoice: -1,
        minModal: false,
        minUpNum: 0,
        minDownNum: 0
      },
      { //3:柚子
        dayModal: false,
        dayUpNum: 0,
        dayDownNum: 0,
        dayChoice: -1,
        minChoice: -1,
        minModal: false,
        minUpNum: 0,
        minDownNum: 0
      }
    ],
    /**
     * @rules:规则文本
     */
    rule1: '本活动由Hero Node发起，共有趋势英雄和图表专家两种方式，猜中1次得5HER，连续猜中5次得500HER，连续猜中10次得50000HER。',
    rule2: '趋势英雄每天仅限一次机会猜测涨跌，图表专家每5分钟一次机会猜测涨跌。',
    userInfo: {},
    /**
     * @logged:是否登陆
     */
    takeSession: false,
    requestResult: '',
    /**
     * @_num:当前选择的种类
     */
    _num: 0,
    // variety: 0,
    // gamePlay: 0,
  },
  /**
   * @storage:状态同步本地storage
   */
  storage() {
    wx.setStorage({
      key: "modalArrays",
      data: JSON.stringify(this.data.modalArrays)
    })
  },
  init() {
    /**
     * 初始化/获取页面状态
     */
    let that = this;
    let str0 = `modalArrays[0]`;
    let str1 = `modalArrays[1]`;
    let str2 = `modalArrays[2]`;
    wx.getStorage({
      key: 'modalArrays',
      success: function(res) {
        that.setData({
          [str0]: JSON.parse(res.data)[0],
          [str1]: JSON.parse(res.data)[1],
          [str2]: JSON.parse(res.data)[2]
        })
      },
      fail: function(res) {
        wx.setStorage({
          key: "modalArrays",
          data: JSON.stringify(that.data.modalArrays)
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // wx.hideTabBar();
  },
  // log(){
  //   console.log(1)
  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.getUserInfo();
    // wx.getSetting({
    //   success(res) {
    //     if (!res.authSetting['scope.scope.userInfo']) {
    //       wx.authorize({
    //         scope: 'scope.userInfo',
    //         success() {
    //           // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
    //         }
    //       })
    //     }
    //   }
    // })
     //this.bindGetUserInfo()
    // 初始化录入当前用户信息
     
    /**
     * 初始化/获取页面状态
     */
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (!app.globalData.logged) return
    this.init();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
  },
  // 用户登录示例
  // bindGetUserInfo: function() {
  //   if (app.globalData.logged) return
  //   util.showBusy('正在登录')
  //   const session = qcloud.Session.get()
  //   if (!session) {
  //     // 首次登录
  //     qcloud.login({
  //       success: res => {
  //         let that = this;
  //         console.log(res)
  //         wx.setStorageSync("userInfo", res)
  //         //  app.globalData.userInfo = res;
  //          app.globalData.logged = true;
  //         wx.hideLoading()
  //         util.showSuccess('登录成功')
  //       },
  //       fail: err => {
  //         console.error(err)
  //         let that = this;
  //         wx.hideLoading()
  //         wx.showModal({
  //           title: '登陆失败',
  //           content: '请确认网络状态,单击确认按钮重试',
  //           showCancel: false,
  //           success: function(res) {
  //             if (res.confirm) {
  //               that.bindGetUserInfo();
  //             }
  //           }
  //         })
  //       }
  //     })
  //   } else {
  //     // 第二次登录
  //     // 或者本地已经有登录态
  //     // 可使用本函数更新登录态
  //     qcloud.loginWithCode({
  //       success: res => {
  //         let that = this;
  //         wx.setStorageSync("userInfo", res)
  //         // app.globalData.userInfo=res;
  //         app.globalData.logged = true;
  //         wx.hideLoading()
  //         util.showSuccess('登录成功')
  //       },
  //       fail: err => {
  //         console.error(err)
  //         let that = this;
  //         wx.hideLoading()
  //         wx.showModal({
  //           title: '登陆失败',
  //           content: '请确认网络状态,单击确认按钮重试',
  //           showCancel: false,
  //           success: function(res) {
  //             if (res.confirm) {
  //               that.bindGetUserInfo();
  //             }
  //           }
  //         })
  //       }
  //     })
  //   }
  // },

  // // 切换是否带有登录态
  // switchRequestMode: function(e) {
  //   this.setData({
  //     takeSession: e.detail.value
  //   })
  //   this.doRequest()
  // },

  // doRequest: function() {
  //   util.showBusy('请求中...')
  //   var that = this
  //   var options = {
  //     url: config.service.requestUrl,
  //     login: true,
  //     success(result) {
  //       util.showSuccess('请求成功完成')
  //       console.log('request success', result)
  //       that.setData({
  //         requestResult: JSON.stringify(result.data)
  //       })
  //     },
  //     fail(error) {
  //       util.showModel('请求失败', error);
  //       console.log('request fail', error);
  //     }
  //   }
  //   if (this.data.takeSession) { // 使用 qcloud.request 带登录态登录
  //     qcloud.request(options)
  //   } else { // 使用 wx.request 则不带登录态
  //     wx.request(options)
  //   }
  // },

  // 选择种类
  selectTab: function(e) {
    if (!app.globalData.logged) return
    let idx = e.currentTarget.dataset.index;
    this.setData({
      _num: e.currentTarget.dataset.index,
      variety: idx
    })
    console.log("当前种类：" + this.data.variety);
  },

  //   wx.showModal({
  //     title: '提示',
  //     content: `您确定选择${tip + kind}？`,
  //     success: function(res) {
  //       if (res.confirm) {
  //         // 接口数据处理
  //         console.log('用户选择了' + kind + method + "!")
  //         let db = wx.getStorageSync("userInfo")
  //         wx.request({
  //           url: `${config.service.guessDataUrl}`,
  //           method: "POST",
  //           data: {
  //             open_id: db.openId,
  //             nick_name: db.nickName,
  //             avatar_url: db.avatarUrl,
  //             variety: idx,
  //             gamePlay: method,
  //             guess: kind
  //           },
  //           header: {
  //             'content-type': 'application/json' // 默认值
  //           },
  //           success(res) {
  //             console.log(res)
  //           }
  //         })
  //       } else if (res.cancel) {
  //         // console.log('用户点击取消')
  //       }
  //     }
  //   })
  // },
  // 初始化录入用户信息
  sertUserInfo: function () {
    let db = wx.getStorageSync("userInfo")
    console.log(db)
    wx.request({
      url: `${config.service.sertInfoUrl}`,
      method: "POST",
      data: {
        open_id: db.openId,
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
  select(e) {
    // this.setData({
    //   maskShow: !this.data.maskShow
    // })
    if (!app.globalData.logged) return
    const dataset = e.currentTarget.dataset;
    const data = JSON.parse(dataset.type)
    let that=this;
    wx.showModal({
      title: '提示',
      content: `确定选择${ data.time == 1 ? ' 趋势英雄 ' : ' 图表专家 ' }${that.data.coinArrays[that.data._num].msg}${data.type==1 ?' 涨 ':' 跌 '}?`,
      success: function (res) {
        if (res.confirm){
          that.selectThen(data.time, data.type)
          } else if(res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    // switch (this.data._num) {
    //   case 0:
    //     console.log('btc');
    //     this.selectThen(data.time, data.type)
    //     break;
    //   case 1:
    //     console.log('eth');
    //     this.selectThen(data.time, data.type)
    //     break;
    //   case 2:
    //     console.log('eos');
    //     this.selectThen(data.time, data.type)
    //     break;
    // }
  },
  selectThen(time, types) {
    //------请求获取人数--1day 1up----
    let dayUpchoices = `modalArrays[${this.data._num}].dayUpNum`;
    let dayDownchoices = `modalArrays[${this.data._num}].dayDownNum`;
    let minUpchoices = `modalArrays[${this.data._num}].minUpNum`;
    let minDownchoices = `modalArrays[${this.data._num}].minDownNum`
    let db = wx.getStorageSync("userInfo")
    let id = wx.getStorageSync("id")
    let that = this;
    wx.request({
      url: `${config.service.guessDataUrl}`,
      method: "POST",
      data: {
        open_id: id.data,
        nick_name: db.nickName,
        avatar_url: db.avatarUrl,
        variety: 0,
        gamePlay: 0,
        guess: 0
      },
      success(res) {
        console.log(res)
      }
    })
        // this.setData({
        //   [dayUpchoices]: 3,
        //   [dayDownchoices]: 7
        // })
        // this.storage();
    switch (time) {
      case 0:
        switch (types) {
          case 0:
           console.log('min down')
           break
          case 1:
            console.log('min up')
            break
        }
        break
      case 1: 
        switch (types) {
          case 0:
            console.log('day down')
            break
          case 1:
            console.log('day up')
            break
        }
        break 
     }
    //   },
    // })
        //------日猜请求up获取人数------
  }
})

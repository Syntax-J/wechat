// pages/guess/guess.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

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
    modalArrays:[{
      //0:大饼
      dayModal:false,
      dayUpNum:1,
      dayDownNum:2,
      minModal: false,
      minUpNum: 3,
      minDownNum: 4
    },
    {
      //1: 以太
      dayModal: false,
      dayUpNum: 5,
      dayDownNum: 6,
      minModal: false,
      minUpNum: 7,
      minDownNum: 8
    },
    { //3:柚子
      dayModal: false,
      dayUpNum: 9,
      dayDownNum: 10,
      minModal: false,
      minUpNum: 11,
      minDownNum: 12
    }],
    rule1: '本活动由Hero Node发起，共有趋势英雄和图表专家两种方式，猜中1次得5HER，连续猜中5次得500HER，连续猜中10次得50000HER。',
    rule2: '趋势英雄每天仅限一次机会猜测涨跌，图表专家每5分钟一次机会猜测涨跌。',
    userInfo: {
      nickName: "请登录"
    },
    logged: false,
    takeSession: false,
    requestResult: '',
    _num: 0,
    variety: 0,
    gamePlay: 0,
    btnHideDay:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
log(){
  console.log(1)
},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
      // this.bindGetUserInfo()
    // // 初始化录入当前用户信息
    // this.sertUserInfo()
    wx.getSystemInfo({
      success: function(res) {
        console.log(res.windowHeight)
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

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
  // 用户登录示例
  bindGetUserInfo: function() {
    if (this.data.logged) return

    util.showBusy('正在登录')

    const session = qcloud.Session.get()

    if (!session) {
      // 首次登录
      qcloud.login({
        success: res => {
          console.log(res)
          wx.setStorageSync("userInfo", res)
          this.setData({
            userInfo: res,
            logged: true
          })
          wx.hideLoading()
          util.showSuccess('登录成功')
        },
        fail: err => {
          console.error(err)
          let that = this;
          wx.hideLoading()
          wx.showModal({
            title: '登陆失败',
            content: '请确认网络状态,单击确认按钮重试',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                that.bindGetUserInfo();
              }
            }
          })
        }
      })
    } else {
      // 第二次登录
      // 或者本地已经有登录态
      // 可使用本函数更新登录态
      qcloud.loginWithCode({
        success: res => {
          console.log(res)
          wx.setStorageSync("userInfo", res)
          this.setData({
            userInfo: res,
            logged: true
          })
          wx.hideLoading()
          util.showSuccess('登录成功')
        },
        fail: err => {
          console.error(err)
          let that=this;
          // util.showModel('登录错误','请确认网络状态,单击确认按钮重试')

          // wx.showToast();
          wx.hideLoading()
          wx.showModal({
            title: '登陆失败',
            content: '请确认网络状态,单击确认按钮重试',
            showCancel:false,
            success: function (res) {
              if (res.confirm) {
                that.bindGetUserInfo();
              }
            }
          })
        }
      })
    }
  },

  // 切换是否带有登录态
  switchRequestMode: function(e) {
    this.setData({
      takeSession: e.detail.value
    })
    this.doRequest()
  },

  doRequest: function() {
    util.showBusy('请求中...')
    var that = this
    var options = {
      url: config.service.requestUrl,
      login: true,
      success(result) {
        util.showSuccess('请求成功完成')
        console.log('request success', result)
        that.setData({
          requestResult: JSON.stringify(result.data)
        })
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    }
    if (this.data.takeSession) { // 使用 qcloud.request 带登录态登录
      qcloud.request(options)
    } else { // 使用 wx.request 则不带登录态
      wx.request(options)
    }
  },

  // 选择种类
  selectTab: function(e) {
    let idx = e.currentTarget.dataset.index;
    this.setData({
      _num: e.currentTarget.dataset.index,
      variety: idx
    })
    console.log("当前种类：" + this.data.variety);
  },

  // select up or down events
  selectItem: function(dt) {
    let kind = "";
    let method = "";
    if (dt.cls == "up") {
      kind = 1
    } else {
      kind = 0
    }
    if (dt.method == "day") {
      method = 1,
        this.setData({
          gamePlay: 1
        })
    } else {
      method = 0,
        this.setData({
          gamePlay: 0
        })
    }
    let idx = this.data.variety;
    let tip = "大饼";
    switch (idx) {
      case 0:
        tip = "大饼";
        console.log("大饼");
        break;
      case 1:
        tip = "子弹";
        console.log("子弹");
        break;
      case 2:
        tip = "柚子";
        console.log("柚子");
        break;
    }
    wx.showModal({
      title: '提示',
      content: `您确定选择${tip + kind}？`,
      success: function(res) {
        if (res.confirm) {
          // 接口数据处理
          console.log('用户选择了' + kind + method + "!")
          let db = wx.getStorageSync("userInfo")
          wx.request({
            url: `${config.service.guessDataUrl}`,
            method: "POST",
            data: {
              open_id: db.openId,
              nick_name: db.nickName,
              avatar_url: db.avatarUrl,
              variety: idx,
              gamePlay: method,
              guess: kind
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              console.log(res)
            }
          })
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },

  selectUp: function(e) {
    let method = e.currentTarget.dataset.method;
    let cls = e.currentTarget.dataset.cls;
    let dt = {
      method: method,
      cls: cls
    }
    this.selectItem(dt);
  },

  selectDown: function(e) {
    let method = e.currentTarget.dataset.method;
    let cls = e.currentTarget.dataset.cls;
    let dt = {
      method: method,
      cls: cls
    }
    this.selectItem(dt);
  },
  // 初始化录入用户信息
  sertUserInfo: function() {
    let db = wx.getStorageSync("userInfo")
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
    const dataset=e.currentTarget.dataset;
    const data = JSON.parse(dataset.type)
    console.log(data)
    switch (this.data.variety){
      case 0:
        console.log('btc');
        this.selectThen(data.time,data.type)
        break;
      case 1:
        console.log('eth');
        this.selectThen(data.time, data.type)
        break;
      case 2:
        console.log('eos');
        this.selectThen(data.time, data.type)
        break;
    }
  },
  selectThen(time,types){
    switch (time){
      case "day":
        console.log("day");
        let dayTemp=`modalArrays[${this.data._num}].dayModal`;
        this.setData({
          [dayTemp]:true
        })
        //------获取人数------
        // let nums = `modalArrays[${this.data._num}].dayUpNum`;
        // let that =this;
        // wx.request({
        //   url: '',
        //   method: 'GET',
        //   dataType: 'json',
        //   responseType: 'text',
        //   success: function(res) {
        //     let data=res.data.result[0].time
        //     console.log()
        //     that.setData({
        //       [nums]: data-1536046080000
        //     })
        //     },
        // })
        //------获取人数------
        switch(types){
          case "up":
            console.log("up");
            break;
          case "down":
            console.log("down")
            break;
        }
      break;
      case "min":
        console.log("min");
        let minTemp = `modalArrays[${this.data._num}].minModal`;
        this.setData({
          [minTemp]: true
        })
        switch (types) {
          case "up":
            console.log("up");
            break;
          case "down":
            console.log("down")
            break;
        }
      break;      
    }
  }
})

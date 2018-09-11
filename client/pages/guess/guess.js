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
        msg: "姨太",
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
    rule1: '1、永不离场，哪怕玩一玩下面的小游戏，不放弃就有希望，放弃了你就是nothing。',
    rule2: '2、持续关注，在别人恐慌的时候要兴奋，在别人疯狂的时候要冷静。',
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
    flags:{}
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
    let id = app.globalData.id;
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
        wx.request({
          url: config.service.getFlag,
          method: "POST",
          data: {
            open_id: id,
          },
          success(res) {
            console.log(res)
            let temp = res.data.data.showFlag[0]
            console.log(temp)
            let dbDay = `modalArrays[0].dayModal`
            let dbMin = `modalArrays[0].minModal`
            let zdDay = `modalArrays[1].dayModal`
            let zdMin = `modalArrays[1].minModal`
            let yzDay = `modalArrays[2].dayModal`
            let yzMin = `modalArrays[2].minModal`

            let dbdayUp = `modalArrays[0].dayUpNum`;
            let dbdayDown = `modalArrays[0].dayDownNum`;
            let dbminUp = `modalArrays[0].minUpNum`;
            let dbminDown = `modalArrays[0].minDownNum`

            let zddayUp = `modalArrays[1].dayUpNum`;
            let zddayDown = `modalArrays[1].dayDownNum`;
            let zdminUp = `modalArrays[1].minUpNum`;
            let zdminDown = `modalArrays[1].minDownNum`

            let yzdayUp = `modalArrays[2].dayUpNum`;
            let yzdayDown = `modalArrays[2].dayDownNum`;
            let yzminUp = `modalArrays[2].minUpNum`;
            let yzminDown = `modalArrays[2].minDownNum`
            if (temp.db_min_flag == 0 || temp.db_min_flag == 3) {
              that.setData({
                [dbMin]: false,
                [dbminUp]:0,
                [dbminDown]: 0
              })
              that.storage();
            }
            if (temp.db_day_flag == 0 || temp.db_day_flag == 3) {
              that.setData({
                [dbDay]: false,
                [dbdayUp]: 0,
                [dbdayDown]: 0
              })
              that.storage();
            }
            if (temp.zd_min_flag == 0 || temp.zd_min_flag == 3) {
              that.setData({
                [zdMin]: false,
                [zdminUp]: 0,
                [zdminDown]: 0
              })
              that.storage();
            }
            if (temp.zd_day_flag == 0 || temp.zd_day_flag == 3) {
              that.setData({
                [zdDay]: false,
                [zddayUp]: 0,
                [zddayDown]: 0
              })
              that.storage();
            }
            if (temp.yz_min_flag == 0 || temp.yz_min_flag == 3) {
              that.setData({
                [yzMin]: false,
                [yzminUp]: 0,
                [yzminDown]: 0
              })
              that.storage();
            }
            if (temp.yz_day_flag == 0 || temp.yz_day_flag == 3) {
              that.setData({
                [yzDay]: false,
                [yzdayUp]: 0,
                [yzdayDown]: 0
              })
              that.storage();
            }
          }
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
    if (app.globalData.logged) 
    {

    let idx = e.currentTarget.dataset.index;
    this.setData({
      _num: e.currentTarget.dataset.index,
      variety: idx
    })
    // console.log("当前种类：" + this.data.variety);
    }else{
      wx.showModal({
      showCancel:false,
      title: '提示',
      content: `请先登录`,
      success: function(res) {
      }    
    })
    }
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
  // sertUserInfo: function () {
  //   let db = wx.getStorageSync("userInfo")
  //   console.log(db)
  //   wx.request({
  //     url: `${config.service.sertInfoUrl}`,
  //     method: "POST",
  //     data: {
  //       open_id: db.openId,
  //       nick_name: db.nickName,
  //       avatar_url: db.avatarUrl
  //     },
  //     header: {
  //       'content-type': 'application/json' // 默认值
  //     },
  //     success(res) {
  //       console.log(res)
  //     }
  //   })
  // },
  select(e) {
    // this.setData({
    //   maskShow: !this.data.maskShow
    // })
    if (app.globalData.logged) {
      const dataset = e.currentTarget.dataset;
      const data = JSON.parse(dataset.type)
      // console.log(this.data.flags, data.time)
      // if (this.data.flags.db_min_flag==1&&data.time==0){
      //   wx.showModal({
      //     showCancel:false,
      //     title: '提示',
      //     content: `您已经猜过了请稍等`,
      //     success: function (res) {
      //       console.log('ban')
      //     }
      //   })
      // }
      let that = this;
      wx.showModal({
        title: '提示',
        content: `确定选择${data.time == 1 ? ' 趋势英雄 ' : ' 图表专家 '}${that.data.coinArrays[that.data._num].msg}${data.type == 1 ? ' 涨 ' : ' 跌 '}?`,
        success: function (res) {
          if (res.confirm) {
            that.selectThen(data.time, data.type)
          } else if (res.cancel) {
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
    }else{
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: `请先登录`,
        success: function (res) {
        }
      })
    }
 
  },
  selectThen(time, types) {
    //------请求获取人数--1day 1up----
    let dayUpchoices = `modalArrays[${this.data._num}].dayUpNum`;
    let dayDownchoices = `modalArrays[${this.data._num}].dayDownNum`;
    let minUpchoices = `modalArrays[${this.data._num}].minUpNum`;
    let minDownchoices = `modalArrays[${this.data._num}].minDownNum`
    let openDayModal = `modalArrays[${this.data._num}].dayModal`
    let openMinModal = `modalArrays[${this.data._num}].minModal`
    let db = app.globalData.userInfo;
    let id = app.globalData.id;
    let that = this;
    wx.request({
      url: `${config.service.guessDataUrl}`,
      method: "POST",
      data: {
        open_id: id,
        nick_name: db.nickName,
        avatar_url: db.avatarUrl,
        variety: that.data._num,
        gamePlay: time,
        guess: types
      },
      success(res) {
        console.log(res)
        let _up=res.data.data.selectUp
        let _down = res.data.data.selectDown
        if (types == 0) { _down++}
        if (types == 1) { _up++ }
        console.log(_up)
        console.log(_down)
        switch (time) {
          case 0:
            that.setData({
              [openMinModal]: true,
              [minUpchoices]:_up,
              [minDownchoices]:_down
            })
            that.storage();
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
            that.setData({
              [openDayModal]: true,
              [dayUpchoices]: _up,
              [dayDownchoices]: _down
            })
            that.storage();
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
      }
    })
        // this.setData({
        //   [dayUpchoices]: 3,
        //   [dayDownchoices]: 7
        // })
        // this.storage();
    //   },
    // })
        //------日猜请求up获取人数------
  }
})

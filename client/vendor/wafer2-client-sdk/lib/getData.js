var constants = require('./constants');
var Session = require('./session');

const noop = function noop() { }
const defaultOptions = {
  method: 'GET',
  success: noop,
  fail: noop,
  url: "https://api.bibox365.com/v1/mdata?cmd=kline&pair=BIX_BTC&period=5min&size=1",
  req: ""
}

function getData(opts) {
  opts = Object.assign({}, defaultOptions, opts)
  // 请求服务器登录地址，获得会话信息
  wx.request({
    url: opts.url,
    // header: header,
    method: opts.method,
    success(result) {
      const data = result.data;
      // if (!data || data.code !== 0 || !data.data || !data.data.skey) {
      //   return opts.fail(`响应错误，${JSON.stringify(data)}`)
      // }
      // const res = data.data
      // console.log(data.result)
      // if (!res || !res.userinfo) {
      //   return opts.fail(new Error(`登录失败(${data.error})：${data.message}`))
      // }
      // 成功地响应会话信息
      Session.set(data)
      opts.success(data)
    },
    fail(err) {
      console.error('登录失败，可能是网络错误或者服务器发生异常')
      opts.fail(err)
    }
  });
}

module.exports = { getData }
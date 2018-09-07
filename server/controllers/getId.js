// 获取当前用户连续猜中次数接口
const {
  mysql
} = require("../qcloud")
var https = require('https');
const appId = "wxaee013ad4192177c";
const appSecret = "f821f2a4fb5a8f685ea7843ef65c55dd"
function reqId(code) {
  return new Promise(function (resolve, reject) {
    https.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`, function (req, res) {
      var html = '';
      req.on('data', function (data) {
        html += data;
      });
      req.on('end', function () {
        resolve(JSON.parse(html))
      });
    });
  });
}
module.exports = async ctx => {
  
  let req = ctx.request.body
  // 从前台获取当前用户id
  let code = req.code
  let data=await reqId(code);
  ctx.state.data = {
    data: data.openid,
  }
}
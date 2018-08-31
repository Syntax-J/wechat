// var https = require('https');

// module.exports = async ctx => {

//   //获取服务端时间
//   const timestamp = Date.parse(new Date());

//   //请求api为了得到前一个旧的五分钟
//   const result = await getData();

//   //获取api json
//   const Json = JSON.parse(result)

//   //json里的数组
//   const Array = Json.result[0]

//   //数组里的时间戳
//   const oldTime = Array.time
  
//   //计算出下一个未来接近的五+(安全时间)分钟
//   const tick = 1.5 * 60 * 1000 + (5 * 60 * 1000 - (timestamp - oldTime))
//   ctx.body = {
//     timestamp: timestamp,
//     tick: tick
//   }
// }
// function getData() {
//   return new Promise((resolve, reject) => {
//     https.get('https://api.bibox365.com/v1/mdata?cmd=kline&pair=BIX_BTC&period=5min&size=1', function (req, res) {
//       var html = '';
//       req.on('data', function (data) {
//         html += data;
//       });
//       req.on('end', function () {
//         resolve(html)
//       });
//     });
//   })
// }
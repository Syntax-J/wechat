// var https = require('https');

// module.exports = async ctx => {
//   const result = await getData();

//   ctx.state.data = {
//     result: result,
//     req: ctx.query //ctx.request.body POST 
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
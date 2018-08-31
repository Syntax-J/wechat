const {
  mysql
} = require("../qcloud")

var https = require('https')

// 定义全局变量   接口动作执行数据自动执行
var ApiRes
var ApiResTime
var guessResult //  0 or 1    0:涨   1:跌

// 定义返回数据结果字段的变量 0: down 1: up 3: 未更新
var minRes 

// 定时从外部API获取新的数据（1min）
async function reqData() {
  new Promise((resolve, reject) => {
      https.get('https://api.bibox365.com/v1/mdata?cmd=kline&pair=BIX_BTC&period=1min&size=1', function(req, res) {
          var html = '';
          req.on('data', function(data) {
            html += data;
          });
          req.on('end', function() {
              ApiRes = JSON.parse(html).result[0]
              ApiResTime = JSON.parse(html).result[0].time
              let open = ApiRes.open
              let close = ApiRes.close
              let low = ApiRes.low
              let high = ApiRes.high
              // console.log(ApiResTime)
              // 判断涨跌
              if (parseInt(close - open) == 0) {
                if (parseInt(high - open) < parseInt(open - low)) {
                // console.log("涨")
                guessResult = 1
              } else {
                // console.log("跌")
                guessResult = 0
              }
            } else if (parseInt(close - open) > 0) {
              // console.log("涨")
              guessResult = 1
            } else if (parseInt(close - open) < 0) {
              // console.log("跌")
              guessResult = 0
            }
            resolve(html)
          })
      })
  })
}
reqData()
setInterval(reqData, 1000)

module.exports = async ctx => {

  var req = ctx.request.body

  // 获取当前用户的open_id
  var openId = req.open_id

  // 获取当前用户选择的种类和玩法
  var variety = req.variety
  var gamePlay = req.gamePlay
  var guess = req.guess
  // 利用从前端获取的以上三个值  来定义一个新变量 
  // 使得公共方法得以使用 即是不同的字段在json中的key以变量的形式展现出来
  var kindFlag = {}
  // 动态bind Json对象 使得不同的玩法  复用一个函数  此对象为api数据未更新
  var sqlDt = {}
  // 动态bind Json对象 使得不同的玩法  复用一个函数  此对象为api数据已更新
  var sqlUpdateDt = {}
  var flag1 = "db_min_flag"
  var flag2 = "db_day_flag"
  var flag3 = "zd_min_flag"
  var flag4 = "zd_day_flag"
  var flag5 = "yz_min_flag"
  var flag6 = "yz_day_flag"
  var value1 = 0
  var value2 = 1
  var kind_res1 = "db_min_result"
  var kind_res2 = "db_day_result"
  var kind_res3 = "zd_min_result"
  var kind_res4 = "zd_day_result"
  var kind_res5 = "yz_min_result"
  var kind_res6 = "yz_day_result"
  var reqTime = "db_min_req_time"

  var open_id = "open_id"
  var openIdVal = openId
  var openIdDt = {}
  openIdDt[open_id] = openIdVal
  // 用户点击手动获取当前flag是否为1（数据是否更新，不写在定时器里面）
  var req = await mysql.select().from('cUserInfo').where(openIdDt)

    // 定时查询数据库反应时间与上次外部API的时间戳是否一致 若一致则更新
  async function getData() {
    let timer = req[0].db_min_req_time
    // 首先先判断本次用户所点击的种类是什么(0 1 2)
    // 其次获取本次点击的玩法是什么(0 1)
    // 然后获取本次用户猜测的是(0 1)
    // json对象化动态binding 先设sqlDt为空
    switch(variety) {
      case 0: 
        if (gamePlay == 0) {
          // 用户选择的是db_min
          kindFlag[variety + gamePlay] = flag1
          if (guess == 0) {
            sqlDt = {}
            sqlUpdate = {}
            sqlUpdateDt[kind_res1] = guessResult
            sqlDt[flag1] = value1
          } else {
            sqlDt = {}
            sqlUpdate = {}
            sqlUpdateDt[kind_res1] = guessResult
            sqlDt[flag1] = value2
          }
        } else {
          // 用户选择的是db_day
          kindFlag[variety + gamePlay] = flag2
          if (guess == 0) {
            sqlDt = {}
            sqlUpdate = {}
            sqlUpdateDt[kind_res2] = guessResult
            sqlDt[flag2] = value1
          } else {
            sqlDt = {}
            sqlUpdate = {}
            sqlUpdateDt[kind_res2] = guessResult
            sqlDt[flag2] = value2
          }
        }
      break;
      case 1: 
        if (gamePlay == 0) {
          // 用户选择的是zd_min
          kindFlag[variety + gamePlay] = flag3
          if (guess == 0) {
            sqlDt = {}
            sqlUpdate = {}
            sqlUpdateDt[kind_res3] = guessResult
            sqlDt[flag3] = value1
          } else {
            sqlDt = {}
            sqlUpdate = {}
            sqlDt[kind_res3] = guessResult
            sqlDt[flag3] = value2
          }
        } else {
          // 用户选择的是zd_day
          kindFlag[variety + gamePlay] = flag4
          if (guess == 0) {
            sqlDt = {}
            sqlUpdate = {}
            sqlUpdateDt[kind_res4] = guessResult
            sqlDt[flag4] = value1
          } else {
            sqlDt = {}
            sqlUpdate = {}
            sqlUpdateDt[kind_res4] = guessResult
            sqlDt[flag4] = value2
          }
        }
      break;
      case 2: 
        if (gamePlay == 0) {
          // 用户选择的是yz_min
          kindFlag[variety + gamePlay] = flag5
          if (guess == 0) {
            sqlDt = {}
            sqlUpdate = {}
            sqlUpdateDt[kind_res5] = guessResult
            sqlDt[flag5] = value1
          } else {
            sqlDt = {}
            sqlUpdate = {}
            sqlUpdateDt[kind_res5] = guessResult
            sqlDt[flag5] = value2
          }
        } else {
          // 用户选择的是yz_day
          kindFlag[variety + gamePlay] = flag6
          if (guess == 0) {
            sqlDt = {}
            sqlUpdate = {}
            sqlUpdateDt[kind_res6] = guessResult
            sqlDt[flag6] = value1
          } else {
            sqlDt = {}
            sqlUpdate = {}
            sqlUpdateDt[kind_res6] = guessResult
            sqlDt[flag6] = value2
          }
        }
      break;
    }
    
    console.log(timer)
    console.log("分隔符")
    console.log(ApiResTime)
    if (timer == ApiResTime) {
      await  mysql("cUserInfo").update(sqlDt).where(openIdDt)
    } else if (timer == "" || timer == null || timer < ApiResTime) {
      // 此处数据暂无  或已更新  返回guessresult结果
      timer = ApiResTime
      sqlUpdateDt[reqTime] = ApiResTime
      await mysql("cUserInfo").update(sqlUpdateDt).where(openIdDt)
    }

    var kind_flag = req[0][kindFlag[variety + gamePlay]]
    // console.log(kind_flag)
    if (kind_flag == 1) {
      // 此处数据暂无  或已更新  返回到前端结果  并将kind_flag重置为0
      // minRes = guessResult
      minRes = 33
      // minRes = "数据已经更新 设置flag为0"
      await mysql("cUserInfo").update(sqlDt).where(openIdDt)
    } else if (kind_flag == 0) {
      // 此处数据还未更新  不返回结果
      minRes = 3333
    }
  }

  // 执行操作数据库  
  getData()
  setInterval(getData, 1000)


  // guessResult === 0 跌  === 1 涨   对比数据库两个字段：guess 和 result 是否一致  若一致 返回 前台猜中  若不一致 则返回未猜中  并update 当前一次is_done字段对应的值  
  ctx.state.data = {
    msg: minRes,
    data: req,
    db_min_result: guessResult,
    gamePlay: gamePlay,
    variety: variety,
    guess: guess
  }
}
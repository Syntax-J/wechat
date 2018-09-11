const {
  mysql
} = require("../qcloud")
// mysql 字段  tinyInt类型 初始化为3  0为否  1为是

var https = require('https')
var iconv = require("iconv-lite");

// 定义返回数据结果字段的变量 0: down 1: up 3: 未更新
// var minRes
// 前端返回字段的结果(异步)
module.exports = async ctx => {
  // 定义全局变量 接口动作执行数据自动执行
  var ApiRes
  var ApiResTime
  var guessResult // 0:涨   1:跌

  var req = ctx.request.body

  // 定义获取外部接口URL    /* url对应的时间字段未更改 */
  var url = 'https://api.bibox365.com/v1/mdata?cmd=kline&pair=BIX_BTC&period=5min&size=1'

  // 获取当前用户的open_id
  var openId = req.open_id

  // 获取当前用户选择的种类和玩法
  var variety = req.variety
  var gamePlay = req.gamePlay
  var guess = req.guess
  // 利用从前端获取的以上三个值 来定义一个新变量

  // 使得公共方法得以使用 即是不同的字段在json中的key以变量的形式展现出来
  var kindFlag = {}
  // 动态bind Json对象 使得不同的玩法  复用一个函数  此对象为api数据已更新
  var sqlUpdateDt = {}
  // 定义当前用户所点击对应的币种及玩法的猜测选项
  var sqlGuessDt = {}
  var flag1 = "db_min_flag"
  var flag2 = "db_day_flag"
  var flag3 = "zd_min_flag"
  var flag4 = "zd_day_flag"
  var flag5 = "yz_min_flag"
  var flag6 = "yz_day_flag"
  var kind_guess1 = "db_min_guess"
  var kind_guess2 = "db_day_guess"
  var kind_guess3 = "zd_min_guess"
  var kind_guess4 = "zd_day_guess"
  var kind_guess5 = "yz_min_guess"
  var kind_guess6 = "yz_day_guess"
  var kind_res1 = "db_min_result"
  var kind_res2 = "db_day_result"
  var kind_res3 = "zd_min_result"
  var kind_res4 = "zd_day_result"
  var kind_res5 = "yz_min_result"
  var kind_res6 = "yz_day_result"
  var dbMinReqTime = "db_min_req_time"
  var dbDayReqTime = "db_day_req_time"
  var zdMinReqTime = "zd_min_req_time"
  var zdDayReqTime = "zd_day_req_time"
  var yzMinReqTime = "yz_min_req_time"
  var yzDayReqTime = "yz_day_req_time"
  // 定义变量  初始化默认定义为第一种的第一个玩法
  var reqTime = dbMinReqTime
  var kind_guess = kind_guess1
  var result = kind_res1
  var flag = flag1

  var open_id = "open_id"
  var openIdVal = openId
  var openIdDt = {}
  openIdDt[open_id] = openIdVal

  // 首先先判断本次用户所点击的种类是什么(0 1 2)
  // 其次获取本次点击的玩法是什么(0 1)
  // 然后获取本次用户猜测的是(0 1)
  // json对象化动态binding 先设sqlDt为空
  switch (variety) {
    case 0:
      if (gamePlay == 0) {
        // 用户选择的是db_min
        flag = flag1
        kindFlag[flag] = 0
        url = 'https://api.bibox365.com/v1/mdata?cmd=kline&pair=BTC_USDT&period=5min&size=1'
        reqTime = dbMinReqTime
        kind_guess = kind_guess1
        result = kind_res1
        if (guess == 0) {
          sqlUpdateDt = {}
          sqlGuessDt[kind_guess] = 0
        } else {
          sqlUpdateDt = {}
          sqlGuessDt[kind_guess] = 1
        }
      } else {
        // 用户选择的是db_day
        flag = flag2
        kindFlag[flag] = 0
        url = 'https://api.bibox365.com/v1/mdata?cmd=kline&pair=BTC_USDT&period=day&size=1'
        reqTime = dbDayReqTime
        kind_guess = kind_guess2
        result = kind_res2
        if (guess == 0) {
          sqlUpdateDt = {}
          sqlGuessDt[kind_guess] = 0
        } else {
          sqlUpdateDt = {}
          sqlGuessDt[kind_guess] = 1
        }
      }
      break;
    case 1:
      if (gamePlay == 0) {
        // 用户选择的是zd_min
        url = 'https://api.bibox365.com/v1/mdata?cmd=kline&pair=ETH_USDT&period=5min&size=1'
        reqTime = zdMinReqTime
        kind_guess = kind_guess3
        result = kind_res3
        flag = flag3
        kindFlag[flag] = 0
        if (guess == 0) {
          sqlUpdateDt = {}
          sqlGuessDt[kind_guess] = 0
        } else {
          sqlUpdateDt = {}
          sqlGuessDt[kind_guess] = 1
        }
      } else {
        // 用户选择的是zd_day
        url = 'https://api.bibox365.com/v1/mdata?cmd=kline&pair=ETH_USDT&period=day&size=1'
        reqTime = zdDayReqTime
        kind_guess = kind_guess4
        result = kind_res4
        flag = flag4
        kindFlag[flag] = 0
        if (guess == 0) {
          sqlUpdateDt = {}
          sqlGuessDt[kind_guess] = 0
        } else {
          sqlDt = {}
          sqlUpdate = {}
          sqlGuessDt[kind_guess] = 1
        }
      }
      break;
    case 2:
      if (gamePlay == 0) {
        // 用户选择的是yz_min
        url = 'https://api.bibox365.com/v1/mdata?cmd=kline&pair=EOS_USDT&period=5min&size=1'
        reqTime = yzMinReqTime
        kind_guess = kind_guess5
        result = kind_res5
        flag = flag5
        kindFlag[flag] = 0
        if (guess == 0) {
          sqlUpdateDt = {}
          sqlGuessDt[kind_guess] = 0
        } else {
          sqlUpdateDt = {}
          sqlGuessDt[kind_guess] = 1
        }
      } else {
        // 用户选择的是yz_day
        url = 'https://api.bibox365.com/v1/mdata?cmd=kline&pair=EOS_USDT&period=day&size=1'
        reqTime = yzDayReqTime
        kind_guess = kind_guess6
        result = kind_res6
        flag = flag6
        kindFlag[flag] = 0
        if (guess == 0) {
          sqlUpdateDt = {}
          sqlGuessDt[kind_guess] = 0
        } else {
          sqlUpdateDt = {}
          sqlGuessDt[kind_guess] = 1
        }
      }
      break;
  }

  // 获取当前时间戳
  var nowTimer = new Date().getTime()
  console.log("clickTime:"+nowTimer)
  // 定义变量  更新时间
  var updateTime

  var timerTask

  var t

  // 去掉req 只留res 去掉Promise resolve reject 防止异步执行会报错
  // 定时从外部API获取新的数据（5min）
  async function reqData() {
    https.get(url, function (res) {
      var datas = []
      var size = 0
      res.on('data', function (data) {
        datas.push(data)
        size += data.length
      });
      res.on('end', function () {
          var buff = Buffer.concat(datas, size)
          // var html = iconv.decode(buff, "utf8")  //不需要转编码的话,直接tostring
          var html = buff.toString()
          if(html == "") {
            // 当此次返回结果为空的时候  重新请求接口  直至请求成功
            console.log("执行一次为空")
            timerTask = setTimeout(reqData, 0)
          } else {      
            clearTimeout(timerTask)
            // 当返回结果不为空的时候  执行下列函数
            let htmlArr = JSON.parse(html)
            ApiRes = htmlArr.result[0]
            ApiResTime = ApiRes.time
            let open = ApiRes.open
            let close = ApiRes.close
            let low = ApiRes.low
            let high = ApiRes.high
            console.log("apiResTime:" + ApiResTime)
            // 判断涨跌
            if (parseFloat(close - open) == 0) {
              if (parseFloat(high - open) < parseFloat(open - low)) {
                // console.log("涨")
                guessResult = 1
              } else {
                // else 数据没有任何变化的情况下  则为跌
                guessResult = 0
              }
            } else if (parseFloat(close - open) > 0) {
              // console.log("涨")
              guessResult = 1
            } else if (parseFloat(close - open) < 0) {
              // console.log("跌") 
              guessResult = 0
            }
            getData()
            t = setTimeout(getUpdateTime, 0)
          }
      });
    }).on("error", function (err) {
      // Logger.error(err.stack)
      // callback.apply(null)
      console.log("获取数据失败")
    })
  }
  reqData()
  // 定时循环执行
  var r = setInterval(reqData, 60000)

  // 获得数据结果更新时间
  async function getUpdateTime() {
    var date = new Date(ApiResTime)
    if (updateTime == undefined) {
      console.log("当前所需更新的种类是:" + kind_guess)
      if (kind_guess == kind_guess1 || kind_guess == kind_guess3 || kind_guess == kind_guess5) {
        updateTime = date.setMinutes(date.getMinutes() + 10)
      } else if (kind_guess == kind_guess2 || kind_guess == kind_guess4 || kind_guess == kind_guess6) {
        updateTime = date.setDate(date.getDate() + 2)
      }
    } else {
      // 用户上次更新请求时间存起来   定时器循环执行获取apitime  当API时间更新到十分钟后或一天后时  更新结果即可  
      sqlGuessDt[reqTime] = updateTime
      // 首先录入数据库中用户猜测的选择
      clearTimeout(t)
      return await mysql("cUserInfo").update(sqlGuessDt).where(openIdDt)
    }
  }
  // 点击后flag设置为1  即 不可点击
  kindFlag[flag] = 1
  await mysql("cUserInfo").update(kindFlag).where(openIdDt)

  // 定时查询数据库反应时间与上次外部API的时间戳是否一致 若一致则更新 
  async function getData() {
    console.log("updateTime:" + updateTime) 
    console.log(sqlGuessDt)
    // 取数据库中的所需字段
    let myData = await mysql.select(reqTime, flag).from('cUserInfo').where(openIdDt)
    let timer = myData[0][reqTime]
    var kind_flag = myData[0][flag]
    console.log(url)
    console.log("nowTime:"+timer)
    if (ApiResTime == updateTime) {
      // 此处数据已更新  将flag设置为1  succession_time + 1 
      timer = ApiResTime
      sqlUpdateDt[reqTime] = ApiResTime
      sqlUpdateDt[result] = guessResult
      console.log(sqlUpdateDt)
      // 数据已更新  即可将result 和 time 和 flag 一起更新
      await mysql("cUserInfo").update(sqlUpdateDt).where(openIdDt)
        // 比较数据库中当前用户的guess 和 result 是否相等 若相等 successin_time + 1 否则归0
        let guess = await mysql.select(kind_guess).from("cUserInfo").where(openIdDt)
        let guessRes = await mysql.select(result).from("cUserInfo").where(openIdDt)
        guess = guess[0][kind_guess]
        guessRes = guessRes[0][result]
        // 判断当前用户是否猜对 若猜对则返回time+1  只要有一次错误就立即清零
        var success_time = await mysql.select("succession_time").from("cUserInfo").where(openIdDt)
        successTime = parseInt(success_time[0].succession_time)
        if (kind_flag == 1) {
          if (guess == guessRes) {
            successTime += 1
            console.log("当前一次进攻所剩时间为" + successTime)
            await mysql("cUserInfo").update({
              succession_time: successTime
            }).where(openIdDt)
          } else {
            successTime = 0
            await mysql("cUserInfo").update({
              succession_time: 0
            }).where(openIdDt)
            console.log(successTime)
          }
          //  清空数据库相关字段的值
          console.log("将flag设为0,清除定时器")
          clearInterval(r)
          // 对应的flag 设置为 0 req_time 清空  guess result 改回3  清空定时器
          kindFlag[flag] = 0
          await mysql("cUserInfo").update(kindFlag).where(openIdDt)
        } else {
          console.log(kind_flag)
        }
     
    }     
  }
  // 执行操作数据库  
  getData()

  // 获取当前用户选择的币种和相对应的玩法的选择是  展示出当前种类有多少人选涨  多少人选跌
  var selectUpNum = 0
  var selectDownNum = 0
  var count = await mysql.select(kind_guess).from("cUserInfo")
  for (let i = 0; i < count.length; i++) {
    if (count[i][kind_guess] == 1) {
      selectUpNum += 1
    } else if (count[i][kind_guess] == 0) {
      selectDownNum += 1
    }
  }

  // guessResult === 0 跌  === 1 涨 对比数据库两个字段：guess 和 result 是否一致  
  ctx.state.data = {
    data: req,
    // db_min_result: guessResult,
    // gamePlay: gamePlay,
    // variety: variety,
    // guess: guess,
    // count: count,
    selectUp: selectUpNum,  // 当前选择涨的人数
    selectDown: selectDownNum  // 当前选择跌的人数
  }
}
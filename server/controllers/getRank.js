
// 获取排行榜数据接口
const {
  mysql
} = require("../qcloud")

module.exports = async ctx => {
  
  // 先定义一个空数组
  var arr = []
  // 排序函数
  function compare(property) {
    return function (a, b) {
      var value1 = a[property]
      var value2 = b[property]
      return value2 - value1
    }
  }

  // 从数据库中获取当前对应id的用户的猜中次数等相关信息
  var msgWrap = await mysql.select("open_id", "nick_name", "avatar_url", "succession_time").from("cUserInfo")

  for (let i = 0; i < msgWrap.length; i++) {
    arr.push(msgWrap[i])
  }

  var msg = arr.sort(compare('succession_time'))
  console.log(msg)

  ctx.state.data = {
    msg
  }
}
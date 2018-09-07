// 获取当前用户连续猜中次数接口
const {
  mysql
} = require("../qcloud")

module.exports = async ctx => {
  let req = ctx.request.body
  // 从前台获取当前用户id
  let openId = req.open_id

  // 定义对象变量
  let obj = {}
  let open_id = "open_id"
  obj[open_id] = openId

  // 从数据库中获取当前对应id的用户的猜中次数等相关信息
  let successTime = await mysql.select("succession_time").from("cUserInfo").where(obj)
  

  ctx.state.data = {
    success_time: successTime
  }
}
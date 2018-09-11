const {
  mysql
} = require('../qcloud')


// 录入用户信息
module.exports = async ctx => {

  var req = ctx.request.body
  // 获取规则字段数据
  var flag = await mysql.select("db_min_flag", "db_day_flag", "zd_min_flag", "zd_day_flag", "yz_min_flag", "yz_day_flag").from('cUserInfo').where("open_id", req.open_id)

  ctx.state.data = {
    showFlag: flag
  }
}

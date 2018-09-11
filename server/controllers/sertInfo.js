const {
  mysql
} = require('../qcloud')

// const del = require("..timer.js")


// 录入用户信息
module.exports = async ctx => {

  var req = ctx.request.body

  // 先查询数据库是否存在该用户  若存在则update   若不存在则insert
  var openId = await mysql.select("open_id").from("cUserInfo").where("open_id", req.open_id)
  var len = openId.length
  // var result

  // let findIdx = []
  // // 遍历 若存在 push 1 
  // for (let i = 0; i < len; i++) {
  //   if (req.open_id == openId[i].open_id) {
  //     findIdx.push("1")
  //   } else {
  //     findIdx.push("0")
  //   }
  // }

  if (len<=0) {
    // 当前用户第一次登录
    await mysql("cUserInfo").insert({
      open_id: req.open_id,
      nick_name: req.nick_name,
      avatar_url: req.avatar_url
    })
  } else { 
    //  当前用户不是第一次登录 执行update
    await mysql("cUserInfo").update({
      nick_name: req.nick_name,
      avatar_url: req.avatar_url
    }).where("open_id", req.open_id)
  }
  
  // 获取规则字段数据
  var rules = await mysql.select("rule1", "rule2").from('cTextInfo')
  var flag = await mysql.select("db_min_flag", "db_day_flag", "zd_min_flag", "zd_day_flag", "yz_min_flag", "yz_day_flag").from('cUserInfo').where("open_id", req.open_id)

  ctx.state.data = {
    data: ctx.request.body,
    rule: rules,
    showFlag: flag,
    len:len
  }
}

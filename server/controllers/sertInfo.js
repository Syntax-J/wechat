const {
  mysql
} = require('../qcloud')

// const del = require("..timer.js")


// 录入用户信息
module.exports = async ctx => {

  var req = ctx.request.body

  var openId = req.open_id

  // 增
  // var result = await mysql('cTestInfo').insert({
  //   uuid: req.uuid,
  //   create_time: req.create_time,
  //   last_time: req.last_time,
  //   times: req.times,
  //   isDone: req.isDone
  // })

  var openIdArr = []

  // 先查询数据库是否存在该用户  若存在则update   若不存在则insert
  var openId = await mysql.select("open_id").from("cUserInfo")
  var len = openId.length
  var result

  // 遍历
  for (let i = 0; i < len; i++) {
    openIdArr.push(openId[i])
  }
  //*** 若数据库为空直接insert userInfo ***//
  if (openIdArr.length == 0) {
    result = await mysql("cUserInfo").insert({
      open_id: req.open_id,
      nick_name: req.nick_name,
      avatar_url: req.avatar_url,
      // min_guess: "up",
      // day_guess: "down",
      // min_result: 0,
      // day_result: 0,
      // is_done: 1,
      succession_time: "24",

    })
  } else {
    for (let j = 0; j < openIdArr.length; j++) {
      var that = this
      if (req.open_id === openIdArr[j].open_id) {
        // 数据库不为空 但当前用户不是第一次登录 执行update
        result = await mysql("cUserInfo").update({
          // open_id: req.open_id,
          nick_name: req.nick_name,
          avatar_url: req.avatar_url,
          // min_guess: "up",
          // day_guess: "down",
          // min_result: 1,
          // day_result: 0,
          // is_done: 1,
          succession_time: "24" 
        }).where("open_id", req.open_id)
        break
      } else {
        // 数据库不为空  但当前用户第一次登录
        result = await mysql("cUserInfo").insert({
          open_id: req.open_id,
          nick_name: req.nick_name,
          avatar_url: req.avatar_url,
          // min_guess: "up",
          // day_guess: "down",
          // min_result: 1,
          // day_result: 0,
          // is_done: 1,
          succession_time: "111" 
        })
      }
    }
  }

  // 删
  // await mysql("cTestInfo").del().where({
  //   uuid: "KbBry"
  // })

  // 改
  // var result = await mysql('cTestInfo').update({ open_id: 'modify', skey: 'skey=modify' }).where('uuid', "newAdd")

  // 查
  // var result = await mysql.select('uuid', 'create_time').from('cTestInfo')

  ctx.state.data = {
    msg: result,
    data: ctx.request.body
  }
}

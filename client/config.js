/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://x3aphroi.qcloud.la';

var config = {

  // 下面的地址配合云端 Demo 工作
  service: {
    host,
    // 登录地址，用于建立会话
    loginUrl: `${host}/weapp/login`,

    // 测试的请求地址，用于测试会话
    requestUrl: `${host}/weapp/user`,

    // 测试的信道服务地址
    tunnelUrl: `${host}/weapp/tunnel`,

    // 上传图片接口
    uploadUrl: `${host}/weapp/upload`,

    // 测试数据接口
    sertInfoUrl: `${host}/weapp/sertInfo`,

    // 子进程guess接口
    guessDataUrl: `${host}/weapp/guessData`,

    // 获取当前用户连续猜中次数接口
    getResultUrl: `${host}/weapp/getResult`,

    // 获取排行榜数据接口
    getRankUrl: `${host}/weapp/getRank`,
    getId: `${host}/weapp/getId`,
    getFlag: `${host}/weapp/getFlag`
  }
};

module.exports = config;

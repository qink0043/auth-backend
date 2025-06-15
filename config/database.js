const mysql = require("mysql2");

const pool = mysql.createPool({
  user: "root", // 数据库的用户名
  password: "123456", // 数据库的密码
  host: "43.136.72.202", // 数据服务地址
  port: "3306", // 数据库端口号
  database: "vue_auth", // 数据库名称
  dateStrings: true, // 规定查询时间字段的显示形式
});

module.exports = pool.promise()
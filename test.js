// test-db.js
const mysql = require("mysql2/promise");

(async () => {
  try {
    const connection = await mysql.createConnection({
      // host: "43.136.72.202",
      host: "localhost",
      user: "root",
      password: "2004qcq310",
      database: "vue_auth_login",
      port: 3306,
    });

    console.log("✅ 数据库连接成功！");
    await connection.end();
  } catch (error) {
    console.error("❌ 数据库连接失败：", error.message);
  }
})();

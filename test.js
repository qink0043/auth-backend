// test-db.js
const mysql = require("mysql2/promise");

(async () => {
  try {
    const connection = await mysql.createConnection({
      // host: "43.136.72.202",
      host: "127.0.0.1",
      user: "root",
      password: "2004qcq310",
      database: "vue_auth",
      port: 3306,
    });

    console.log("✅ 数据库连接成功！");
    await connection.end();
  } catch (error) {
    console.error("❌ 数据库连接失败：", error.message);
  }
})();

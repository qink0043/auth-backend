const dayjs = require("dayjs");
const db = require("../config/database");

class User {
  constructor(userInfo) {
    this.userInfo = userInfo;
  }
  /**
   *
   * @returns 注册结果
   */
  async register() {
    const { userName, email, password } = this.userInfo;
    const findUserSql = "SELECT * FROM user WHERE userName = ? OR email = ?";
    const data = await db.execute(findUserSql, [userName, email]);
    if (data[0].length > 0) {
      return {
        code: 402,
        msg: "用户已存在",
      };
    }
    const time = dayjs().format("YYYY-MM-DD HH:mm:ss");

    // console.log(userName, email, password, time);
    const addUserSql =
      "INSERT INTO user (userName, email, password, time) VALUES (?, ?, ?, ?)";
    const Info = await db.execute(addUserSql, [
      userName,
      email,
      password,
      time,
    ]);

    return {
      code: 200,
      msg: "注册成功",
      data: {
        userName,
        email,
      },
    };
  }

  static async login(userName) {
    const sql = "SELECT * FROM user WHERE userName = ?";
    return db.execute(sql, [userName]);
  }

  static getUserInfo(userId) {
    const sql = "SELECT * FROM user WHERE id = ?";
    return db.execute(sql, [userId]);
  }
}

module.exports = User;


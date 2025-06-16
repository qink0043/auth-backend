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
    const { userName, email, password, avatar } = this.userInfo
    try {
      const findUserSql = "SELECT * FROM users WHERE userName = ? OR email = ?"
      const data = await db.execute(findUserSql, [userName, email])
      if (data[0].length > 0) {
        return {
          code: 402,
          msg: "用户已存在",
        }
      }
      const time = dayjs().format("YYYY-MM-DD HH:mm:ss")
      const addUserSql =
        "INSERT INTO users (userName, email, password, time, avatar) VALUES (?, ?, ?, ?, ?)"
      await db.query(addUserSql, [
        userName,
        email,
        password,
        time,
        avatar,
      ]);

      return {
        code: 200,
        msg: "注册成功",
        data: {
          userName,
          email,
        },
      };
    } catch (error) {
      return {
        code: 500,
        msg: "注册失败",
      }
    }
  }

  static async login(userName) {
    const sql = "SELECT * FROM users WHERE userName = ?";
    return db.execute(sql, [userName]);
  }

  static getUserInfo(userId) {
    const sql = "SELECT * FROM users WHERE id = ?";
    return db.execute(sql, [userId]);
  }
}

module.exports = User


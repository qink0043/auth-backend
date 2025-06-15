const bcrypt = require("bcrypt");

const UserModel = require("../models/user");

const jwt = require("jsonwebtoken");

const SECRET_KEY = require("../config/jwt");

exports.register = async (req, res) => {
  console.log('请求', req)
  const { userName, email, password } = req.body.params
  console.log(userName, email, password, "接收参数");
  if (!userName || !email || !password) {
    return res.status(401).send({
      code: 401,
      msg: "用户名、邮箱、密码为必填",
    });
  }
  const user = new UserModel({
    userName,
    email,
    password: await bcrypt.hash(password, 10),
  });
  const userInfo = await user.register()
  res.send(userInfo)
}

exports.login = async function (req, res) {
  const { userName, password } = req.body.param
  // console.log(userName, password, "login");
  if (!userName || !password) {
    return res.status(401).send({
      code: 401,
      msg: "用户名密码不能为空",
    })
  }

  const [users, info] = await UserModel.login(userName);
  if (users.length <= 0) {
    res.send({
      code: 401,
      msg: "用户名不存在",
    });
    return;
  }

  const user = users[0];
  // console.log(user.password, bcrypt.hashSync(password, 10));
  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(401).send({
      code: 401,
      msg: "密码错误",
    });
  }

  const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "24h" });
  res.send({
    code: 200,
    msg: "登录成功",
    data: {
      token: token,
      email: user.email,
      userName: user.userName,
    },
  });
};

exports.getUserInfo = async (req, res) => {
  const userId = req.userId;
  // console.log(userId, "userId");
  const [users, rowInfo] = await UserModel.getUserInfo(userId);
  if (users.length <= 0) {
    res.status(404).send({
      code: 404,
      msg: "用户不存在",
    });
  }
  const { userName, email } = users[0];
  res.send({
    code: 200,
    msg: "成功获取用户信息",
    data: {
      userName,
      email,
    },
  });
};


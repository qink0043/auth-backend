const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const UserModel = require("../models/user");
const jwt = require("jsonwebtoken");
const SECRET_KEY = require("../config/jwt");

exports.register = async (req, res) => {
  const { userName, email, password } = req.body.params
  if (!userName || !email || !password) {
    return res.status(401).send({
      code: 401,
      msg: "用户名、邮箱、密码为必填",
    })
  }
  const user = new UserModel({
    userName,
    email,
    password: await bcrypt.hash(password, 10),
    avatar: "http://124.71.198.227:3000/public/avatars/defaultAvatar.png"
  });
  const userInfo = await user.register()
  res.send(userInfo)
}

exports.login = async function (req, res) {
  const { userName, password } = req.body.params
  if (!userName || !password) {
    return res.status(401).send({
      code: 401,
      msg: "用户名密码不能为空",
    })
  }

  const [users, info] = await UserModel.login(userName)
  if (users.length <= 0) {
    res.send({
      code: 401,
      msg: "用户名不存在",
    })
    return
  }

  const user = users[0]
  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(401).send({
      code: 401,
      msg: "密码错误",
    })
  }

  const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "24h" })
  res.send({
    code: 200,
    msg: "登录成功",
    data: {
      token: token,
      email: user.email,
      userName: user.userName,
      avatar: user.avatar,
    },
  })
}

//获取用户信息
exports.getUserInfo = async (req, res) => {
  const userId = req.userId
  const [users, rowInfo] = await UserModel.getUserInfo(userId)
  if (users.length <= 0) {
    res.status(404).send({
      code: 404,
      msg: "用户不存在",
    });
  }
  const { userName, email, avatar } = users[0]

  res.send({
    code: 200,
    msg: "成功获取用户信息",
    data: {
      userName,
      avatar,
      email,
    },
  });
};

// 设置存储路径和文件名
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../public/avatars");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage })
exports.uploadAvatar = [
  upload.single("avatar"), // 处理字段名为 avatar 的文件
  async (req, res) => {
    console.log('userId',req.userId);

    const userId = req.userId

    if (!req.file) {
      return res.status(400).send({
        code: 400,
        msg: "未上传头像文件",
      })
    }

    const avatarUrl = `http://124.71.198.227:3000/public/avatars/${req.file.filename}`

    // 更新用户头像字段
    await UserModel.updateAvatar(userId, avatarUrl)

    res.send({
      code: 200,
      msg: "头像上传成功",
      data: {
        avatar: avatarUrl,
      },
    });
  },
];
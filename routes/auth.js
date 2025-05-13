const express = require('express');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const { signToken, verifyToken } = require('../utils/jwt');

const router = express.Router();
const USERS_FILE = path.join(__dirname, '..', 'users.json');

const readUsers = () => {
  if (!fs.existsSync(USERS_FILE)) return [];
  const data = fs.readFileSync(USERS_FILE);
  return JSON.parse(data);
};

const writeUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// 注册接口
router.post('/register', async (req, res) => {
  const { username, password, avatar } = req.body;
  if (!username || !password || !avatar) {
    return res.status(400).json({ error: '缺少字段' });
  }

  const users = readUsers();
  if (users.find(u => u.username === username)) {
    return res.status(409).json({ error: '用户名已存在' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = {
    id: Date.now(),
    username,
    passwordHash,
    avatar
  };

  users.push(newUser);
  writeUsers(users);

  res.json({ message: '注册成功' });
});

// 登录接口
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();
  const user = users.find(u => u.username === username);

  if (!user) return res.status(401).json({ error: '用户不存在' });
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: '密码错误' });

  const token = signToken({ id: user.id });
  const { passwordHash, ...userData } = user;
  res.json({ token, user: userData });
});

// 获取当前用户信息
router.get('/me', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: '缺少授权头' });

  const token = auth.split(' ')[1];
  const decoded = verifyToken(token);
  if (!decoded) return res.status(401).json({ error: '无效 token' });

  const users = readUsers();
  const user = users.find(u => u.id === decoded.id);
  if (!user) return res.status(404).json({ error: '用户不存在' });

  const { passwordHash, ...userData } = user;
  res.json({ user: userData });
});

module.exports = router;

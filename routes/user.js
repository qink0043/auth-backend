const express = require("express");

const router = express.Router();
const verifyToken = require("../utils/jwt");

const { register, login, getUserInfo } = require("../controllers/user");

router.post("/register", register);
router.post("/login", login);
router.get("/userInfo", verifyToken, getUserInfo);

module.exports = router

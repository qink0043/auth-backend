const express = require("express");

const router = express.Router();
const verifyToken = require("../utils/jwt");

const { register, login, getUserInfo } = require("../controllers/user");

router.post("/api/register", register);
router.post("/api/login", login);
router.get("/api/userInfo", verifyToken, getUserInfo);

module.exports = router;

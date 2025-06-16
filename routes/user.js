const express = require("express");
const multer = require("multer");

const router = express.Router();
const verifyToken = require("../utils/jwt");

const { register, login, getUserInfo, uploadAvatar } = require("../controllers/user");


router.post("/register", register);
router.post("/login", login);
router.get("/userInfo", verifyToken, getUserInfo);
router.post("/updateAvatar", verifyToken, uploadAvatar);

module.exports = router

const jwt = require("jsonwebtoken");
const SECRET_KEY = require("../config/jwt");

function verifyToken(req, res, next) {
  const token = req.headers["authorization"];
  // console.log("verifyToken执行", token);
  if (!token) {
    return res.status(403).send({ msg: "token 为空" });
  }
  // console.log(SECRET_KEY, "----SECRET_KEY");
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).send("token 未授权");
    }
    req.userId = decoded.id;
  });
  next();
}
module.exports = verifyToken;


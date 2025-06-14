const corsOptions = {
  origin: "http://localhost:5173" || "http://43.136.72.202/", // 允许的请求源
  methods: ["GET", "POST", "PUT", "DELETE"], // 允许的请求头方式
  allowedHeaders: ["Content-Type", "Authorization", "token"], // 允许的请求头
  credentials: true, // 是否允许发送Cookie 和其他凭证
  optionsSuccessStatus: 204, // 对于浏览器的兼容性
};

module.exports = corsOptions;

const express = require('express')
const cors = require('cors')
const path = require("path");
const corsOptions = require("./config/cors");
require('dotenv').config()
const app = express()


const userRoutes = require('./routes/user')
const bgmProxyRoutes = require('./routes/bgmProxy')
const animeRoutes = require('./routes/anime.js')

// 把 public 目录映射成可访问资源
app.use("/public", express.static(path.join(__dirname, "public")))
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/api/user', userRoutes)
app.use('/api/bgm', bgmProxyRoutes)
app.use('/api/anime', animeRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});

const express = require('express')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/auth')
const bgmProxyRoutes = require('./routes/bgmProxy')
const animeRoutes = require('./routes/anime.js')

const app = express()
app.use(cors({
  origin: '*', // 前端地址
  credentials: true
}))
app.use(express.json())

app.use('/api/user', authRoutes)
app.use('/api/bgm', bgmProxyRoutes)
app.use('/api/anime', animeRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});

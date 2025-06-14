const express = require('express')
const cors = require('cors')
const corsOptions = require("./config/cors");
require('dotenv').config()
const app = express()


const authRoutes = require('./routes/user')
const bgmProxyRoutes = require('./routes/bgmProxy')
const animeRoutes = require('./routes/anime.js')


app.use(cors(corsOptions));
app.use(express.json())
app.use(express.urlencoded({ extended: false })); 
app.use('/api/user', authRoutes)
app.use('/api/bgm', bgmProxyRoutes)
app.use('/api/anime', animeRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});

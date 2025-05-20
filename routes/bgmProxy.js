const express = require('express')
const axios = require('axios')
const rateLimit = require('express-rate-limit')

const router = express.Router()

// 请求频率限制中间件
const bangumiLimiter = rateLimit({
  windowMs: 1000, // 1 秒
  max: 3, // 最多 3 次请求
  message: {
    error: '请求过于频繁，请稍后再试'
  }
});

router.use(bangumiLimiter)

//代理bangumi接口
router.get('/search', async (req, res) => {
  const { q,type } = req.query
  if (!q) {
    return res.status(400).json({error:'缺少查询参数'})
  }
  try {
    const response = await axios.get(`https://api.bgm.tv/search/subject/${encodeURIComponent(q)}`, {
      params: { type },
      headers: {
        'Accepy': 'application/json',
      },
      timeout: 5000
    })
    res.json(response.data)
  } catch (error) {
    res.status(500).json({message:'Bangumi 请求失败', error: error.message})
  }
})

module.exports = router
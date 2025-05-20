const express = require('express')
const axios = require('axios')
const PQueue = require('p-queue').default

const router = express.Router()

// 请求队列
const queue = new PQueue({ interval: 1000, intervalCap: 3 }); // 每秒最多3个请求

//代理bangumi接口
router.get('/search', async (req, res) => {
  const { q, type } = req.query
  if (!q) {
    return res.status(400).json({ error: '缺少查询参数' })
  }
  try {
    const response = await queue.add(() => {
      axios.get(`https://api.bgm.tv/search/subject/${encodeURIComponent(q)}`, {
        params: { type },
        headers: {
          'Accepy': 'application/json',
        },
        timeout: 5000
      })
    })
    res.json(response.data)
  } catch (error) {
    res.status(500).json({ message: 'Bangumi 请求失败', error: error.message })
  }
})

module.exports = router
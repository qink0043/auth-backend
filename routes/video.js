const express = require('express')
const axios = require('axios')
const router = express.Router()
const cheerio = require('cheerio')

const BASE_URL = 'http://www.yinghuacd.com/'
const request = axios.create({ baseURL: BASE_URL })

async function getHtml(url) {
  let { data: html } = await axios.get(url)
  return html
}

async function getVideoUrl(source) {
  const $ = cheerio.load(source)
  let elements = $('div.playbo > a')
  let regex = /changeplay\('(.*)\$mp4'\);/
  let url = elements.eq(0).attr('onclick')?.replace(regex, '$1') ?? ''
  return url
}

const videoUrl = 'http://www.iyinghua.io/v/5989-2.html'

router.get('/video', async (req, res) => {
  const videoHtml = await getHtml(videoUrl)
  const url = await getVideoUrl(videoHtml)
  res.send({ url: 'https://tup.iyinghua.com/?vid=' + url + '$mp4'})
})

module.exports = router;
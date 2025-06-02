const express = require('express')
const axios = require('axios')
const router = express.Router()
const cheerio = require('cheerio')

const BASE_URL = 'http://www.yinghuacd.com/'
const request = axios.create({ baseURL: BASE_URL })

class AnimeBean {
  title
  img
  url
  episode
  constructor(title, img, url, episode = '') {
    this.title = title
    this.img = img
    this.url = url
    this.episode = episode
  }
}

async function getHtml(url) {
  let { data: html } = await axios.get(url)
  return html
}

function getAnimeList(source) {
  const $ = cheerio.load(source)
  let elements = $('div.lpic > ul > li')
  let animeList = []
  elements.each((i, el) => {
    let title = $(el).find('h2').text()
    let url = $(el).find('h2 > a').attr('href') ?? ''
    let img = $(el).find('img').attr('src') ?? ''
    animeList.push(new AnimeBean(title, img, url))
  })
  return animeList
}

async function getSearchData(source) {
  return getAnimeList(source)
}

async function getVideoUrl(source) {
  const $ = cheerio.load(source)
  let elements = $('div.playbo > a')
  let regex = /changeplay\('(.*)\$mp4'\);/
  let url = elements.eq(0).attr('onclick')?.replace(regex, '$1') ?? ''
  return url
}

const videoUrl = 'http://www.iyinghua.io/v/5989-2.html'
const searchUrl = "http://www.yinghuacd.com/search/海贼王/"


router.get('/video', async (req, res) => {
  const videoHtml = await getHtml(videoUrl)
  const url = await getVideoUrl(videoHtml)
  res.send({ url: 'https://tup.iyinghua.com/?vid=' + url + '$mp4' })
})

router.get('/search', async (req, res) => {
  const searchHtml = await getHtml('http://www.yinghuacd.com/search/' + req.body.keyword)
  const searchData = await getSearchData(searchHtml)
  res.send(searchData)
})

module.exports = router;
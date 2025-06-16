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

class AnimeDetailBean {
  constructor(
    anime,
    desc,
    score,
    tags,
    updateTime,
    episode,
    relatedAnimes
  ) {
    this.anime = anime
    this.desc = desc
    this.score = score
    this.tags = tags
    this.updateTime = updateTime
    this.episode = episode
    this.relatedAnimes = relatedAnimes
  }
}

class EpisodeBean {
  constructor(
    name,
    url
  ) {
    this.name = name
    this.url = url
  }
}

async function getHtml(url) {
  const res = await request.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0 Safari/537.36',
      'Referer': 'http://www.iyinghua.io/',
      'Accept-Language': 'zh-CN,zh;q=0.9'
    },
    timeout: 10000
  })
  return res.data
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

function getAnimeEpisodes($) {
  let dramaElements = $('div.movurl > ul > li')
  let episodes = []
  dramaElements.each((i, el) => {
    let name = $(el).find('a').text()
    let url = $(el).find('a').attr('href') ?? ""
    episodes.push(new EpisodeBean(name, url))
  })
  return episodes
}

async function getAnimeDetail(source) {
  const $ = cheerio.load(source)
  let title = $('h1').text()
  let desc = $('div.info').text()
  let score = $('div.score > em').text()
  let img = $('div.thumb > img').attr('src') ?? ''
  let updateTime = $('div.sinfo > p').last().text()
  let tags = []
  let tagInfoList = $("div.sinfo > span").filter((i, el,) => (i != 5 && i != 3))
  tagInfoList.each((i, el) => {
    let tag = $(el).find('a').text().toUpperCase()
    tags.push(tag)
  })
  let episodes = getAnimeEpisodes($)
  return new AnimeDetailBean(new AnimeBean(title, img, ''), desc, score, tags, updateTime, episodes)
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


router.get('/search', async (req, res) => {
  const searchUrl = 'search/' + req.query.keyword + '/'
  console.log('searchUrl', searchUrl);
  let searchHtml
  try {
    searchHtml = await getHtml(searchUrl)
  } catch (error) {
    console.log('searchHtml错误', searchHtml)
  }
  let searchData
  try {
    searchData = await getSearchData(searchHtml)
  } catch (error) {
    console.log('searchData错误', searchData)
  }
  res.send(searchData)
})

router.get('/detail', async (req, res) => {
  const detailUrl = req.query.url
  let detailHtml
  try {
    detailHtml = await getHtml(detailUrl)
  } catch (error) {
    console.log('获取detailHtml错误', detailHtml)
  }

  let detailData
  try {
    detailData = await getAnimeDetail(detailHtml)
  } catch (error) {
    console.log('获取detailData错误', detailData)
  }
  res.send(detailData)
})

router.get('/video', async (req, res) => {
  const videoUrl = req.query.url
  console.log('videoUrl', videoUrl);
  let videoHtml
  try {
    videoHtml = await getHtml(videoUrl)
  } catch (error) {
    console.log('获取videoHtml错误', videoHtml)
  }
  let url
  try {
    url = await getVideoUrl(videoHtml)
  } catch (error) {
    console.log('获取url错误', url)
  }
  res.send('https://tup.iyinghua.com/?vid=' + url + '$mp4')
})

module.exports = router;
require('dotenv').config()

const PORT = process.env.PORT ? process.env.PORT : 4000

const GIFEncoder = require('gifencoder')
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')
const fse = require('fs-extra')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const moment = require('moment')
const { getAllFilesByExt } = require('./utils.js')
const initSpotify = require('./spotify')

const app = express()
app.use(cors())
app.use(bodyParser.json({ limit: '50mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(cookieParser())
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

initSpotify(app)

const DATA_DIR = './data'
const width = 1920
const height = 1080
const gif_width = Math.floor(width / 2)
const gif_height = Math.floor(height / 2)

app.get('/', (req, res) => {
  res.send({ gur: 'ka' })
})
app.get('/data/*', (req, res) => {
  const filePath = req.params[0]
  console.log(filePath)
  let url = path.join(`${process.cwd()}/data/${filePath}`)
  res.sendFile(url)
})

app.get('/gif', async (req, res) => {
  const { date } = req.query
  if (!date)
    return res.send({ error: 'date required in query ( ?date=YYYY-MM-DD )' })

  fs.readdir(`${DATA_DIR}/gurkor/${date}`, async (error, files) => {
    if (error) return res.send({ error })
    const gif = await generateGif(date, files)

    res.send(gif)
  })
})
app.get('/gifs', async (req, res) => {
  fs.readdir(`${DATA_DIR}/gifs`, async (error, files) => {
    if (error) return res.send({ error })

    res.send(
      files.filter((f) => f !== 'test.txt').map((f) => `/data/gifs/${f}`)
    )
  })
})

app.get('/gurkor', async (req, res) => {
  const files = getAllFilesByExt(`${DATA_DIR}/gurkor`, 'jpg')
  res.send(files)
})

app.post('/gurkor', async (req, res) => {
  res.send({ ok: true })
  const dir = `${DATA_DIR}/gurkor/${moment().format('YYYY-MM-DD')}`

  fse.outputFile(
    `${dir}/gurka-${moment().format()}.jpg`,
    req.body.data,
    'base64'
  )
})

app.listen(PORT, () => console.log(`listening on port ${PORT}`))

const getImageDataFromFilePath = (path) => {
  return sharp(path)
    .resize(gif_width, gif_height)
    .joinChannel(Buffer.alloc(gif_width * gif_height, 255), {
      raw: { channels: 1, width: gif_width, height: gif_height },
    })
    .raw()
    .toBuffer()
}

const generateGif = async (date, imagePaths) => {
  console.log('generateGif', date, imagePaths)
  const gifPath = `${DATA_DIR}/gifs/${date}.gif`

  const encoder = new GIFEncoder(gif_width, gif_height)
  const frames = await Promise.all(
    imagePaths
      .filter((d, i) => (i + 1) % 2 !== 0)
      .map((imgPath) => `${DATA_DIR}/gurkor/${date}/${imgPath}`)
      .map((path) => getImageDataFromFilePath(path))
  )
  encoder.createReadStream().pipe(fs.createWriteStream(gifPath))
  encoder.start()
  encoder.setRepeat(0)
  encoder.setDelay(50)
  encoder.setQuality(10)
  frames.forEach((frame) => {
    encoder.addFrame(frame)
  })
  encoder.finish()
  return gifPath
}

fse.outputFile(`${DATA_DIR}/gifs/test.txt`, 'test', 'base64')

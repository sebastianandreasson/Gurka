require('dotenv').config()

const PORT = process.env.PORT ? process.env.PORT : 4000

const GIFEncoder = require('gifencoder')
const sharp = require('sharp')
const fs = require('fs')
const fse = require('fs-extra')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const moment = require('moment')

const app = express()
app.use(cors())
app.use(bodyParser.json({ limit: '50mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

const DATA_DIR = './data'
const width = 1280
const height = 720
const gif_width = Math.floor(width / 4)
const gif_height = Math.floor(height / 4)

app.get('/', (req, res) => {
  res.send({ gur: 'ka' })
})

app.get('/gurkor', async (req, res) => {
  fs.readdir(`${DATA_DIR}/gurkor`, (err, files) => {
    files.forEach((file) => {
      console.log(file)
    })
    generateGif(files)
    res.send(files)
  })
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
  return sharp(`./data/gurkor/${path}`)
    .resize(gif_width, gif_height)
    .joinChannel(Buffer.alloc(gif_width * gif_height, 255), {
      raw: { channels: 1, width: gif_width, height: gif_height },
    })
    .raw()
    .toBuffer()
}

const generateGif = async (imagePaths) => {
  console.log(imagePaths)
  const encoder = new GIFEncoder(gif_width, gif_height)
  const frames = await Promise.all(
    imagePaths.map((path) => getImageDataFromFilePath(path))
  )
  encoder.createReadStream().pipe(fs.createWriteStream('gurka.gif'))
  encoder.start()
  encoder.setRepeat(0)
  encoder.setDelay(250)
  encoder.setQuality(10)
  frames.forEach((frame) => {
    encoder.addFrame(frame)
  })
  encoder.finish()
}

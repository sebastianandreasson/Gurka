require('dotenv').config()

const PORT = process.env.PORT ? process.env.PORT : 4000

const fs = require('fs')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const moment = require('moment')

const app = express()
app.use(cors())
app.use(bodyParser.json({ limit: '50mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

const DATA_DIR = './data'

app.get('/gurkor', async (req, res) => {
  fs.readdir(DATA_DIR, (err, files) => {
    files.forEach((file) => {
      console.log(file)
    })
    res.send(files)
  })
})
app.post('/gurkor', async (req, res) => {
  console.log('gurkor', req.body)
  res.send({ ok: true })

  fs.writeFileSync(
    `${DATA_DIR}/gurka-${moment().format('YYYY-MM-ddTHH:mm:SS')}.jpg`,
    req.body.data,
    'base64'
  )
})

app.listen(PORT, () => console.log(`listening on port ${PORT}`))

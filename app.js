const bodyParser = require('body-parser')
const request = require('request')
const express = require('express')

const app = express()
const port = process.env.PORT || 4000
const hostname = '127.0.0.1'
const HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer {D4qoZ38DSK2Z3iylpGai1Iex3KBO0mIGbyh1I2GXCWH+C9eaLb0qEyQUHQzPR0VDkoC9fOvfY20PkphvOS0m3PBzFhFJ1JoZAS6kl3CLBRK+Ro6WnNs3Y7awZzyCOdleJ7Gs89R31wVffMQbDLFciQdB04t89/1O/w1cDnyilFU=}'
}

app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())

// Push
app.get('/webhook', (req, res) => {
  // push block
  let msg = 'Hello I am Jurina Matsui!'
  push(msg)
  res.send(msg)
})

// Reply
app.post('/webhook', (req, res) => {
  // reply block
  let reply_token = ''
  let msg = ''
  reply_token = req.body.events[0].replyToken
  if (req.body.events[0].type == 'beacon') {
    msg = JSON.stringify(req.body.events[0])
  } else {
    msg = req.body.events[0].message.text
  }
  reply(reply_token, msg)
  // res.send(msg)
  res.send(msg)
  console.log(msg)
})

// app.post('/webhook', (req, res) => { // reply block 
//   let reply_token = req.body.events[0].replyToken
//   reply(reply_token, 'Hello I love TESA')
//   res.sendStatus(200)
// })

function push(msg) {
  let body = JSON.stringify({
    // push body
    to: 'U711c4288149015806096b4031d2b1a47',
    messages: [{
      type: 'text',
      text: msg
    }]
  })
  // curl
  curl('push', body)
}

function reply(reply_token, msg) {
  let body = JSON.stringify({
    replyToken: reply_token,
    messages: [{
      type: 'text',
      text: msg
    }]
  })
  curl('reply', body)
}

function curl(method, body) {
  console.log('method:' + method)
  request.post({
    url: 'https://api.line.me/v2/bot/message/' + method,
    headers: HEADERS,
    body: body
  }, (err, res, body) => {
    console.log('status = ' + res.statusCode)
    console.log(err);

  })
}

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})

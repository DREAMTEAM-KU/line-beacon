const bodyParser = require("body-parser");
const request = require("request");
const express = require("express");
const axios = require('axios');

const app = express();
const port = process.env.PORT || 4000;
// const hostname = "127.0.0.1";
const HEADERS = {
  "Content-Type": "application/json",
  Authorization: "Bearer {EbjJ236mOdGPtHPHR+o4Z0UFMiW3GsSGW1SouCtYa/F0DfcFdvpAjA19XopU0j615lz4O2fhVeuOo+dw9IkiH97t57as5a4p4VDKwawQp4GFDD+oNPUZAD27pjz8QumSPjg1MqQKTNoR7JsAHAuxdQdB04t89/1O/w1cDnyilFU=}"
};

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// Push
app.get("/webhook", (req, res) => {
  // push block
  let msg = "Hello nisit! I am Paruj.";
  push(msg);
  res.send(msg);
});

// Reply
app.post("/webhook", async (req, res) => {
  // reply block
  try {
    let msg = ''
    let reply_token = req.body.events[0].replyToken
    if (req.body.events[0].type == "beacon") {
      msg = JSON.stringify(req.body.events[0])
    } else if (msg.includes('@user')) {
      let id = 1
      await axios.get('http://tesatopgun.thitgorn.com/showbyID/' + id).then((response) => {
        console.log(response.data)
        msg = JSON.stringify(response.data)
      })
    } else {
      msg = req.body.events[0].message.text
    }
  } catch (e) {}
  reply(reply_token, msg)
  res.send(msg);
  console.log(msg);
});

function push(msg) {
  let body = JSON.stringify({
    // push body
    to: "U84499a6b6a18dddd28dc255e44a9b669",
    messages: [{
      type: "text",
      text: msg
    }]
  });
  // curl
  curl("push", body);
}

function reply(reply_token, msg) {
  let body = JSON.stringify({
    replyToken: reply_token,
    messages: [{
      type: "text",
      text: msg
    }]
  });
  curl("reply", body);
}

function curl(method, body) {
  console.log("method:" + method);
  request.post({
      url: "https://api.line.me/v2/bot/message/" + method,
      headers: HEADERS,
      body: body
    },
    (err, res, body) => {
      console.log("status = " + res.statusCode);
      console.log(err);
    }
  );
}

app.listen(port, () => {
  console.log(`Server running at ${port}/`);
});

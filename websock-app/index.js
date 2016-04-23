'use strict';
const server = require('http').createServer()
  , url = require('url')
  , WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({server: server})
  , express = require('express')
  , app = express()
  , port = 3080;

const redis = require('redis')
const redisClient = redis.createClient({
  host: process.env['REDIS_HOST'] || '192.168.99.100'
});

app.use(function (req, res) {
  res.send({msg: "hello"});
});

wss.on('connection', function connection(ws) {
  var location = url.parse(ws.upgradeReq.url, true);
  // you might use location.query.access_token to authenticate or share sessions
  //   // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.send('something');
});

server.on('request', app);
server.listen(port, function () {
  console.log('Listening on ' + server.address().port)
});

wss.broadcast = (data) => {
  wss.clients.forEach((client) => {
    client.send(data);
  });
};

console.log(process.env['REDIS_HOST'])

redisClient.on("subscribe", function (channel, count) {
  console.log(channel)
  console.log(count)
});

redisClient.on('message', (channel, count) => {
  console.log(channel);
  console.log(count);
});

redisClient.subscribe("game_channel")

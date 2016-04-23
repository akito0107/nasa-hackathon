'use strict'

module.exports = init

function init(socket) {
  socket.on('connected', onConnect(socket))
  socket.on('data', onData(socket))
  socket.on('disconnect', onDisconnect(socket))
  return socket
}

function onConnect(socket) {
  return (data) => {
    console.log('onConnect')
  }
}

function onData(socket) {
  return (data) => {
    console.log('onData')
  }
}

function onDisconnect(socket) {
  return (data) => {
    console.log('onDisconnect')
  }
}

// var level = require('levelup')
var routes = require('routes-router')
var jsonBody = require('body/json')
var ssejson = require('ssejson')

// var db = level('./db')

var http = require('http')

var router = routes()
router.addRoute('/hook/:id', function (req, res, opts) {
  // send hook here
  jsonBody(req, res, function (err, body) {
    connections.forEach(function (connection) {
      var input = ssejson.serialize()
      input.pipe(connection)
      input.write(body)
    })
    res.end()
  })
  
})

var connections = []

setInterval(function () {
  console.log(connections.length)
}, 500)

router.addRoute('/events/:id', function (req, res, opts) {
  // i need to pipe to multiple
  res.setHeader('Content-Type', 'text/event-stream')
  connections.push(res)
  req.on('close', function () {
    connections.splice(connections.indexOf(res), 1)
  })
  
}) // receive messages from here

http.createServer(router).listen(8080)


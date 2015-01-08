var jsonBody = require('body/json')
var ssejson = require('ssejson')
var http = require('http')

var SECRET = process.env['SEND_ENDPOINT']
var PORT = process.env['PORT'] || 8080

function post(req, res) {
  // send hook here
  jsonBody(req, res, function (err, body) {
    if(SECRET && req.url.indexOf(SECRET) !== 1) res.statusCode = 403
    if(err) res.statusCode = 412
    res.end()
    if(res.statusCode !== 200) return
    connections.forEach(function (connection) {
      var input = ssejson.serialize()
      input.pipe(connection)
      input.write(body)
    })
  })
}

var connections = []

function get(req, res) {
  // i need to pipe to multiple
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Access-Control-Allow-Origin': '*'
  })
  res.write(': This is a sse stream, use EventSource to read from it')
  connections.push(res)
  req.on('close', function () {
    connections.splice(connections.indexOf(res), 1)
  })
  
} // receive messages from here


http.createServer(function (req, res) {
  if(req.method === 'POST') return post(req, res)
  if(req.method === 'GET') return get(req, res)
  res.statusCode = 405
  res.end()
}).listen(PORT)


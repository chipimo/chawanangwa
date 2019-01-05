var app = require('express')()
var http = require('http').Server(app)
var io = (module.exports.io = require('socket.io')(http))
var path = require('path')
var bodyParser = require('body-parser')

app.use(bodyParser.json())

var auth = require('./auth/auth')
app.use('/auth/auth', (req, res) => {
  const { credentials } = req.body
  res.json({
    credentials
  })
})

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})
const SocketManager = require('./SocketManager')
io.on('connection', SocketManager)

const PORT = process.env.PORT || 3200

http.listen(PORT, () => {
  console.log('Connected to port ' + PORT)
})

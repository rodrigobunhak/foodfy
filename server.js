const express = require('express')
const server = express()
const nunjucks = require('nunjucks')

server.set("view engine", "html")

// directory when nunjucks will read files
nunjucks.configure("views", {
  express: server
})


server.get("/", function(req, res) {
  return res.send('Hii!')
})

server.listen(5000, function() {
  console.log('server is running.')
})
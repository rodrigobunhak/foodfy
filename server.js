const express = require('express')
const nunjucks = require('nunjucks')

const server = express()

server.use(express.static('public'))

server.set("view engine", "html")
// directory when nunjucks will read files
nunjucks.configure("views", {
  express: server
})


server.get("/", (req, res) => res.render('index'))

server.get("/sobre", (req, res) => res.render('sobre'))

server.get("/receitas", (req, res) => res.render('receitas'))



server.listen(5000, function() {
  console.log('server is running.')
})
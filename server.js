const express = require('express')
const nunjucks = require('nunjucks')

const server = express()

server.use(express.static('public'))

server.set("view engine", "html")
// directory when nunjucks will read files
nunjucks.configure("views", {
  express: server,
  autoescape: false,
  noCache: true
})

const recipes = require("./data")

server.get("/", (req, res) => res.render('index', {recipes}))

server.get("/sobre", (req, res) => res.render('sobre'))

server.get("/receitas", (req, res) => res.render('receitas', {recipes: recipes}))

server.get("/detalhe-receita/:index", function (req, res) {
  // Array de receitas carregadas do data.js
  const recipeIndex = req.params.index;
  const recipe = recipes[recipeIndex]
  // console.log(recipes[recipeIndex]);

  return res.render('detalhe-receita', {recipe})
})

server.listen(5000, function() {
  console.log('server is running.')
})
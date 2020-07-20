const express = require('express')
const routes = express.Router()
const receitas = require('./app/controllers/receitas')

routes.get("/", receitas.index)
routes.get("/sobre", receitas.sobre)
routes.get("/receitas", receitas.receitas )
routes.get("/detalhe-receitas/:index", receitas.detalhe)

module.exports = routes
const express = require('express')
const routes = express.Router()
const receitas = require('./app/controllers/receitas')
const recipes = require('./app/controllers/recipes')


routes.get("/admin/recipes", recipes.index) // Mostrar a lista de receitas
routes.get("/admin/create", recipes.create) // Formulário de nova receita
routes.get("/admin/edit", recipes.edit)

routes.get("/", receitas.index)
routes.get("/sobre", receitas.sobre)
routes.get("/receitas", receitas.receitas )
routes.get("/detalhe-receitas/:index", receitas.detalhe)

module.exports = routes
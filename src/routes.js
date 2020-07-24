const express = require('express')
const routes = express.Router()
const receitas = require('./app/controllers/receitas')
const recipes = require('./app/controllers/recipes')


routes.get("/admin/recipes", recipes.index);
routes.get("/admin/recipes/create", recipes.create); 
routes.get("/admin/recipes/:id", recipes.show);
routes.get("/admin/recipes/:id/edit", recipes.edit);

routes.post("/admin/recipes", recipes.post);
// routes.put("/admin/recipes", recipes.put);
// routes.delete("/admin/recipe", recipes.delete);

routes.get("/", receitas.index)
routes.get("/sobre", receitas.sobre)
routes.get("/receitas", receitas.receitas )
routes.get("/detalhe-receitas/:index", receitas.detalhe)

module.exports = routes
const express = require('express');
const routes = express.Router();
const receitas = require('./app/controllers/receitas');
const recipes = require('./app/controllers/recipes');
const chefs = require('./app/controllers/chefs');

// RECIPES
routes.get("/admin/recipes", recipes.index);
routes.get("/admin/recipes/create", recipes.create); 
routes.get("/admin/recipes/:id", recipes.show);
routes.get("/admin/recipes/:id/edit", recipes.edit);
routes.post("/admin/recipes", recipes.post);
// routes.put("/admin/recipes", recipes.put);
// routes.delete("/admin/recipe", recipes.delete);

// CHEFS
routes.get("/admin/chefs", chefs.index);
routes.get("/admin/chefs/create", chefs.create);
routes.get("/admin/chefs/:id", chefs.show);
routes.get("/admin/chefs/:id/edit", chefs.edit);
routes.post("/admin/chefs", chefs.post);



routes.get("/", receitas.index)
routes.get("/sobre", receitas.sobre)
routes.get("/receitas", receitas.receitas )
routes.get("/detalhe-receitas/:index", receitas.detalhe)

module.exports = routes
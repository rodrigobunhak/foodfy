const express = require('express');
const routes = express.Router();
const multer = require('./app/middlewares/multer')

const recipes = require('./app/controllers/recipes');
const chefs = require('./app/controllers/chefs');
const site = require('./app/controllers/site');

const HomeController = require('./app/controllers/HomeController');
const SearchController = require('./app/controllers/SearchController');

// HOME PAGE - LAST ADDED
routes.get("/", HomeController.index)

// SEARCH
routes.get("/recipes/search", SearchController.index)

// RECIPES
routes.get("/recipes", recipes.index);
routes.get("/recipes/create", recipes.create); 
routes.get("/recipes/:id", recipes.show);
routes.get("/recipes/:id/edit", recipes.edit);
routes.post("/recipes", multer.array("photos", 5), recipes.post);
routes.put("/recipes", multer.array("photos", 5), recipes.put);
routes.delete("/recipes", recipes.delete);

// CHEFS
routes.get("/chefs", chefs.index);
routes.get("/chefs/create", chefs.create);
routes.get("/chefs/:id", chefs.show);
routes.get("/chefs/:id/edit", chefs.edit);
routes.post("/chefs", multer.single("avatar"), chefs.post);
routes.put("/chefs", multer.single("avatar"), chefs.put);
routes.delete("/chefs", chefs.delete);




routes.get("/site/about", site.about)
routes.get("/site/recipes", site.recipes)
routes.get("/site/chefs", site.chefs)
routes.get("/site/recipes/:id", site.show)

module.exports = routes
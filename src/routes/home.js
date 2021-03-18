const express = require('express');
const routes = express.Router();

const HomeController = require('../app/controllers/HomeController');

routes.get("/about", HomeController.about)
routes.get("/recipes", HomeController.recipes)
routes.get("/chefs", HomeController.chefs)
routes.get("/recipes/:id", HomeController.showRecipe)

module.exports = routes
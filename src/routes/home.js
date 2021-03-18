const express = require('express');
const routes = express.Router();

const HomeController = require('../app/controllers/HomeController');

routes.get("/about", HomeController.about) // ok
routes.get("/recipes", HomeController.recipes) // ok
routes.get("/chefs", HomeController.chefs) // ok
routes.get("/recipes/:id", HomeController.showRecipe) // ok

module.exports = routes
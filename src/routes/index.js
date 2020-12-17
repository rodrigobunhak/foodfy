const express = require('express');
const routes = express.Router();

const site = require('../app/controllers/site');
const HomeController = require('../app/controllers/HomeController');

const recipes = require('./recipes')
const chefs = require('./chefs')
const users = require('./users')


// HOME PAGE - LAST ADDED
routes.get("/", HomeController.index)

routes.use('/recipes', recipes)
routes.use('/chefs', chefs)
routes.use('/users', users)






routes.get("/site/about", site.about)
routes.get("/site/recipes", site.recipes)
routes.get("/site/chefs", site.chefs)
routes.get("/site/recipes/:id", site.show)



module.exports = routes
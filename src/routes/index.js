const express = require('express');
const routes = express.Router();

const HomeController = require('../app/controllers/HomeController');

const home = require('./home')
const recipes = require('./recipes')
const chefs = require('./chefs')
const users = require('./users')
const session = require('./session')

routes.get("/", HomeController.index) // ok

routes.use('/home', home) // ok
routes.use('/recipes', recipes) // ok
routes.use('/chefs', chefs) // ok
routes.use('/users', users) // ok 
routes.use('/session', session) // ok

module.exports = routes
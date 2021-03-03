const express = require('express');
const routes = express.Router();

// middlewares
const multer = require('../app/middlewares/multer')
const { verifyAdmin, verifyUserAutenticad, verifyUserCreator } = require('../app/middlewares/session')

// controllers
const RecipesController = require('../app/controllers/RecipesController');
const SearchController = require('../app/controllers/SearchController');

routes.get("/search", SearchController.index) // ok

routes.get("/", verifyUserAutenticad, RecipesController.index); // ok
routes.get("/create", verifyUserAutenticad, RecipesController.create); // ok
routes.get("/:id", verifyUserAutenticad, RecipesController.show); // ok
routes.get("/:id/edit", verifyUserAutenticad, verifyUserCreator, RecipesController.edit); // ok

routes.post("/", multer.array("photos", 5), RecipesController.post); // ok
routes.put("/", multer.array("photos", 5), RecipesController.put); // ok
routes.delete("/", verifyUserAutenticad, verifyAdmin, RecipesController.delete); // ok

module.exports = routes
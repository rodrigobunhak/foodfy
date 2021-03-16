const express = require('express');
const routes = express.Router();

// middlewares
const multer = require('../app/middlewares/multer')
const { verifyAdmin, verifyUserAutenticad, verifyUserCreator } = require('../app/middlewares/session')

// controllers
const RecipesController = require('../app/controllers/RecipesController');
const SearchController = require('../app/controllers/SearchController');

routes.get("/search", SearchController.index)

routes.get("/", verifyUserAutenticad, RecipesController.index);
routes.get("/create", verifyUserAutenticad, RecipesController.create);
routes.get("/:id", verifyUserAutenticad, RecipesController.show);
routes.get("/:id/edit", verifyUserAutenticad, verifyUserCreator, RecipesController.edit);

routes.post("/", multer.array("photos", 5), RecipesController.post);
routes.put("/", multer.array("photos", 5), RecipesController.put);
routes.delete("/", verifyUserAutenticad, verifyAdmin, RecipesController.delete);

module.exports = routes
const express = require('express');
const routes = express.Router();

// middlewares
const multer = require('../app/middlewares/multer')
const { verifyAdmin } = require('../app/middlewares/session')

// controllers
const RecipesController = require('../app/controllers/RecipesController');
const SearchController = require('../app/controllers/SearchController');

routes.get("/search", SearchController.index) // ok

routes.get("/", verifyAdmin, RecipesController.index); // ok
routes.get("/create", verifyAdmin, RecipesController.create); // ok
routes.get("/:id", verifyAdmin, RecipesController.show); // ok
routes.get("/:id/edit", verifyAdmin, RecipesController.edit); // ok

routes.post("/", multer.array("photos", 5), RecipesController.post); // ok
routes.put("/", multer.array("photos", 5), RecipesController.put); // ok
routes.delete("/", RecipesController.delete); // ok

module.exports = routes
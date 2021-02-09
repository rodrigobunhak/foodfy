const express = require('express');
const routes = express.Router();

// middlewares
const multer = require('../app/middlewares/multer')
const { verifyAdmin } = require('../app/middlewares/session')

// controllers
const ChefsController = require('../app/controllers/ChefsController');

routes.get("/", verifyAdmin, ChefsController.index); // ok
routes.get("/create", verifyAdmin, ChefsController.create); // ok
routes.get("/:id", verifyAdmin, ChefsController.show); // ok
routes.get("/:id/edit", verifyAdmin, ChefsController.edit); // ok

routes.post("/", verifyAdmin, multer.single("avatar"), ChefsController.post); // ok
routes.put("/", verifyAdmin, multer.single("avatar"), ChefsController.put); // ok
routes.delete("/", verifyAdmin, ChefsController.delete); // ok

module.exports = routes
const express = require('express');
const routes = express.Router();

// middlewares
const multer = require('../app/middlewares/multer')
const { verifyAdmin, verifyUserAutenticad } = require('../app/middlewares/session')

// controllers
const ChefsController = require('../app/controllers/ChefsController');

routes.get("/", verifyUserAutenticad, verifyAdmin, ChefsController.index); // ok
routes.get("/create", verifyUserAutenticad, verifyAdmin, ChefsController.create); // ok
routes.get("/:id", verifyUserAutenticad, verifyAdmin, ChefsController.show); // ok
routes.get("/:id/edit", verifyUserAutenticad, verifyAdmin, ChefsController.edit); // ok

routes.post("/", verifyUserAutenticad, verifyAdmin, multer.single("avatar"), ChefsController.post); // ok
routes.put("/", verifyUserAutenticad, verifyAdmin, multer.single("avatar"), ChefsController.put); // ok
routes.delete("/", verifyUserAutenticad, verifyAdmin, ChefsController.delete); // ok

module.exports = routes
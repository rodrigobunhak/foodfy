const express = require('express');
const routes = express.Router();
const multer = require('../app/middlewares/multer')

const chefs = require('../app/controllers/chefs');

const { verifyAdmin } = require('../app/middlewares/session')

// CHEFS
routes.get("/", chefs.index);
routes.get("/create", verifyAdmin, chefs.create);
routes.get("/:id", chefs.show);
routes.get("/:id/edit", chefs.edit);
routes.post("/", multer.single("avatar"), chefs.post);
routes.put("/", multer.single("avatar"), chefs.put);
routes.delete("/", chefs.delete);



module.exports = routes
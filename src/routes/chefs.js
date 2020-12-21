const express = require('express');
const routes = express.Router();
const multer = require('../app/middlewares/multer')

const ChefsController = require('../app/controllers/ChefsController');

const { verifyAdmin } = require('../app/middlewares/session')

// admin
routes.get("/create", verifyAdmin, ChefsController.create);
routes.get("/:id/edit", verifyAdmin, ChefsController.edit);
routes.post("/", verifyAdmin, multer.single("avatar"), ChefsController.post);
routes.put("/", verifyAdmin, multer.single("avatar"), ChefsController.put);
routes.delete("/", verifyAdmin, ChefsController.delete);


routes.get("/", ChefsController.index);
routes.get("/:id", ChefsController.show);



module.exports = routes
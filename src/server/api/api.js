const express = require("express");
const route = express.Router();
const controller = require("../controller/projects_controller.js");

route.post("/api", controller.create);
route.get("/api", controller.find);
route.put("/api/:id", controller.update);
route.delete("/api/:id", controller.delete);

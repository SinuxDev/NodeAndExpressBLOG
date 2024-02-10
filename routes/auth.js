const express = require("express");
const routes = express.Router();
const authController = require("../controllers/auth");

routes.get("/login", authController.getLoginPage);
routes.post("/login", authController.postLoginData);
routes.post("/logout", authController.logout);

module.exports = routes;

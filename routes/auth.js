const express = require("express");
const routes = express.Router();
const authController = require("../controllers/auth");

//Register Page
routes.get("/register", authController.getRegisterPage);

// Handle Register Page
routes.post("/register", authController.createRegisterAccount);

// Render Login Page
routes.get("/login", authController.getLoginPage);

// Handle Login Page
routes.post("/login", authController.postLoginData);

// Handle Logout Page
routes.post("/logout", authController.logout);

// Render reset-password-page
routes.get("/reset-password", authController.getResetPage);

// Render feedback Page
routes.get("/feedback", authController.getFeedbackPage);

// Send reset email
routes.post("/reset", authController.resetLinkSend);

module.exports = routes;

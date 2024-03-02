const express = require("express");
const routes = express.Router();
const authController = require("../controllers/auth");
const { check } = require("express-validator");
const User = require("../models/user");
//Register Page
routes.get("/register", authController.getRegisterPage);

// Handle Register Page
routes.post(
  "/register",
  check("email")
    .isEmail()
    .withMessage("Please Enter Valid Email Address")
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject(
            "Email is already exists. Please Enter another email to register"
          );
        }
      });
    }),
  authController.createRegisterAccount
);

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

// Render new password page
routes.get("/reset-password/:token", authController.getNewPassPage);

// change new password
routes.post("/change-new-password", authController.changeNewPassword);

module.exports = routes;

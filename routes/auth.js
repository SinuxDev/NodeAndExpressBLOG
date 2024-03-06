const express = require("express");
const routes = express.Router();
const authController = require("../controllers/auth");
const { body } = require("express-validator");
const User = require("../models/user");

//Register Page
routes.get("/register", authController.getRegisterPage);

// Handle Register Page
routes.post(
  "/register",
  body("email")
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
  body("password")
    .isLength({ min: 4 })
    .trim()
    .withMessage("Password must have at least 4 characters"),
  authController.createRegisterAccount
);

// Render Login Page
routes.get("/login", authController.getLoginPage);

// Handle Login Page
routes.post(
  "/login",
  body("email").isEmail().withMessage("Enter an valid email address"),
  body("password")
    .isLength({ min: 4 })
    .trim()
    .withMessage("Password must be valid"),
  authController.postLoginData
);

// Handle Logout Page
routes.post("/logout", authController.logout);

// Render reset-password-page
routes.get("/reset-password", authController.getResetPage);

// Render feedback Page
routes.get("/feedback", authController.getFeedbackPage);

// Send reset email
routes.post(
  "/reset",
  body("email").isEmail().withMessage("Enter an valid email address"),
  authController.resetLinkSend
);

// Render new password page
routes.get("/reset-password/:token", authController.getNewPassPage);

// change new password
routes.post(
  "/change-new-password",
  body("password")
    .isLength({ min: 4 })
    .trim()
    .withMessage("Password must have at least 4 characters"),
  body("confirm_password")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("MotherFucker check your password again!!Please Sir!");
      }
      return true;
    }),
  authController.changeNewPassword
);

module.exports = routes;

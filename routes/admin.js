const express = require("express");
const path = require("path");
const routes = express.Router();
const postController = require("../controllers/post");
const userController = require("../controllers/user");
const { body } = require("express-validator");

// /admin/create-post
routes.get("/create-post", postController.renderCreatePage);

routes.post(
  "/",
  [
    body("title")
      .trim()
      .isLength({ min: 10 })
      .withMessage("Title must have at least 10 words"),
    body("photo").isMimeType("image"),
    body("description")
      .trim()
      .isLength({ min: 30 })
      .withMessage("Description must have at least 30 words"),
  ],
  postController.createPost
);

routes.get("/edit/:postId", postController.getEditPost);

routes.post(
  "/edit-post",
  [
    body("title")
      .trim()
      .isLength({ min: 10 })
      .withMessage("Title must have at least 10 words"),

    body("description")
      .trim()
      .isLength({ min: 30 })
      .withMessage("Description must have at least 30 words"),
  ],
  postController.updatePost
);

routes.post("/delete/:postId", postController.deletePost);

routes.get("/view-profile", userController.getProfile);

module.exports = routes;

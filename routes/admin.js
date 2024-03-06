const express = require("express");
const path = require("path");
const routes = express.Router();
const postController = require("../controllers/post");
const { body } = require("express-validator");

// /admin/create-post
routes.get("/create-post", postController.renderCreatePage);

routes.post(
  "/",
  [
    body("title").isLength({ min: 10 }),
    body("photo").isURL(),
    body("description").isLength({ min: 30 }),
  ],
  postController.createPost
);

routes.get("/edit/:postId", postController.getEditPost);

routes.post("/edit-post", postController.updatePost);

routes.post("/delete/:postId", postController.deletePost);

module.exports = routes;

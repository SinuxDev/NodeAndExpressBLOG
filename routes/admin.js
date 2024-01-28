const express = require("express");
const path = require("path");

const routes = express.Router();
const postController = require("../controllers/post");

// /adin/create-post
routes.get("/create-post", postController.renderCreatePage);

routes.post("/", postController.createPost);

routes.get("/edit/:postId", postController.getEditPost);

routes.post("/edit-post", postController.updatePost);

routes.post("/delete/:postId", postController.deletePost);

module.exports = routes;

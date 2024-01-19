const express = require("express");

const routes = express.Router();
const postController = require("../controllers/post");

// /adin/create-post
routes.get("/create-post", postController.renderCreatePage);

routes.post("/", postController.createPost);

routes.post("/post/:postId", postController.deletePost);

// admin/post-edit
routes.post("/post-edit", postController.UpdatePost);

// admin/post-edit/id
routes.get("/post-edit/:postId", postController.getOldPost);

module.exports = routes;

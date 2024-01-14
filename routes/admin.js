const express = require("express");

const routes = express.Router();
const postController = require("../controllers/post");

// /adin/create-post
routes.get("/create-post", postController.renderCreatePage);

routes.post("/", postController.createPost);

module.exports = routes;

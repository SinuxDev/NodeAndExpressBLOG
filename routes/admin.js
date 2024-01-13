const express = require("express");
const path = require("path");
const { post } = require("./post");

const routes = express.Router();
const postController = require("../controllers/post");

// /adin/create-post
routes.get("/create-post", postController.renderCreatePage);

routes.post("/", postController.createPost);

module.exports = routes;

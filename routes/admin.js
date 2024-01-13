const express = require("express");
const path = require("path");
const { post } = require("./post");

const routes = express.Router();

const posts = [];
  
// /adin/create-post
routes.get("/create-post", (req, res) => {
  // res.sendFile(path.join(__dirname, "..", "views", "addPost.html"));
  res.render("addPost", { title: "Post Create Shin" });
});

routes.post("/", (req, res) => {
  const { title, description } = req.body;
  console.log(`Title Value is ${title} & description is ${description}`);
  posts.push({
    title,
    description,
  });
  console.log(posts);
  res.redirect("/");
});
routes.get("/");

module.exports = { adminRoutes: routes, posts };

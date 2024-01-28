const posts = [];
const Post = require("../models/post");

exports.createPost = (req, res) => {
  const { title, description, photo } = req.body;
  const post = new Post(title, description, photo);
  post
    .create()
    .then((result) => console.log(result))
    .catch((err) => console.log(err));
};

exports.renderCreatePage = (req, res) => {
  // res.sendFile(path.join(__dirname, "..", "views", "addPost.html"));
  res.render("addPost", { title: "Post Create Shin" });
};

exports.renderHomePage = (req, res) => {
  // res.sendFile(path.join(__dirname, "..", "views", "homepage.html"));
  res.render("home", { title: "Hello World", postsArr: posts });
};

exports.getPostDetails = (req, res) => {
  const postId = req.params.postId;
  console.log(postId);
  const post = posts.find((post) => post.id == postId);
  console.log(post);
  res.render("details", { title: "I'm Details Page", post });
};

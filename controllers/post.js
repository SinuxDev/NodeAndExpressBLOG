// const posts = [];

const Posts = require("../models/posts");

exports.createPost = (req, res) => {
  const { title, description, photo } = req.body;

  const post = new Posts(title, description, photo);
  post
    .setPost()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => console.log(err));

  console.log(post);
};

exports.renderCreatePage = (req, res) => {
  res.render("addPost", { title: "Post Create Shin" });
};

exports.getPosts = (req, res) => {
  // res.sendFile(path.join(__dirname, "..", "views", "homepage.html"));

  Posts.getAllPost()
    .then(([rows]) => {
      console.log(rows);
      res.render("home", { title: "Hello World", postsArr: rows });
    })
    .catch((err) => console.log(err));
};

exports.getPostDetails = (req, res) => {
  const postId = req.params.postId;
  console.log(postId);
  Posts.getSinglePost(postId)
    .then(([row]) => {
      res.render("details", { title: "I'm Details Page", post: row[0] });
    })
    .catch((err) => console.log(err));
};

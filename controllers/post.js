const Post = require("../models/post");

exports.createPost = (req, res) => {
  const { title, description, photo } = req.body;
  Post.create({ title, description, imgUrl: photo })
    .then((result) => {
      console.log(result);
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.renderCreatePage = (req, res) => {
  // res.sendFile(path.join(__dirname, "..", "views", "addPost.html"));
  res.render("addPost", { title: "Post Create Shin" });
};

exports.renderHomePage = (req, res) => {
  // res.sendFile(path.join(__dirname, "..", "views", "homepage.html"));

  Post.find()
    .sort({ title: 1 })
    .then((posts) =>
      res.render("home", { title: "Hello World", postsArr: posts })
    )
    .catch((err) => console.log(err));
};

exports.getPostDetails = (req, res) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => res.render("details", { title: post.title, post }))
    .catch((err) => console.log(err));
};

exports.getEditPost = (req, res) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        return res.redirect("/");
      }
      res.render("editPost", { title: post.title, post });
    })
    .catch((err) => console.log(err));
};

exports.updatePost = (req, res) => {
  const { title, description, photo, postId } = req.body;

  Post.findById(postId)
    .then((post) => {
      post.title = title;
      post.description = description;
      post.imgUrl = photo;
      return post.save();
    })
    .then((result) => {
      console.log("Post Updated");
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.deletePost = (req, res) => {
  const postId = req.params.postId;
  Post.findByIdAndDelete(postId)
    .then((result) => {
      console.log("Post Deleted");
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

const Post = require("../models/post");
const { validationResult } = require("express-validator");

exports.createPost = (req, res) => {
  const { title, description, photo } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).render("addPost", {
      title: "Post Create Shin",
      oldData: { title, description, photo },
    });
  }
  Post.create({ title, description, imgUrl: photo, userId: req.users })
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.renderCreatePage = (req, res) => {
  // res.sendFile(path.join(__dirname, "..", "views", "addPost.html"));
  res.render("addPost", {
    title: "Post Create Shin",
    oldData: { title, description, photo },
  });
};

exports.renderHomePage = (req, res) => {
  // res.sendFile(path.join(__dirname, "..", "views", "homepage.html"));
  // const cookie = req.get("Cookie").split("=")[1].trim() == "true";
  Post.find()
    .select("title")
    .populate("userId", "email")
    .sort({ title: 1 })
    .then((posts) => {
      res.render("home", {
        title: "Home Page",
        postsArr: posts,
        currentUserEmail: req.session.userInfo
          ? req.session.userInfo.email
          : "",
      });
    })
    .catch((err) => console.log(err));
};

exports.getPostDetails = (req, res) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) =>
      res.render("details", {
        title: post.title,
        post,
        currentLoginUserId: req.session.userInfo
          ? req.session.userInfo._id
          : "",
      })
    )
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
      if (post.userId.toString() !== req.users._id.toString()) {
        return res.redirect("/");
      }
      post.title = title;
      post.description = description;
      post.imgUrl = photo;
      return post.save().then((result) => {
        console.log("Post Updated");
        res.redirect("/");
      });
    })
    .catch((err) => console.log(err));
};

exports.deletePost = (req, res) => {
  const postId = req.params.postId;
  Post.deleteOne({ _id: postId, userId: req.users._id })
    .then(() => {
      console.log("Post Deleted");
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

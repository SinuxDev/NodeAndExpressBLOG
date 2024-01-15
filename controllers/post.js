// const posts = [];

const Posts = require("../models/posts");

exports.createPost = (req, res) => {
  const { title, description, photo } = req.body;

  Posts.create({
    title,
    description,
    imgUrl: photo,
  })
    .then((result) => {
      console.log(result);
      console.log("New Post created");
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.renderCreatePage = (req, res) => {
  res.render("addPost", { title: "Post Create Shin" });
};

exports.getPosts = (req, res) => {
  Posts.findAll()
    .then((post) => {
      res.render("home", { title: "Home Page", postsArr: post });
    })
    .catch((err) => console.log(err));
};

exports.getPostDetails = (req, res) => {
  const postId = req.params.postId;
  Posts.findByPk(postId)
    .then((post) => {
      res.render("details", { title: "I'm Details Page", post });
    })
    .catch((err) => console.log(err));

  // Posts.findOne({where : {id: postId}})
  // .then((post) => {
  //   res.render("details", { title: "I'm Details Page", post });
  // })
  // .catch((err) => console.log(err));
};

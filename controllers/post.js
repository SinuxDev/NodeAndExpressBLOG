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
  Posts.findAll({ order: [["title", "asc"]] })
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

exports.deletePost = (req, res) => {
  const postId = req.params.postId;
  Posts.findByPk(postId)
    .then((post) => {
      if (!post) {
        res.redirect("/");
      }
      return post.destroy();
    })
    .then((result) => {
      console.log("Post Deleted!!!");
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.getOldPost = (req, res) => {
  const postId = req.params.postId;
  Posts.findByPk(postId)
    .then((post) => {
      res.render("editPost", { title: `${post.title}`, post });
    })
    .catch((err) => console.log(err));
};

exports.UpdatePost = (req, res) => {
  const { title, description, photo, postId } = req.body;
  Posts.findByPk(postId)
    .then((post) => {
      post.title = title;
      post.description = description;
      post.imgUrl = photo;
      return post.save();
    })
    .then((result) => {
      console.log(`Post id => ${postId} is updated successfully`);
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

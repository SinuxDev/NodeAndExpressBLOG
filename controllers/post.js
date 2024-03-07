const Post = require("../models/post");
const { validationResult } = require("express-validator");
const { formatISO9075 } = require("date-fns");

exports.createPost = (req, res, next) => {
  const { title, description, photo } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("addPost", {
      title: "Post Create Shin",
      errorMsg: errors.array()[0].msg,
      oldFormData: { title, description, photo },
    });
  }
  Post.create({ title, description, imgUrl: photo, userId: req.users })
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("Can't Create Post!Something went Wrong");
      return next(error);
    });
};

exports.renderCreatePage = (req, res, next) => {
  // res.sendFile(path.join(__dirname, "..", "views", "addPost.html"));
  res.render("addPost", {
    title: "Post Create Shin",
    errorMsg: "",
    oldFormData: { title: "", description: "", photo: "" },
  });
};

exports.renderHomePage = (req, res, next) => {
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
    .catch((err) => {
      console.log(err);
      const error = new Error("Someting Went Wrong");
      return next(error);
    });
};

exports.getPostDetails = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .populate("userId", "email")
    .then((post) =>
      res.render("details", {
        title: post.title,
        post,
        date: post.createdAt
          ? formatISO9075(post.createdAt, { representation: "date" })
          : undefined,
        currentLoginUserId: req.session.userInfo
          ? req.session.userInfo._id
          : "",
      })
    )
    .catch((err) => {
      console.log(err);
      const error = new Error("Post Not Found with this id!!");
      return next(error);
    });
};

exports.getEditPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        return res.redirect("/");
      }
      res.render("editPost", {
        title: post.title,
        post,
        errorMsg: "",
        oldFormData: { title: "", description: "", photo: "" },
        isValidationFail: false,
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("Someting Went Wrong");
      return next(error);
    });
};

exports.updatePost = (req, res, next) => {
  const { title, description, photo, postId } = req.body;
  const errors = validationResult(req);

  Post.findById(postId)
    .then((post) => {
      if (post.userId.toString() !== req.users._id.toString()) {
        return res.redirect("/");
      }

      if (!errors.isEmpty()) {
        return res.status(422).render("editPost", {
          title,
          post,
          errorMsg: errors.array()[0].msg,
          oldFormData: { title, description, photo },
          isValidationFail: true,
        });
      }

      post.title = title;
      post.description = description;
      post.imgUrl = photo;
      return post.save().then((result) => {
        console.log("Post Updated");
        res.redirect("/");
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("Someting Went Wrong");
      return next(error);
    });
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.deleteOne({ _id: postId, userId: req.users._id })
    .then(() => {
      console.log("Post Deleted");
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("Someting Went Wrong");
      return next(error);
    });
};

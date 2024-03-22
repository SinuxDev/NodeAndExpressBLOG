const { validationResult } = require("express-validator");
const Post = require("../models/post");
const User = require("../models/user");

const POST_PER_PAGE = 3;

exports.getProfile = (req, res, next) => {
  const pageNumber = +req.query.page || 1;
  let totalPostNumber;
  Post.find({ userId: req.users._id })
    .countDocuments()
    .then((totalPost) => {
      totalPostNumber = totalPost;
      return Post.find({ userId: req.users._id })
        .populate("userId", "email")
        .skip((pageNumber - 1) * POST_PER_PAGE) // page => 2 -1 = 1 || per page => 3 * 1 = 3
        .limit(POST_PER_PAGE)
        .sort({ createdAt: -1 });
    })
    .then((posts) => {
      if (posts.length > 0) {
        return res.render("user/profile", {
          title: req.session.userInfo.email,
          postsArr: posts,
          currentPage: pageNumber,
          hasNextPage: POST_PER_PAGE * pageNumber < totalPostNumber,
          hasPreviousPage: pageNumber > 1,
          nextPage: pageNumber + 1,
          previousPage: pageNumber - 1,
          currentUserEmail: req.session.userInfo
            ? req.session.userInfo.email
            : "",
        });
      } else {
        return res.status(500).render("error/500", {
          title: "Something Went Wrong",
          message: "There's no post you son of bitch",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("Someting Went Wrong");
      return next(error);
    });
};

exports.getPublicProfile = (req, res, next) => {
  const { id } = req.params;
  const pageNumber = +req.query.page || 1;
  let totalPostNumber;
  Post.find({ userId: id })
    .countDocuments()
    .then((totalPost) => {
      totalPostNumber = totalPost;
      return Post.find({ userId: id })
        .populate("userId", "email")
        .skip((pageNumber - 1) * POST_PER_PAGE) // page => 2 -1 = 1 || per page => 3 * 1 = 3
        .limit(POST_PER_PAGE)
        .sort({ createdAt: -1 });
    })
    .then((posts) => {
      if (posts.length > 0) {
        return res.render("user/public-profile", {
          title: posts[0].userId.email,
          postsArr: posts,
          currentPage: pageNumber,
          hasNextPage: POST_PER_PAGE * pageNumber < totalPostNumber,
          hasPreviousPage: pageNumber > 1,
          nextPage: pageNumber + 1,
          previousPage: pageNumber - 1,
          currentUserEmail: posts[0].userId.email,
          currentUserId: posts[0].userId._id,
        });
      } else {
        return res.status(500).render("error/500", {
          title: "Something Went Wrong",
          message: "There's no post you son of bitch",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("Someting Went Wrong");
      return next(error);
    });
};

exports.renderUsernamePage = (req, res, next) => {
  res.render("user/username", {
    title: "Set Username",
    errorMsg: req.flash("error"),
  });
};

exports.setUsername = (req, res, next) => {
  const { username } = req.body;
  const Updateusername = username.replace("@", "");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("user/username", {
      title: "Set Username",
      errorMsg: errors.array()[0].msg,
    });
  }

  User.findById(req.users._id)
    .then((user) => {
      user.username = `@${Updateusername}`;
      return user.save().then(() => {
        console.log("Username Added!");
        res.redirect("/admin/view-profile");
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("User not found with this id");
      return next(error);
    });
};

const Post = require("../models/post");

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
        console.log(posts);
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

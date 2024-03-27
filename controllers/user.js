const { validationResult } = require("express-validator");
const Post = require("../models/post");
const User = require("../models/user");
const stripe = require("stripe")(
  "sk_test_51OypjB05dC3N5cEWXo2Zpvc5C8Lh5MrEVXitFKmxaNAPzgkh07pPn43rxIJtFZSosVdSHmhKP3OBKF4uWffwAHLn00NgfgMKSa"
);

const POST_PER_PAGE = 3;

exports.getProfile = (req, res, next) => {
  const pageNumber = +req.query.page || 1;
  let totalPostNumber;
  Post.find({ userId: req.users._id })
    .countDocuments()
    .then((totalPost) => {
      totalPostNumber = totalPost;
      return Post.find({ userId: req.users._id })
        .populate("userId", "email username isPremium")
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
        .populate("userId", "email isPremium username")
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

exports.renderPremiumPage = (req, res, next) => {
  stripe.checkout.sessions
    .create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: "price_1Oyqax05dC3N5cEWbNrtBsLI",
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.protocol}://${req.get(
        "host"
      )}/admin/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.protocol}://${req.get(
        "host"
      )}/admin/subscription-cancel`,
    })
    .then((stripe_session) => {
      res.render("user/premium", {
        title: "Premium Page",
        session_Id: stripe_session.id,
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("Unexpected Error");
      return next(error);
    });
};

exports.getSuccessPage = (req, res, next) => {
  const session_id = req.query.session_id;
  if (!session_id) {
    return res.redirect("/admin/view-profile");
  }

  User.findById(req.users._id)
    .then((user) => {
      user.isPremium = true;
      user.payment_session_key = session_id;
      return user.save();
    })
    .then(() => {
      res.render("user/subscription-success", {
        title: "Subscription Success Page",
        susbscription_id: session_id,
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("Unexpected Error");
      return next(error);
    });
};

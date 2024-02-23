const User = require("../models/user");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv").config();

const nodeMailer = require("nodemailer");
const transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_MAIL,
    pass: process.env.MAIL_PASSWORD,
  },
});

//render register page
exports.getRegisterPage = (req, res) => {
  res.render("auth/register", {
    title: "Register Page",
    errorMsg: req.flash("error"),
  });
};

//handle register
exports.createRegisterAccount = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        req.flash("error", "Email is already exist");
        return res.redirect("/register");
      }

      return bcrypt
        .hash(password, 10)
        .then((hashPass) => {
          return User.create({
            email,
            password: hashPass,
          });
        })
        .then((_) => {
          res.redirect("/login");
          transporter.sendMail(
            {
              from: process.env.SENDER_MAIL,
              to: email,
              subject: "Register Successful",
              html: "<h1>Register account successfully</h1><p>Someone use this accuont to register our website sinuxBLOG </p>",
            },
            (err) => console.log(err)
          );
        });
    })
    .catch((err) => console.log(err));
};

// render logic page
exports.getLoginPage = (req, res) => {
  res.render("auth/login", {
    title: "Login Page",
    errorMsg: req.flash("error"),
  });
};

// handle login
exports.postLoginData = (req, res) => {
  // req.session.isLogin = true;
  // res.redirect("/");

  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Check your information and Try Again!!"); // flash("key","value");
        return res.redirect("/login");
      }
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          req.session.isLogin = true;
          req.session.userInfo = user;
          return req.session.save((err) => {
            res.redirect("/");
            console.log(err);
          });
        }
        res.redirect("/login");
      });
    })
    .catch((err) => console.log(err));
};

// handle logout
exports.logout = (req, res) => {
  req.session.destroy((_) => {
    res.redirect("/");
  });
};

const User = require("../models/user");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv").config();
const crypto = require("crypto");

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

// render login page
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

//Render Reset-Password-Page
exports.getResetPage = (req, res) => {
  res.render("auth/reset", {
    title: "Reset Password Page",
    errorMsg: req.flash("error"),
  });
};

//Render Feedback page
exports.getFeedbackPage = (req, res) => {
  res.render("auth/feedback", {
    title: "Feedback Page",
  });
};

// reset-password sent
exports.resetLinkSend = (req, res) => {
  const { email } = req.body;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset-password");
    }

    const token = buffer.toString("hex");
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No Account found with this email!!");
          return res.redirect("/reset-password");
        }

        user.resetToken = token;
        user.tokenExpiration = Date.now() + 1800000;
        return user.save();
      })
      .then((result) => {
        res.redirect("/feedback");
        transporter.sendMail(
          {
            from: process.env.SENDER_MAIL,
            to: email,
            subject: "Reset Password",
            html: `<h1>Reset Password Now</h1><p>Change Your password. Is that you or not?. Bitch! I don't care. Just click the link below</p><a href="http://localhost:8080/reset-password/${token}">Clik Me To Change Your Password</a>`,
          },
          (err) => console.log(err)
        );
      })
      .catch((err) => console.log(err));
  });
};

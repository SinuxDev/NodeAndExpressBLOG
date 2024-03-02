const User = require("../models/user");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv").config();
const crypto = require("crypto");
const { validationResult } = require("express-validator");

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
    oldFormData: { email: "", password: "" },
  });
};

//handle register
exports.createRegisterAccount = (req, res) => {
  const { email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/register", {
      title: "Register Page",
      errorMsg: errors.array()[0].msg,
      oldFormData: { email, password },
    });
  }

  bcrypt
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
    })
    .catch((err) => console.log(err));
};

// render login page
exports.getLoginPage = (req, res) => {
  res.render("auth/login", {
    title: "Login Page",
    errorMsg: req.flash("error"),
    oldFormData: { email: "", password: "" },
  });
};

// handle login
exports.postLoginData = (req, res) => {
  // req.session.isLogin = true;
  // res.redirect("/");

  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      title: "Login Page",
      errorMsg: errors.array()[0].msg,
      oldFormData: { email, password },
    });
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(422).render("auth/login", {
          title: "Login Page",
          errorMsg: "Please enter valid email and password",
          oldFormData: { email, password },
        });
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
        res.status(422).render("auth/login", {
          title: "Login Page",
          errorMsg: "Please enter valid email and password",
          oldFormData: { email, password },
        });
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

// handle reset-password sent
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
            html: `<h1>Reset Password Now</h1><p>Change Your password. Is that you or not?. Bitch! I don't care. Just click the link below</p><a href="http://localhost:8080/reset-password/${token}" target="_blank">Clik Me To Change Your Password</a>`,
          },
          (err) => console.log(err)
        );
      })
      .catch((err) => console.log(err));
  });
};

// render new-password page
exports.getNewPassPage = (req, res) => {
  const { token } = req.params;
  console.log(token);
  User.findOne({
    resetToken: token,
    tokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      if (user) {
        res.render("auth/newpassword", {
          title: "Change Password",
          errorMsg: req.flash("error"),
          resetToken: token,
          user_id: user._id,
          oldFormData: { password: "", confirm_password: "" },
        });
      } else {
        res.redirect("/");
      }
    })
    .catch((err) => console.log(err));
};

// hanlde change new password
exports.changeNewPassword = (req, res) => {
  let resetUser;
  const { password, confirm_password, user_id, resetToken } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/newpassword", {
      title: "Change Password",
      resetToken,
      user_id,
      errorMsg: errors.array()[0].msg,
      oldFormData: { password, confirm_password },
    });
  }

  User.findOne({
    resetToken,
    tokenExpiration: { $gt: Date.now() },
    _id: user_id,
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(password, 10);
    })
    .then((hasPassword) => {
      resetUser.password = hasPassword;
      resetUser.resetToken = undefined;
      resetUser.tokenExpiration = undefined;
      return resetUser.save();
    })
    .then(() => {
      return res.redirect("/login");
    })
    .catch((err) => console.log(err));
};

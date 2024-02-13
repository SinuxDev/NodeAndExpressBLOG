const User = require("../models/user");

//render register page
exports.getRegisterPage = (req, res) => {
  res.render("auth/register", { title: "Register Page" });
};

//handle register
exports.createRegisterAccount = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        return res.redirect("/register");
      }
      return User.create({
        email,
        password,
      }).then((_) => {
        res.redirect("/login");
      });
    })
    .catch((err) => console.log(err));
};

// render logic page
exports.getLoginPage = (req, res) => {
  res.render("auth/login", { title: "Login Page" });
};

// handle login
exports.postLoginData = (req, res) => {
  req.session.isLogin = true;
  res.redirect("/");
};

// handle logout
exports.logout = (req, res) => {
  req.session.destroy((_) => {
    res.redirect("/");
  });
};

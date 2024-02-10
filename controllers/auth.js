exports.getLoginPage = (req, res) => {
  res.render("auth/login", { title: "Login Page" });
};

exports.postLoginData = (req, res) => {
  req.session.isLogin = true;
  res.redirect("/");
};

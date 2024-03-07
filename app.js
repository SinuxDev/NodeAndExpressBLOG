const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const ExpressSession = require("express-session");
const mongoStore = require("connect-mongodb-session")(ExpressSession);
const csrf = require("csurf");
const flash = require("connect-flash");

const app = express();
app.set("view engine", "ejs");
app.set("views", "views");

const postRoutes = require("./routes/post");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");

const User = require("./models/user");

const errorController = require("./controllers/errorController");

//Middleware
const { isLogin } = require("./middleware/is-login");

const store = new mongoStore({
  uri: process.env.MONGODB_URI,
  collection: "mySessions",
});

const csrfProtect = csrf();

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  ExpressSession({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    store,
  })
);

app.use(csrfProtect);
app.use(flash());

app.use((req, res, next) => {
  if (req.session.isLogin == undefined) {
    return next();
  }

  User.findById(req.session.userInfo._id)
    .select("_id email")
    .then((user) => {
      req.users = user;
      console.log(req.users);
      next();
    });
});

// to send CSRF Token For EveryPage Render
app.use((req, res, next) => {
  res.locals.isLogin = req.session.isLogin ? true : false;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/admin", isLogin, adminRoutes);
app.use(postRoutes);
app.use(authRoutes);

//For unknown request // render 404 page
app.all("*", errorController.get404Page);
app.use(errorController.get500Page);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    app.listen(8080);
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.log(err));

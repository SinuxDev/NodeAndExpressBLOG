const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const app = express();
app.set("view engine", "ejs");
app.set("views", "views");

const postRoutes = require("./routes/post");
const adminRoutes = require("./routes/admin");

const User = require("./models/user");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/admin", adminRoutes);
app.use(postRoutes);

app.use((req, res, next) => {
  User.findById("65bf2fa63c1cb350838ccaf2").then((user) => {
    req.user = user;
    console.log(user);
    next();
  });
});

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    app.listen(8080);
    console.log("Connected to MongoDB");
    return User.findOne().then((user) => {
      if (!user) {
        User.create({
          username: "Shin",
          email: "shin@gamil.com",
          password: "123456",
        });
      }
      return user;
    });
  })
  .then((result) => console.log(result))
  .catch((err) => console.log(err));

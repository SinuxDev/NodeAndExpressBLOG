const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const ExpressSession = require("express-session");
const mongoStore = require("connect-mongodb-session")(ExpressSession);

const app = express();
app.set("view engine", "ejs");
app.set("views", "views");

const postRoutes = require("./routes/post");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");

const User = require("./models/user");

const store = new mongoStore({
  uri: process.env.MONGODB_URI,
  collection: "mySessions",
});

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

// app.use((req, res, next) => {
//   User.findById("65bf2fa63c1cb350838ccaf2").then((user) => {
//     req.users = user;
//     next();
//   });
// });

app.use("/admin", adminRoutes);
app.use(postRoutes);
app.use(authRoutes);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    app.listen(8080);
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.log(err));

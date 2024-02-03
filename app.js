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

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/admin", adminRoutes);
app.use(postRoutes);

app.use((req, res, next) => {
  console.log("Parent Middleware!!!");
  next();
});

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    app.listen(8080);
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.log(err));

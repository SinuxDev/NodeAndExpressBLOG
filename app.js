const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs");
app.set("views", "views");

const postRoutes = require("./routes/post");
const adminRoutes = require("./routes/admin");

const mongodbConnector = require("./utils/database");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  console.log("Parent Middleware!!!");
  next();
});

app.use("/post", (req, res, next) => {
  console.log("Post Middleware!!!!");
  next();
});

app.use("/admin", (res, req, next) => {
  console.log("Admin Middleware approve!!!");
  next();
});

app.use("/admin", adminRoutes);
app.use(postRoutes);

mongodbConnector();
app.listen(8080);

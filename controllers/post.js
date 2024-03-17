const Post = require("../models/post");
const { validationResult } = require("express-validator");
const { formatISO9075 } = require("date-fns");
const pdf = require("pdf-creator-node");
const fs = require("fs");
const Expresspath = require("path");

const fileDelete = require("../utils/fileDelete");
const POST_PER_PAGE = 3;

exports.createPost = (req, res, next) => {
  const { title, description } = req.body;
  const image = req.file;
  console.log("Image info : " + JSON.stringify(image));
  const imageDBFormat = image.path;
  console.log(imageDBFormat);

  const errors = validationResult(req);

  if (image == undefined) {
    console.log("No image file received.");
    return res.status(422).render("addPost", {
      title: "Post Create Shin",
      errorMsg: "Image extension must be png,jpg,jpeg",
      oldFormData: { title, description },
    });
  }

  // if (!errors.isEmpty()) {
  //   return res.status(422).render("addPost", {
  //     title: "Post Create Shin",
  //     errorMsg: errors.array()[0].msg,
  //     oldFormData: { title, description },
  //   });
  // }

  Post.create({ title, description, imgUrl: imageDBFormat, userId: req.users })
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("Can't Create Post!Something went Wrong");
      return next(error);
    });
};

exports.renderCreatePage = (req, res, next) => {
  // res.sendFile(path.join(__dirname, "..", "views", "addPost.html"));
  res.render("addPost", {
    title: "Post Create Shin",
    errorMsg: "",
    oldFormData: { title: "", description: "", photo: "" },
  });
};

exports.renderHomePage = (req, res, next) => {
  // res.sendFile(path.join(__dirname, "..", "views", "homepage.html"));
  // const cookie = req.get("Cookie").split("=")[1].trim() == "true";

  const pageNumber = +req.query.page || 1;
  let totalPostNumber;
  Post.find()
    .countDocuments()
    .then((totalPost) => {
      totalPostNumber = totalPost;
      return Post.find()
        .select("title")
        .populate("userId", "email")
        .skip((pageNumber - 1) * POST_PER_PAGE) // page => 2 -1 = 1 || per page => 3 * 1 = 3
        .limit(POST_PER_PAGE)
        .sort({ createdAt: -1 });
    })
    .then((posts) => {
      if (posts.length > 0) {
        return res.render("home", {
          title: "Home Page",
          postsArr: posts,
          currentUserEmail: req.session.userInfo
            ? req.session.userInfo.email
            : "",
          currentPage: pageNumber,
          hasNextPage: POST_PER_PAGE * pageNumber < totalPostNumber,
          hasPreviousPage: pageNumber > 1,
          nextPage: pageNumber + 1,
          previousPage: pageNumber - 1,
        });
      } else {
        return res.status(500).render("error/500", {
          title: "Something Went Wrong",
          message: "There's no post you son of bitch",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("Someting Went Wrong");
      return next(error);
    });
};

exports.getPostDetails = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .populate("userId", "email")
    .then((post) =>
      res.render("details", {
        title: post.title,
        post,
        date: post.createdAt
          ? formatISO9075(post.createdAt, { representation: "date" })
          : undefined,
        currentLoginUserId: req.session.userInfo
          ? req.session.userInfo._id
          : "",
      })
    )
    .catch((err) => {
      console.log(err);
      const error = new Error("Post Not Found with this id!!");
      return next(error);
    });
};

exports.getEditPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        return res.redirect("/");
      }
      res.render("editPost", {
        title: post.title,
        post,
        errorMsg: "",
        oldFormData: { title: "", description: "" },
        isValidationFail: false,
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("Someting Went Wrong");
      return next(error);
    });
};

exports.updatePost = (req, res, next) => {
  const { title, description, postId } = req.body;
  const image = req.file;
  const errors = validationResult(req);

  // if (!errors.isEmpty()) {
  //   return res.status(422).render("editPost", {
  //     title,
  //     postId,
  //     errorMsg: errors.array()[0].msg,
  //     oldFormData: { title, description },
  //     isValidationFail: true,
  //   });
  // }

  Post.findById(postId)
    .then((post) => {
      if (post.userId.toString() !== req.users._id.toString()) {
        return res.redirect("/");
      }

      post.title = title;
      post.description = description;
      if (image) {
        fileDelete(post.imgUrl);
        post.imgUrl = image.path;
      }
      return post.save().then((result) => {
        console.log("Post Updated");
        res.redirect("/");
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("Someting Went Wrong");
      return next(error);
    });
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        return res.redirect("/");
      }
      fileDelete(post.imgUrl);
      return Post.deleteOne({ _id: postId, userId: req.users._id });
    })
    .then(() => {
      console.log("Post Deleted");
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("Someting Went Wrong");
      return next(error);
    });
};

exports.savePostAsPDF = (req, res, next) => {
  const id = req.params.id;
  const templateURL = `${Expresspath.join(
    __dirname,
    "../views/template",
    "template.html"
  )}`;
  const html = fs.readFileSync(templateURL, "utf8");
  const options = {
    format: "A3",
    orientation: "portrait",
    border: "10mm",
    header: {
      height: "20mm",
      contents:
        '<h4 style="text-align: center;">PDF Download From SHINBLOG</h4>',
    },
  };
  Post.findById(id)
    .populate("userId", "email")
    .lean()
    .then((post) => {
      const date = new Date();
      const pdfSaveURL = `${Expresspath.join(
        __dirname,
        "../public/pdf",
        date.getTime() + ".pdf"
      )}`;
      const document = {
        html,
        data: {
          post,
        },
        path: pdfSaveURL,
        type: "",
      };
      pdf
        .create(document, options)
        .then((pdfResult) => {
          console.log(pdfResult);
          res.download(pdfSaveURL, (err) => {
            if (err) {
              console.log(err);
              const error = new Error("Something went wrong");
              return next(error);
            }
            fileDelete(pdfSaveURL); // Delete the PDF file after it's downloaded
          });
        })
        .catch((error) => {
          console.error(error);
          next(error);
        });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("Something went wrong");
      return next(error);
    });
};

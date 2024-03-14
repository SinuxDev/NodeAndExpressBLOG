const express = require("express");
const postController = require("../controllers/post");

const router = express.Router();

router.get("/", postController.renderHomePage);
router.get("/post/:postId", postController.getPostDetails);

router.get("/save/:id", postController.savePostAsPDF);

module.exports = router;

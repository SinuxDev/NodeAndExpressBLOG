const express = require("express");
const postController = require("../controllers/post");

const router = express.Router();

router.get("/", postController.renderHomePage);
router.get("/post/:postId", postController.getPostDetails);

module.exports = router;

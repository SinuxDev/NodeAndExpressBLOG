const express = require("express");
const postController = require("../controllers/post");

const router = express.Router();

router.get("/", postController.getPosts);
router.get("/post/:postId", postController.getPostDetails);

module.exports = router;

const mongoDb = require("mongodb");
const { getDataBase } = require("../utils/database");
class Post {
  constructor(title, description, imgUrl) {
    this.title = title;
    this.description = description;
    this.imgUrl = imgUrl;
  }

  create() {
    const db = getDataBase();
    return db
      .collection("posts")
      .insertOne(this)
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  }

  static getPosts() {
    const db = getDataBase();
    return db
      .collection("posts")
      .find()
      .toArray()
      .then((posts) => {
        console.log(posts);
        return posts;
      })
      .catch((err) => console.log(err));
  }

  static getPostDetail(postId) {
    const db = getDataBase();
    return db
      .collection("posts")
      .find({ _id: new mongoDb.ObjectId(postId) })
      .next()
      .then((post) => {
        console.log(post);
        return post;
      })
      .catch((err) => console.log(err));
  }
}

module.exports = Post;

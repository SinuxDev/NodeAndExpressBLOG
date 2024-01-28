const mongoDb = require("mongodb");
const { getDataBase } = require("../utils/database");
class Post {
  constructor(title, description, imgUrl, id) {
    this.title = title;
    this.description = description;
    this.imgUrl = imgUrl;
    this._id = id ? new mongoDb.ObjectId(id) : null;
  }

  create() {
    const db = getDataBase();
    let dbTmp;

    if (this._id) {
      //update post
      dbTmp = db
        .collection("posts")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbTmp = db.collection("posts").insertOne(this); // create
    }
    return dbTmp
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  }

  static getPosts() {
    const db = getDataBase();
    return db
      .collection("posts", { locale: "en", caseLevel: true })
      .find()
      .sort({ title: 1 })
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

  static deletePost(postId) {
    const db = getDataBase();
    return db
      .collection("posts")
      .deleteOne({ _id: new mongoDb.ObjectId(postId) })
      .then((result) => {
        console.log("Post Deleted");
      })
      .catch((err) => console.log(err));
  }
}

module.exports = Post;

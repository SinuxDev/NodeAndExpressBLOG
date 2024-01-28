const mongodb = require("mongodb");
const mongodbClient = mongodb.MongoClient;
const dotenv = require("dotenv").config();
//dontenv.config

let db;

const mongodbConnector = () => {
  mongodbClient
    .connect(process.env.MONGODB_URL)
    .then((result) => {
      console.log("Connected To Database");
      db = result.db();
      console.log(result);
    })
    .catch((err) => console.log(err));
};

const getDataBase = () => {
  if (db) {
    return db;
  }

  throw "No Database";
};

module.exports = { mongodbConnector, getDataBase };

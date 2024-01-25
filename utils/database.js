const mongodb = require("mongodb");
const mongodbClient = mongodb.MongoClient;
const dotenv = require("dotenv").config();
//dontenv.config

const mongodbConnector = () => {
  mongodbClient
    .connect(process.env.MONGODB_URL)
    .then((result) => {
      console.log("Connected To Database");
      console.log(result);
    })
    .catch((err) => console.log(err));
};

module.exports = mongodbConnector;

const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

//posts => post / products => product / users => user

const Post = sequelize.define("post", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  imgUrl: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
});

module.exports = Post;

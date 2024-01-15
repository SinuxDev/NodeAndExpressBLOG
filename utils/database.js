const Sequelize = require("sequelize");

const sequelize = new Sequelize("nodejsblog", "root", "root", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;

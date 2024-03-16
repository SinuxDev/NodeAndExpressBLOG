const fs = require("fs");

const fileDelete = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
    console.log("File was deleted");
  });
};

module.exports = fileDelete;

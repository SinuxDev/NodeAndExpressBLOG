const fs = require("fs");

const fileDelete = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
    console.log("Photo was deleted");
  });
};

module.exports = fileDelete;

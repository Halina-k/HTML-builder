const fs = require('fs');
const path = require('path');

fs.readdir(path.resolve(__dirname, 'secret-folder'), (err, files) => {
  if (err)
    console.log(err);
  else {
    files.forEach(file => {
      let index = file.lastIndexOf('.');
      let filename = index === -1 ? file : file.slice(0, index);
      let fileext = path.extname(path.resolve(__dirname, `secret-folder/${file}`)).slice(1);
      fs.stat(path.resolve(__dirname, `secret-folder/${file}`), (error, stats) => {
        if (error) {
          console.log(error);
        }
        else {
          if (stats.isFile()) {
            console.log(`${filename} - ${fileext} - ${stats.size} bytes`);
          }
        }
      });
    });
  }
});

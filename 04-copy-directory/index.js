const fs = require('fs');
const path = require('path');

fs.mkdir(path.resolve(__dirname, 'files-copy'), { recursive: true }, (err) => {
  if (err) {
    console.error(err);
  }
});

let arrFiles;

fs.readdir(path.resolve(__dirname, 'files'), (err, files) => {
  if (err)
    console.log(err);
  else {
    arrFiles = files;
    files.forEach(file => {

      fs.copyFile(path.resolve(__dirname, `files/${file}`), path.resolve(__dirname, `files-copy/${file}`), (err) => {
        if (err) {
          console.error(err);
        }
      });

    });
  }
});

fs.readdir(path.resolve(__dirname, 'files-copy'), (err, files) => {
  if (err) {
    console.log(err);
  } else {
    files.forEach(file => {
      if (!arrFiles.includes(file)) {
        fs.unlink(path.resolve(__dirname, `files-copy/${file}`), function(err){
          if (err) {
            console.log(err);
          }
        });
      }
    });
  }
});
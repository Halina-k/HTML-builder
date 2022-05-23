const fs = require('fs');
const path = require('path');

async function copyDir () {
  await fs.promises.rm(path.resolve(__dirname, 'files-copy'), { recursive: true, force: true });

  checkCopying ('files', 'files-copy');

  async function checkCopying (initial, resulting) {

    await fs.promises.mkdir(path.resolve(__dirname, resulting), { recursive: true });

    fs.readdir(path.resolve(__dirname, initial), {withFileTypes: true}, (err, files) => {
      if (err)
        console.log(err);
      else {

        files.forEach(file => {  
          if (!file.isDirectory()) {
            fs.copyFile(path.resolve(__dirname, initial, file.name), path.resolve(__dirname, resulting, file.name), (err) => {
              if (err) {
                console.error(err);
              }
            });
          } else {
            checkCopying (`${initial}/${file.name}`, `${resulting}/${file.name}`);
          }
        });
      }
    });
  }

}

copyDir ();

 



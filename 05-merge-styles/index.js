const fs = require('fs');
const path = require('path');

const outputStream = fs.createWriteStream(path.resolve(__dirname, 'project-dist/bundle.css'));

fs.readdir(path.resolve(__dirname, 'styles'), { withFileTypes: true }, (err, files) => {
  if (err) {
    console.log(err);
  } else {
    files.forEach(file => {
      if (path.extname(path.resolve(__dirname, `styles/${file.name}`)) === '.css' && !file.isDirectory()) {
        const str = fs.createReadStream(path.resolve(__dirname, `styles/${file.name}`), 'utf-8');
        let data = '';
        str.on('data', chunk => data += chunk);
        str.on('end', () => outputStream.write(data));
      }
    });
  }

});





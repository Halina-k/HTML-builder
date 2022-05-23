const fs = require('fs');
const path = require('path');
const { Transform } = require ('stream');


// создание html

const destDir = path.resolve(__dirname, 'project-dist');

(async () => {
  await fs.promises.mkdir(destDir, { recursive: true });
 
  const reader = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
  const writer = fs.createWriteStream(path.join(destDir, 'index.html'), 'utf-8');
 
  const replacePlaceholder = new Transform({
 
    async transform(chunk, encoding, callback) {
      chunk = chunk.toString();
      let regexp = /{{(.*?)}}/g;
      const found = [...chunk.matchAll(regexp)];


      for (const item of found) {
        try {
          const itemReader = fs.createReadStream(path.join(__dirname, 'components', `${item[1]}.html`), 'utf-8');
          let itemChunks = '';
          for await (const itemChunk of itemReader) {
            itemChunks += itemChunk;
          }
          chunk = chunk.replace(item[0], itemChunks);
        }

        catch (error) {
          console.log(`Модуль ${item[1]}.html не найден в папке components`);
        }
      }
      callback(null, chunk);
    },
  });
 
  reader.pipe(replacePlaceholder).pipe(writer);
 
})();


// сборка стилей

const outputStream = fs.createWriteStream(path.resolve(__dirname, 'project-dist', 'style.css'));
fs.readdir(path.resolve(__dirname, 'styles'), {withFileTypes: true}, (err, files) => {
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


// копирование assets

(async () => {
  await fs.promises.rmdir(path.resolve(__dirname, 'project-dist', 'assets'), { recursive: true });
  checkCopying ('assets', 'project-dist/assets');
})();

function checkCopying (initial, resulting) {

  fs.mkdir(path.resolve(__dirname, resulting), { recursive: true }, (err) => {
    if (err) {
      console.error(err);
    }
  });

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









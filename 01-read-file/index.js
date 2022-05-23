const fs = require('fs');
const path = require('path');

const str = fs.createReadStream(path.resolve(__dirname, 'text.txt'), 'utf-8');

let data = '';
str.on('data', chunk => data += chunk);
str.on('end', () => console.log(data));
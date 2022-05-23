const fs = require('fs');
const path = require('path');

const outputStream = fs.createWriteStream(path.resolve(__dirname, 'text.txt'));

const { stdin, stdout } = process;
stdout.write('Привет! Как тебя зовут?\n');
stdin.on('data', data => data.toString().trim() === 'exit' ? process.exit() : outputStream.write(data));

process.on('exit', () => stdout.write('Приятно познакомиться! Удачи на курсе!\n'));

process.on('SIGINT', () => process.exit());

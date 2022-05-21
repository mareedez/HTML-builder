const path = require('path');
const fs = require('fs');
const readline = require('readline');

const stream = fs.createWriteStream(path.join(__dirname, 'text.txt'), 'utf-8');
console.log('Enter your text:');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', input => {
  if(input === 'exit') {
    rl.close();
  }
  stream.write(input + '\n');
});

rl.on('close', function() {
  console.log('\nSee you later!');
  process.exit(0);
});

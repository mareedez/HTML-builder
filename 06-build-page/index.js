const fs = require('fs');
const path = require('path/posix');


async function makeStyle(styles){
  const streamWrite = new fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));
  let files = await fs.promises.readdir(styles, {withFileTypes:true});
  files = files.filter(file => file.name.slice(-4) === '.css' && file.isFile());
  files.forEach(file => {
    const fileLocation = path.join(styles, file.name);
    let stylesArray = [];
    let readFile = fs.createReadStream(fileLocation, 'utf-8');
    readFile.on('data', chunk => stylesArray.push(chunk));
    readFile.on('end', () => stylesArray.forEach(file => streamWrite.write(`${file}\n`)));
  });
}

async function assemble() {
  await makeStyle(path.join(__dirname, 'styles'));
}

assemble();

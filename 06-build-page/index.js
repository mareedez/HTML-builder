const fs = require('fs');
const path = require('path/posix');


async function makeDir(path) {
  await fs.promises.rm(path, { recursive: true, force: true });
  await fs.promises.mkdir(path, {recursive: true});
}


async function cloneDir(source, destination){
  await fs.promises.rm(destination, {recursive: true, force: true});
  await fs.promises.mkdir(destination, {recursive: true});
  let files = await fs.promises.readdir(source, {withFileTypes: true});
  files.forEach((file) => {
    let fileSource = path.join(source, file.name);
    let fileDestination = path.join(destination, file.name);
    if(file.isDirectory()){
      cloneDir(fileSource, fileDestination);
    } else {
      try {
        fs.promises.copyFile(path.join(source, file.name), path.join(destination, file.name));
      } catch {
        console.log(`${file} could not be copied`);
      }
    }
  });
}

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

async function makeHtml(html) {
  let data = '';
  let readStream = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
  let files = await fs.promises.readdir(html, {withFileTypes: true});

  readStream.on('data', chunk => data += chunk);
  readStream.on('end', async () => {
    files.forEach(file => {
      if (file.isFile()) {
        const readFile = fs.createReadStream(path.join(__dirname, 'components', file.name), 'utf-8');
        let htmlPiece = '';
        const name = file.name.split('.')[0];
        readFile.on('data', chunk => htmlPiece += chunk);
        readFile.on('end', () => {
          data = data.replace(`{{${name}}}`, htmlPiece);
          const writeFile = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
          writeFile.write(data);
        });
      }
    });
  });
}

async function assemble() {
  await makeDir(path.join(__dirname, 'project-dist'));
  await cloneDir(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));
  await makeHtml(path.join(__dirname, 'components'));
  await makeStyle(path.join(__dirname, 'styles'));
}

assemble();

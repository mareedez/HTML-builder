const fs = require('fs');
const path = require('path/posix');


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

async function assemble() {
  await cloneDir(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));
  await makeStyle(path.join(__dirname, 'styles'));
}

assemble();

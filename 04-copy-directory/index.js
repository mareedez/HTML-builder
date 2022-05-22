const fs = require('fs');
const path = require('path');


const copySource = path.join(__dirname, 'files');
const copyDestination = path.join(__dirname, 'files-copy');

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

cloneDir(copySource, copyDestination);


const fs = require('fs');
const path = require('path');


const copySource = path.join(__dirname, 'files');
const copyDestination = path.join(__dirname, 'files-copy');


async function cloneDir(){
  await fs.promises.rm(copyDestination, {recursive: true, force: true});
  await fs.promises.mkdir(copyDestination, {recursive: true});
  const files = await fs.promises.readdir(copySource);
  files.forEach((file) => {
    try {
      fs.promises.copyFile(path.join(copySource, file), path.join(copyDestination, file));
    } catch {
      console.log(`${file} could not be copied`);
    }
  });
}

cloneDir();

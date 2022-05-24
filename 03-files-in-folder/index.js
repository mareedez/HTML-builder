const path = require('path');
const fs = require('fs/promises');

const directory = path.join(__dirname, 'secret-folder');

async function readFiles(){
  try {
    const files = await fs.readdir(directory, {withFileTypes: true});
    for(let file of files){
      const data = await fs.stat(path.join(directory, file.name));
      if(data.isFile()){
        const name = file.name.slice(0, file.name.lastIndexOf('.'));
        const size = `${data.size}b`;
        const extension = path.extname(file.name);
        console.log(name, extension, size);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

readFiles();

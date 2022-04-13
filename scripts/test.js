const { readFileSync } = require('fs');
const { join } = require('path');

const { fileListFromZip, fileListUngzip } = require('../lib/index.js');

const data = readFileSync(
  join(__dirname, '../../../../Downloads/0001001_0002000.zip'),
);

async function doAll() {
  const fileList = await fileListFromZip(data);
  const ungzippedFileList = await fileListUngzip(fileList);
  for (let file of ungzippedFileList) {
    const data = await file.text();
    const object = JSON.parse(data);
    console.log(object);
    console.log(file.name, data.byteLength);
  }
}

doAll();

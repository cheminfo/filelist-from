// https://ftp.ncbi.nlm.nih.gov/pubchem/Bioassay/JSON/

const { readFileSync } = require('fs');
const { join } = require('path');

const {
  fileCollectionFromZip,
  fileCollectionItemsUngzip,
} = require('../lib/index.js');

const data = readFileSync(
  join(__dirname, '../../../../Downloads/0001001_0002000.zip'),
);

async function doAll() {
  const fileCollection = await fileCollectionFromZip(data);
  const ungzippedFileCollection = await fileCollectionItemsUngzip(
    fileCollection,
  );
  for (let file of ungzippedFileCollection) {
    const data = await file.text();
    const object = JSON.parse(data);
    console.log(object);
    console.log(file.name, data.byteLength);
  }
}

doAll();

// creates a fileCollection from a local FS path
export * from './fileCollectionFromPath';
export * from './fileCollectionFromPaths';
// creates a fileCollection from the zip content
export { fileCollectionFromZip } from './fileCollectionFromZip';

// creates a fileCollection from a URL to a zip file
export * from './fileCollectionFromZipURL';

// creates a fileCollection from a FileList that is obtained from a drag / drop in the browser
export * from './fileCollectionFromFileList';
// you can also create a fileCollection from a list of files (native File objects from the browser)
export * from './fileCollectionFromFiles';

// creates a fileCollection from a URL to a webservice that returns a list of files
export * from './fileCollectionFromWebservice';
export * from './fileCollectionFromFileArray';

export * from './groupFiles';

// typescript types
export * from './FileCollection';
export * from './FileCollectionItem';

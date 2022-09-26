import { FileCollection } from './FileCollection';

/**
 * Generate a FileCollection from a directory path
 * By default this method will expand all zip and gzip files
 * @param path
 * @returns
 */
export function fileCollectionFromFileList(fileList: FileList): FileCollection {
  //@ts-expect-error is this due to different of stream ? not a web stream ?
  return Array.from(fileList, (file) => ({
    name: file.name,
    size: file.size,
    relativePath: file.webkitRelativePath,
    lastModified: file.lastModified,
    text: () => file.text(),
    arrayBuffer: () => file.arrayBuffer(),
    stream: () => file.stream(),
  }));
}

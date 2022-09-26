import { FileCollection } from './FileCollection';

/**
 * Generate a FileCollection from a directory path
 * By default this method will expand all zip and gzip files
 * @param path
 * @returns
 */
export async function fileCollectionFromFileList(
  fileList: FileList,
): Promise<FileCollection> {
  const results: FileCollection = [];
  for (let file of fileList) {
    results.push({
      name: file.name,
      size: file.size,
      relativePath: file.webkitRelativePath,
      lastModified: file.lastModified,
      text: file.text,
      arrayBuffer: file.arrayBuffer,
      stream: file.stream,
    });
  }
  return results;
}

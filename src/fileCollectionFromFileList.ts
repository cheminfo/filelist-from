import { ExpandOptions } from './ExpandOptions';
import { FileCollection } from './FileCollection';
import { maybeExpand } from './utilities/maybeExpand';

/**
 * Generate a FileCollection from a directory path
 * By default this method will expand all zip and gzip files
 * @param path
 * @returns
 */
export async function fileCollectionFromFileList(
  fileList: FileList,
  options: ExpandOptions = {},
): Promise<FileCollection> {
  //TODO check why this is happening
  //@ts-expect-error is this due to different of stream ? not a web stream ?
  const fileCollection: FileCollection = Array.from(fileList, (file) => ({
    name: file.name,
    size: file.size,
    relativePath: file.webkitRelativePath,
    lastModified: file.lastModified,
    text: () => file.text(),
    arrayBuffer: () => file.arrayBuffer(),
    stream: () => file.stream(),
  }));

  return maybeExpand(fileCollection, options);
}

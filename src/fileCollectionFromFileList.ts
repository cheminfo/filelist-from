import { ExpandOptions } from './ExpandOptions';
import { FileCollection } from './FileCollection';
import { maybeExpand } from './utilities/maybeExpand';

/**
 * Generate a FileCollection from a FileList
 * FileList is the native API from the browser however in order to use this function
 * the File need the webkitRelativePath property. This property is added by the browser
 * if the input element has the webkitdirectory property like for example
 * `<input type="file" webkitdirectory/>'
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
  const fileCollection: FileCollection = Array.from(fileList, (file) => {
    if (!file.webkitRelativePath) {
      throw new Error(
        'The File of FileList must have the property webkitRelativePath. Did you forget to add the webkitdirectory property in the input element ?',
      );
    }
    return {
      name: file.name,
      size: file.size,
      relativePath: file.webkitRelativePath,
      lastModified: file.lastModified,
      text: () => file.text(),
      arrayBuffer: () => file.arrayBuffer(),
      stream: () => file.stream(),
    };
  });

  return maybeExpand(fileCollection, options);
}

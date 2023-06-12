import { FileCollection } from './FileCollection';
import { FileCollectionItem } from './FileCollectionItem';
import { Options } from './Options';
import { expandAndFilter } from './utilities/expand/expandAndFilter';
import { sortCollectionItems } from './utilities/sortCollectionItems';

/**
 * Generate a FileCollection from a FileList
 * FileList is the native API from the browser however in order to use this function
 * the File need the webkitRelativePath property. This property is added by the browser
 * if the input element has the webkitdirectory property like for example
 * `<input type="file" webkitdirectory/>'
 * By default this method will expand all zip and gzip files
 * @param fileList - iterable object obtained using a input type="file" with webkitRelativePath property
 * @returns
 */
export async function fileCollectionFromFileList(
  fileList: FileList,
  options: Options = {},
): Promise<FileCollection> {
  let fileCollectionItems: FileCollectionItem[] = [];

  for (const file of fileList) {
    const item = {
      name: file.name,
      size: file.size,
      //@ts-expect-error We allow file.path as alternative to webkitRelativePath
      relativePath: file.webkitRelativePath || file.path || file.name,
      lastModified: file.lastModified,
      text: () => file.text(),
      arrayBuffer: () => file.arrayBuffer(),
      stream: () => file.stream(),
    };
    fileCollectionItems.push(...(await expandAndFilter(item, options)));
  }

  sortCollectionItems(fileCollectionItems);
  return new FileCollection(fileCollectionItems);
}

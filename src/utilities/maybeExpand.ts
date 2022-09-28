import { ExpandOptions } from '../ExpandOptions';
import { FileCollection } from '../FileCollection';
import { fileCollectionUngzip } from '../fileCollectionUngzip';
import { fileCollectionUnzip } from '../fileCollectionUnzip';

/**
 * Utility function that allows to expand gzip and zip files without really expanding them
 * @param fileCollection
 * @param options
 * @returns
 */
export async function maybeExpand(
  fileCollection: FileCollection,
  options: ExpandOptions,
): Promise<FileCollection> {
  const { unzip = {}, ungzip = {} } = options;
  fileCollection = await fileCollectionUnzip(fileCollection, unzip);
  fileCollection = await fileCollectionUngzip(fileCollection, ungzip);
  return fileCollection;
}

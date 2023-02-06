import { ExpandOptions } from '../ExpandOptions';
import { FileCollectionItem } from '../FileCollectionItem';
import { fileCollectionItemsUngzip } from '../fileCollectionItemsUngzip';
import { fileCollectionItemsUnzip } from '../fileCollectionItemsUnzip';

/**
 * Utility function that allows to expand gzip and zip files without really expanding them
 * @param fileCollection
 * @param options
 * @returns
 */
export async function maybeExpand(
  fileCollectionItems: FileCollectionItem[],
  options: ExpandOptions,
): Promise<FileCollectionItem[]> {
  const { unzip = {}, ungzip = {} } = options;
  fileCollectionItems = await fileCollectionItemsUnzip(
    fileCollectionItems,
    unzip,
  );
  fileCollectionItems = await fileCollectionItemsUngzip(
    fileCollectionItems,
    ungzip,
  );
  return fileCollectionItems;
}

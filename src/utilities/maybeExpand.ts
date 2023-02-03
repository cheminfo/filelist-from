import { ExpandOptions } from '../ExpandOptions';
import { FileCollectionItem } from '../FileCollectionItem';
import { fileCollectionItemsUngzip } from '../fileCollectionItemsUngzip';
import { fileCollectionItemsUnzip } from '../fileCollectionItemsUnzip';

import { FilterOptions } from './maybeFilter';

/**
 * Utility function that allows to expand gzip and zip files without really expanding them
 * @param fileCollection
 * @param options
 * @returns
 */
export async function maybeExpand(
  fileCollectionItems: FileCollectionItem[],
  options: ExpandOptions & FilterOptions,
): Promise<FileCollectionItem[]> {
  const { unzip = {}, ungzip = {}, ...res } = options;
  fileCollectionItems = await fileCollectionItemsUnzip(fileCollectionItems, {
    ...unzip,
    ...res,
  });
  fileCollectionItems = await fileCollectionItemsUngzip(fileCollectionItems, {
    ...ungzip,
    ...res,
  });
  return fileCollectionItems;
}

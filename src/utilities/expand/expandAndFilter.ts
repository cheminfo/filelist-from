import { FileCollectionItem } from '../../FileCollectionItem';
import { Options } from '../../Options';
import { shouldAddItem } from '../shouldAddItem';

import { fileCollectionItemUngzip } from './fileCollectionItemUngzip';
import { fileCollectionItemUnzip } from './fileCollectionItemUnzip';

/**
 * Utility function that allows to expand gzip and zip files without really expanding them
 * @param fileCollection
 * @param options
 * @returns
 */
export async function expandAndFilter(
  fileCollectionItem: FileCollectionItem,
  options: Options = {},
): Promise<FileCollectionItem[]> {
  const { filter = {} } = options;

  if (!shouldAddItem(fileCollectionItem.relativePath, filter)) {
    return [];
  }

  fileCollectionItem = await fileCollectionItemUngzip(
    fileCollectionItem,
    options,
  );

  const fileCollectionItems = fileCollectionItemUnzip(
    fileCollectionItem,
    options,
  );

  return fileCollectionItems;
}

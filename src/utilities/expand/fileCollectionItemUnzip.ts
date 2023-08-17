import { FileCollectionItem } from '../../FileCollectionItem';
import { Options } from '../../Options';
import { fileCollectionItemsFromZip } from '../../fileCollectionFromZip';
import { shouldAddItem } from '../shouldAddItem';

import { expandAndFilter } from './expandAndFilter';

/**
 * Some files in the fileCollectionItems may actually be zip. This method will unzip those files.
 * The method will actually not really unzip the files but only add them in the fileCollectionItems.
 * Unzipping will only take place when you want to actually retrieve the data.
 * @param fileCollectionItems
 * @param options
 * @returns
 */

export async function fileCollectionItemUnzip(
  fileCollectionItem: FileCollectionItem,
  options: Options = {},
): Promise<FileCollectionItem[]> {
  const { unzip = {}, filter = {}, logger } = options;
  const { recursive = true } = unzip;
  let { zipExtensions = ['zip'] } = unzip;
  zipExtensions = zipExtensions.map((extension) => extension.toLowerCase());
  const extension = fileCollectionItem.name.replace(/^.*\./, '').toLowerCase();

  if (!zipExtensions.includes(extension)) {
    return [fileCollectionItem];
  }

  const buffer = await fileCollectionItem.arrayBuffer();

  if (!isZip(buffer)) {
    if (logger) {
      logger.info(
        `Could not unzip the following file: ${fileCollectionItem.relativePath}`,
      );
    }
    return [fileCollectionItem];
  }
  const zipFileCollectionItems = await fileCollectionItemsFromZip(
    buffer,
    options,
  );

  const fileCollectionItems: FileCollectionItem[] = [];
  for (const zipEntry of zipFileCollectionItems) {
    zipEntry.relativePath = `${fileCollectionItem.relativePath}/${zipEntry.relativePath}`;
    if (recursive) {
      fileCollectionItems.push(...(await expandAndFilter(zipEntry, options)));
    } else if (shouldAddItem(zipEntry.relativePath, filter)) {
      fileCollectionItems.push(zipEntry);
    }
  }

  return fileCollectionItems;
}

function isZip(buffer: ArrayBuffer) {
  if (buffer.byteLength < 5) return false;
  const bytes = new Uint8Array(buffer);
  return (
    bytes[0] === 0x50 &&
    bytes[1] === 0x4b &&
    (bytes[2] === 0x03 || bytes[2] === 0x05 || bytes[2] === 0x07) &&
    (bytes[3] === 0x04 || bytes[3] === 0x06 || bytes[3] === 0x08)
  );
}

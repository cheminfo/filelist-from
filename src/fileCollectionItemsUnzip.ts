import { FileCollectionItem } from './FileCollectionItem';
import { fileCollectionItemsFromZip } from './fileCollectionFromZip';

/**
 * Some files in the fileCollectionItems may actually be zip. This method will unzip those files.
 * The method will actually not really unzip the files but only add them in the fileCollectionItems.
 * Unzipping will only take place when you want to actually retrieve the data.
 * @param fileCollectionItems
 * @param options
 * @returns
 */

export async function fileCollectionItemsUnzip(
  fileCollectionItems: FileCollectionItem[],
  options: {
    /**
  Case insensitive list of extensions that are zip files
  We will check anyway if the first 4 bytes
  @default ['zip']
  */
    zipExtensions?: string[];
  } = {},
): Promise<FileCollectionItem[]> {
  let { zipExtensions = ['zip'] } = options;
  zipExtensions = zipExtensions.map((extension) => extension.toLowerCase());
  fileCollectionItems = fileCollectionItems.slice(0);
  for (let i = 0; i < fileCollectionItems.length; i++) {
    const file = fileCollectionItems[i];
    const extension = file.name.replace(/^.*\./, '').toLowerCase();
    if (!zipExtensions.includes(extension)) {
      continue;
    }

    const buffer = await file.arrayBuffer();
    if (!isZip(buffer)) {
      continue;
    }
    const zipFileCollectionItems = await fileCollectionItemsFromZip(buffer);

    for (let zipEntry of zipFileCollectionItems) {
      zipEntry.relativePath = `${file.relativePath}/${zipEntry.relativePath}`;
      fileCollectionItems.push(zipEntry);
    }
    fileCollectionItems.splice(i, 1);
    i--;
  }

  return fileCollectionItems.sort((a, b) =>
    a.relativePath < b.relativePath ? -1 : 1,
  );
}

function isZip(buffer: ArrayBuffer) {
  const isZip = buffer.byteLength < 4;
  if (!isZip) {
    const bytes = new Uint8Array(buffer);
    return (
      bytes[0] === 0x50 &&
      bytes[1] === 0x4b &&
      (bytes[2] === 0x03 || bytes[2] === 0x05 || bytes[2] === 0x07) &&
      (bytes[3] === 0x04 || bytes[3] === 0x06 || bytes[3] === 0x08)
    );
  }
  return isZip;
}

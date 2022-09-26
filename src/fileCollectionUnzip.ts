import { FileCollection } from './FileCollection';
import { FileItem } from './FileItem';
import { fileCollectionFromZip } from './fileCollectionFromZip';

/**
 * Some files in the fileCollection may actually be zip. This method will unzip those files.
 * The method will actually not really unzip the files but only add them in the fileCollection.
 * Unzipping will only take place when you want to actually retrieve the data.
 * @param fileCollection
 * @param options
 * @returns
 */

export async function fileCollectionUnzip(
  fileCollection: FileCollection,
  options: {
    /**
  Case insensitive list of extensions that are zip files
  We will check anyway if the first 4 bytes
  @default ['zip']
  */
    zipExtensions?: string[];
  } = {},
): Promise<FileCollection> {
  let { zipExtensions = ['zip'] } = options;
  zipExtensions = zipExtensions.map((extension) => extension.toLowerCase());
  fileCollection = fileCollection.slice(0);
  for (let i = 0; i < fileCollection.length; i++) {
    const file = fileCollection[i];
    const extension = file.name.replace(/^.*\./, '').toLowerCase();
    if (!zipExtensions.includes(extension)) {
      continue;
    }

    if (!(await isZip(file))) {
      continue;
    }
    const zipFileCollection = await fileCollectionFromZip(
      await file.arrayBuffer(),
    );
    for (let zipEntry of zipFileCollection) {
      zipEntry.relativePath = `${file.relativePath}/${zipEntry.relativePath}`;
      fileCollection.push(zipEntry);
    }
    fileCollection.splice(i, 1);
    i--;
  }

  return fileCollection.sort((a, b) =>
    a.relativePath < b.relativePath ? -1 : 1,
  );
}

async function isZip(file: FileItem) {
  const buffer = await file.arrayBuffer();
  if (buffer.byteLength < 4) return false;
  const bytes = new Uint8Array(buffer);

  return (
    bytes[0] === 0x50 &&
    bytes[1] === 0x4b &&
    (bytes[2] === 0x03 || bytes[2] === 0x05 || bytes[2] === 0x07) &&
    (bytes[3] === 0x04 || bytes[3] === 0x06 || bytes[3] === 0x08)
  );
}

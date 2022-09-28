import { ungzip } from 'pako';

import { FileCollection } from './FileCollection';
import { FileCollectionItem } from './FileCollectionItem';
import { ungzipStream } from './ungzipStream';

/**
 * Some files in the fileCollection may actually be gzip. This method will ungzip those files.
 * The method will actually not really ungzip the files but decompress them if you need.
 * During this process the extension .gz will be removed
 * @param fileCollection
 * @param options
 * @returns
 */

export async function fileCollectionUngzip(
  fileCollection: FileCollection,
  options: {
    /**
  Case insensitive list of extensions that are zip files
  We will check anyway if the first 4 bytes
  @default ['gz']
  */
    gzipExtensions?: string[];
  } = {},
): Promise<FileCollection> {
  let { gzipExtensions = ['gz'] } = options;
  gzipExtensions = gzipExtensions.map((extension) => extension.toLowerCase());
  fileCollection = fileCollection.slice(0);
  for (let i = 0; i < fileCollection.length; i++) {
    const file = fileCollection[i];
    const extension = file.name.replace(/^.*\./, '').toLowerCase();
    if (!gzipExtensions.includes(extension)) {
      continue;
    }

    if (!(await isGzip(file))) {
      continue;
    }

    fileCollection.push({
      name: file.name.replace(/\.[^.]+$/, ''),
      size: file.size,
      relativePath: file.relativePath,
      lastModified: file.lastModified,
      text: (): Promise<string> => {
        return file.arrayBuffer().then((arrayBuffer) => {
          const decoder = new TextDecoder('utf8');
          return decoder.decode(ungzip(new Uint8Array(arrayBuffer)));
        });
      },
      arrayBuffer: (): Promise<ArrayBuffer> => {
        return file
          .arrayBuffer()
          .then((arrayBuffer) => ungzip(new Uint8Array(arrayBuffer)));
      },
      stream: () => {
        return ungzipStream(file);
      },
    });

    fileCollection.splice(i, 1);
    i--;
  }

  return fileCollection.sort((a, b) =>
    a.relativePath < b.relativePath ? -1 : 1,
  );
}

async function isGzip(file: FileCollectionItem) {
  const buffer = await file.arrayBuffer();
  if (buffer.byteLength < 2) return false;
  const bytes = new Uint8Array(buffer);

  return bytes[0] === 0x1f && bytes[1] === 0x8b;
}

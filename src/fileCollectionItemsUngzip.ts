import { ungzip } from 'pako';

import { FileCollectionItem } from './FileCollectionItem';
import { ungzipStream } from './ungzipStream';
import { FilterOptions, maybeFilter } from './utilities/maybeFilter';

/**
 * Some files in the fileCollectionItems may actually be gzip. This method will ungzip those files.
 * The method will actually not really ungzip the files but decompress them if you need.
 * During this process the extension .gz will be removed
 * @param fileCollectionItems
 * @param options
 * @returns
 */

export async function fileCollectionItemsUngzip(
  fileCollectionItems: FileCollectionItem[],
  options: {
    /**
  Case insensitive list of extensions that are zip files
  We will check anyway if the first 4 bytes
  @default ['gz']
  */
    gzipExtensions?: string[];
  } & FilterOptions = {},
): Promise<FileCollectionItem[]> {
  let { gzipExtensions = ['gz'] } = options;
  gzipExtensions = gzipExtensions.map((extension) => extension.toLowerCase());
  fileCollectionItems = fileCollectionItems.slice(0);
  for (let i = 0; i < fileCollectionItems.length; i++) {
    const file = fileCollectionItems[i];
    const extension = file.name.replace(/^.*\./, '').toLowerCase();
    if (!gzipExtensions.includes(extension)) {
      continue;
    }

    if (!(await isGzip(file))) {
      continue;
    }

    fileCollectionItems.push({
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
      //@ts-expect-error todo should be fixed
      stream: () => {
        return ungzipStream(file);
      },
    });

    fileCollectionItems.splice(i, 1);
    i--;
  }

  return maybeFilter(
    fileCollectionItems.sort((a, b) =>
      a.relativePath < b.relativePath ? -1 : 1,
    ),
    options,
  );
}

async function isGzip(file: FileCollectionItem) {
  const buffer = await file.arrayBuffer();
  if (buffer.byteLength < 2) return false;
  const bytes = new Uint8Array(buffer);

  return bytes[0] === 0x1f && bytes[1] === 0x8b;
}

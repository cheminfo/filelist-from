import { ungzip } from 'pako';

import { FileCollectionItem } from '../../FileCollectionItem';
import { Options } from '../../Options';
import { ungzipStream } from '../../ungzipStream';

/**
 * Some files in the fileCollectionItems may actually be gzip. This method will ungzip those files.
 * The method will actually not really ungzip the files but decompress them if you need.
 * During this process the extension .gz will be removed
 * @param fileCollectionItems
 * @param options
 * @returns
 */

export async function fileCollectionItemUngzip(
  fileCollectionItem: FileCollectionItem,
  options: Options = {},
): Promise<FileCollectionItem> {
  const { ungzip: ungzipOptions = {}, logger } = options;
  let { gzipExtensions = ['gz'] } = ungzipOptions;
  gzipExtensions = gzipExtensions.map((extension) => extension.toLowerCase());

  const extension = fileCollectionItem.name.replace(/^.*\./, '').toLowerCase();
  if (!gzipExtensions.includes(extension)) {
    return fileCollectionItem;
  }

  if (!(await isGzip(fileCollectionItem))) {
    if (logger) {
      logger.info(
        `Could not ungzip the following file: ${fileCollectionItem.relativePath}`,
      );
    }
    return fileCollectionItem;
  }

  return {
    name: fileCollectionItem.name.replace(/\.[^.]+$/, ''),
    size: fileCollectionItem.size,
    relativePath: fileCollectionItem.relativePath,
    lastModified: fileCollectionItem.lastModified,
    text: (): Promise<string> => {
      return fileCollectionItem.arrayBuffer().then((arrayBuffer) => {
        const decoder = new TextDecoder('utf8');
        return decoder.decode(ungzip(new Uint8Array(arrayBuffer)));
      });
    },
    arrayBuffer: (): Promise<ArrayBuffer> => {
      return fileCollectionItem
        .arrayBuffer()
        .then((arrayBuffer) => ungzip(new Uint8Array(arrayBuffer)));
    },
    // @ts-expect-error feature is too new
    stream: () => {
      return ungzipStream(fileCollectionItem);
    },
  };
}

async function isGzip(file: FileCollectionItem) {
  const buffer = await file.arrayBuffer();
  if (buffer.byteLength < 2) return false;
  const bytes = new Uint8Array(buffer);

  return bytes[0] === 0x1f && bytes[1] === 0x8b;
}

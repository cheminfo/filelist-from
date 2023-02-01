import JSZip from 'jszip';

import { FileCollectionItem } from './FileCollectionItem';

export type FileCollectionItemsZipOptions = {
  /**
   * Relative path of the zipped file
   * @default 'file.zip'
   */
  relativePath?: string;
};

export async function fileCollectionItemsZip(
  fileCollectionItems: FileCollectionItem[],
  options: FileCollectionItemsZipOptions = {},
): Promise<FileCollectionItem> {
  const zip = new JSZip();
  const { relativePath = 'file.zip' } = options;
  for (const file of fileCollectionItems) {
    zip.file(file.relativePath, await file.arrayBuffer());
  }

  return {
    lastModified: Date.now(),
    name: relativePath.replace(/^.*\//, ''),
    relativePath,
    size: -1, // no idea about the size, we didn't compress it yet ...
    arrayBuffer: () => zip.generateAsync({ type: 'arraybuffer' }),
    stream: () => {
      throw new Error('stream on zip is not implemented');
    },
    text: () => {
      throw new Error('text on zip is not implemented');
    },
  };
}

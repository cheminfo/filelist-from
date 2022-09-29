import JSZip from 'jszip';

import { FileCollection } from './FileCollection';
import { FileCollectionItem } from './FileCollectionItem';

export type ZipFileContent = Parameters<typeof JSZip.loadAsync>[0];

/**
 * Create a FileCollection from a zip
 * @param zipContent
 * @returns
 */
export async function fileCollectionFromZip(
  zipContent: ZipFileContent,
): Promise<FileCollection> {
  const jsZip = new JSZip();

  const zip = await jsZip.loadAsync(zipContent);
  const fileCollectionItems: FileCollectionItem[] = [];
  for (let key in zip.files) {
    const entry = zip.files[key];
    if (entry.dir) continue;
    fileCollectionItems.push({
      name: entry.name.replace(/^.*\//, ''),
      relativePath: entry.name,
      lastModified: entry.date.getTime(),
      // @ts-expect-error _data is not exposed because missing for folder   but it is really there
      size: entry._data.uncompressedSize,
      text: () => {
        return entry.async('text');
      },
      arrayBuffer: () => {
        return entry.async('arraybuffer');
      },
      stream: () => {
        return new ReadableStream({
          start(controller) {
            void entry.async('arraybuffer').then((arrayBuffer) => {
              controller.enqueue(arrayBuffer);
              controller.close();
            });
          },
        });
      },
    });
  }
  return new FileCollection(fileCollectionItems);
}

import JSZip from 'jszip';

import { FileCollection } from './FileCollection';
import { FileCollectionItem } from './FileCollectionItem';
import { Options } from './Options';
import { shouldAddItem } from './utilities/shouldAddItem';

export type ZipFileContent = Parameters<typeof JSZip.loadAsync>[0];

/**
 * Create a FileCollection from a zip
 * @param zipContent
 * @returns
 */
export async function fileCollectionFromZip(
  zipContent: ZipFileContent,
  options: Options = {},
): Promise<FileCollection> {
  const fileCollectionItems = await fileCollectionItemsFromZip(
    zipContent,
    options,
  );
  return new FileCollection(fileCollectionItems);
}

export async function fileCollectionItemsFromZip(
  zipContent: ZipFileContent,
  options: Options = {},
) {
  const jsZip = new JSZip();
  const zip = await jsZip.loadAsync(zipContent);
  const fileCollectionItems: FileCollectionItem[] = [];
  for (const key in zip.files) {
    const entry = zip.files[key];
    if (entry.dir) continue;
    if (!shouldAddItem(entry.name, options.filter)) continue;
    const item = {
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
    };
    fileCollectionItems.push(item);
  }
  return fileCollectionItems;
}

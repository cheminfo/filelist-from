import JSZip from 'jszip';

import { FileCollection } from './FileCollection';
import { FileCollectionItem } from './FileCollectionItem';
import { FilterOptions, maybeFilter } from './utilities/maybeFilter';

export type ZipFileContent = Parameters<typeof JSZip.loadAsync>[0];

/**
 * Create a FileCollection from a zip
 * @param zipContent
 * @returns
 */
export async function fileCollectionFromZip(
  zipContent: ZipFileContent,
  options: FilterOptions = {},
): Promise<FileCollection> {
  let fileCollectionItems = await fileCollectionItemsFromZip(zipContent);
  fileCollectionItems = await maybeFilter(fileCollectionItems, options);
  return new FileCollection(fileCollectionItems);
}

export async function fileCollectionItemsFromZip(zipContent: ZipFileContent) {
  const jsZip = new JSZip();
  const zip = await jsZip.loadAsync(zipContent);
  let fileCollectionItems: FileCollectionItem[] = [];
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
              //todo the test are currently passing I don't know how to solve this
              //@ts-expect-error to fix
              controller.enqueue(arrayBuffer);
              controller.close();
            });
          },
        });
      },
    });
  }
  return fileCollectionItems;
}

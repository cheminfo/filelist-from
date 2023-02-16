import fetch from 'cross-fetch';

import { ExpandOptions } from './ExpandOptions';
import { FileCollection } from './FileCollection';
import { FileCollectionItem } from './FileCollectionItem';
import { Source } from './SourceFile';
import { maybeExpand } from './utilities/maybeExpand';
import { FilterOptions, maybeFilter } from './utilities/maybeFilter';
import { sortCollectionItems } from './utilities/sortCollectionItems';

/**
 * Creates a FileCollection from a webservice. This webservice should return an array of objects containing the properties:
 * - relativePath
 * - name
 * - lastModified
 * - size
 * By default this method will expand all zip and gzip files
 * @param url
 * @param options
 * @returns
 */
export async function fileCollectionFromSource(
  source: Source,
  options: { baseURL?: string | URL } & ExpandOptions & FilterOptions = {},
): Promise<FileCollection> {
  const { baseURL } = options;
  let fileCollectionItems: FileCollectionItem[] = [];
  /*
 Answer should contain:
 - relativePath
 - name
 - lastModified
 - size
 And we need to add those async functions:
 - stream
 - text
 - arrayBuffer
*/
  for (const entry of source.entries) {
    const { lastModified = 0, size = -1 } = entry;
    const url = source.baseURL || baseURL || entry.baseURL;
    if (!url) {
      throw new Error(`We could not find a baseURL for ${entry.relativePath}`);
    }
    const fileURL = new URL(entry.relativePath, url);
    fileCollectionItems.push({
      name: entry.name,
      size,
      relativePath: entry.relativePath,
      lastModified,
      text: async (): Promise<string> => {
        const response = await fetch(fileURL);
        return response.text();
      },
      arrayBuffer: async (): Promise<ArrayBuffer> => {
        const response = await fetch(fileURL);
        return response.arrayBuffer();
      },
      stream: (): ReadableStream => {
        throw new Error('stream not yet implemented');
      },
    });
  }
  fileCollectionItems = await maybeExpand(fileCollectionItems, options);
  fileCollectionItems = await maybeFilter(fileCollectionItems, options);
  sortCollectionItems(fileCollectionItems);
  return new FileCollection(fileCollectionItems);
}

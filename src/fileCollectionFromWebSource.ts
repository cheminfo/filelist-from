import {
  CacheOptions,
  CachedFileCollectionItem,
} from './CachedFileCollectionItem';
import { FileCollection } from './FileCollection';
import { FileCollectionItem } from './FileCollectionItem';
import { Options } from './Options';
import { WebSource } from './WebSourceFile';
import { expandAndFilter } from './utilities/expand/expandAndFilter';
import { sortCollectionItems } from './utilities/sortCollectionItems';

/**
 * Creates a FileCollection from a webSource.
 * - relativePath
 * - lastModified
 * - size
 * By default this method will expand all zip and gzip files
 * @param url
 * @param options
 * @returns
 */
export async function fileCollectionFromWebSource(
  source: WebSource,
  options: { baseURL?: string | URL } & CacheOptions & Options = {},
): Promise<FileCollection> {
  const { baseURL, cache = false } = options;

  const fileCollectionItems: FileCollectionItem[] = [];

  const existing: Record<string, boolean> = {};

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

    if (existing[entry.relativePath]) {
      throw new Error(`Duplicate relativePath: ${entry.relativePath}`);
    } else {
      existing[entry.relativePath] = true;
    }

    const realBaseURL =
      entry.baseURL ||
      source.baseURL ||
      baseURL ||
      (typeof location !== 'undefined' && location.href);
    if (!realBaseURL) {
      throw new Error(`We could not find a baseURL for ${entry.relativePath}`);
    }
    const fileURL = new URL(entry.relativePath, realBaseURL);
    const item = {
      name: entry.relativePath.split('/').pop() || '',
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
    };
    const expanded = await expandAndFilter(item, {
      ...options,
      ...entry.options,
    });
    // we should be aware that we don't cache the zip file itself
    for (const item of expanded) {
      fileCollectionItems.push(
        cache ? new CachedFileCollectionItem(item) : item,
      );
    }
  }
  sortCollectionItems(fileCollectionItems);
  return new FileCollection(fileCollectionItems);
}

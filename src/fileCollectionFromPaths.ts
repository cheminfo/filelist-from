import { createReadStream } from 'node:fs';
import { readdir, stat, readFile } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';
import { Readable } from 'node:stream';

import { FileCollection } from './FileCollection';
import { FileCollectionItem } from './FileCollectionItem';
import { Options } from './Options';
import { expandAndFilter } from './utilities/expand/expandAndFilter';
import { sortCollectionItems } from './utilities/sortCollectionItems';

/**
 * Generate a FileCollection from a directory path
 * By default this method will expand all zip and gzip files
 * @param path
 * @returns
 */
export async function fileCollectionFromPaths(
  paths: string[],
  options: Options = {},
): Promise<FileCollection> {
  let fileCollectionItems: FileCollectionItem[] = [];
  for (let path of paths) {
    path = resolve(path);
    const base = basename(path);
    await appendFiles(fileCollectionItems, path, base, options);
  }
  sortCollectionItems(fileCollectionItems);
  return new FileCollection(fileCollectionItems);
}

async function appendFiles(
  fileCollection: FileCollectionItem[],
  currentDir: string,
  base: string,
  options: Options = {},
) {
  const entries = await readdir(currentDir);
  for (let entry of entries) {
    const current = join(currentDir, entry);
    const info = await stat(current);

    if (info.isDirectory()) {
      await appendFiles(fileCollection, current, `${base}/${entry}`, options);
    } else {
      const relativePath = `${base}/${entry}`;
      const item = {
        name: entry,
        size: info.size,
        relativePath,
        lastModified: Math.round(info.mtimeMs),
        text: (): Promise<string> => {
          return readFile(current, {
            encoding: 'utf8',
          });
        },
        arrayBuffer: (): Promise<ArrayBuffer> => {
          return readFile(current);
        },
        stream: (): ReadableStream => {
          if (Readable.toWeb) {
            //@ts-expect-error todo should be fixed
            return Readable.toWeb(createReadStream(current));
          }
          throw new Error(
            'The stream() method is only supported in Node.js >= 18.0.0',
          );
        },
      };
      fileCollection.push(...(await expandAndFilter(item, options)));
    }
  }
}

import { createReadStream } from 'node:fs';
import { readdir, stat, readFile } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';
import { Readable } from 'node:stream';

import { ExpandOptions } from './ExpandOptions';
import { FileCollection } from './FileCollection';
import { maybeExpand } from './utilities/maybeExpand';

/**
 * Generate a FileCollection from a directory path
 * By default this method will expand all zip and gzip files
 * @param path
 * @returns
 */
export async function fileCollectionFromPath(
  path: string,
  options: ExpandOptions = {},
): Promise<FileCollection> {
  path = resolve(path);
  const base = basename(path);
  let fileCollection: FileCollection = [];
  await appendFiles(fileCollection, path, base);
  return maybeExpand(fileCollection, options);
}

async function appendFiles(
  fileCollection: FileCollection,
  currentDir: string,
  base: string,
) {
  const entries = await readdir(currentDir);
  for (let entry of entries) {
    const current = join(currentDir, entry);
    const info = await stat(current);

    if (info.isDirectory()) {
      await appendFiles(fileCollection, current, `${base}/${entry}`);
    } else {
      fileCollection.push({
        name: entry,
        size: info.size,
        relativePath: `${base}/${entry}`,
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
            return Readable.toWeb(createReadStream(current));
          } else {
            throw new Error(
              'The stream() method is only supported in Node.js >= 18.0.0',
            );
          }
        },
      });
    }
  }
}

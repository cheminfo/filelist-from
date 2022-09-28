import { createReadStream } from 'node:fs';
import { readdir, stat, readFile } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';
import { Readable } from 'node:stream';

import { FileCollection } from './FileCollection';
import { fileCollectionUngzip } from './fileCollectionUngzip';
import { fileCollectionUnzip } from './fileCollectionUnzip';
/**
 * Generate a FileCollection from a directory path
 * By default this method will expand all zip and gzip files
 * @param path
 * @returns
 */
export async function fileCollectionFromPath(
  path: string,
  options: {
    /**
     * Expand all zip files
     * Set this value to undefined to prevent unzip
     * @default ()
     */
    unzip?: {
      zipExtensions?: string[];
    };
    /**
     * Expand all gzip files
     * Set this value to undefined to prevent ungzip
     * @default ()
     */
    ungzip?: {
      gzipExtensions?: string[];
    };
  } = {},
): Promise<FileCollection> {
  const { unzip = {}, ungzip = {} } = options;
  path = resolve(path);
  const base = basename(path);
  let fileCollection: FileCollection = [];
  await appendFiles(fileCollection, path, base);
  fileCollection = await fileCollectionUnzip(fileCollection, unzip);
  fileCollection = await fileCollectionUngzip(fileCollection, ungzip);
  return fileCollection;
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

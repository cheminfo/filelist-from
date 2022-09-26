import { createReadStream } from 'fs';
import { readdir, stat, readFile } from 'fs/promises';
import { ReadableStream } from 'node:stream/web';
import { join } from 'path';

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
     * base directory
     * @default ''
     */
    baseDir?: string;
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
  const { unzip = {}, ungzip = {}, baseDir = '' } = options;
  let fileCollection: FileCollection = [];
  await appendFiles(fileCollection, path);
  fileCollection = await fileCollectionUnzip(fileCollection, unzip);
  fileCollection = await fileCollectionUngzip(fileCollection, ungzip);
  if (baseDir) {
    fileCollection.forEach(
      (file) => (file.relativePath = file.relativePath.replace(baseDir, '')),
    );
  }
  return fileCollection;
}

async function appendFiles(fileCollection: FileCollection, currentDir: string) {
  const entries = await readdir(currentDir);
  for (let entry of entries) {
    const current = join(currentDir, entry);
    const info = await stat(current);

    if (info.isDirectory()) {
      await appendFiles(fileCollection, current);
    } else {
      fileCollection.push({
        name: entry,
        size: info.size,
        relativePath: join(currentDir, entry).replace(/\\/g, '/'),
        lastModified: Math.round(info.mtimeMs),
        text: (): Promise<string> => {
          return readFile(join(currentDir, entry), {
            encoding: 'utf8',
          });
        },
        arrayBuffer: (): Promise<ArrayBuffer> => {
          return readFile(join(currentDir, entry));
        },
        stream: (): ReadableStream => {
          //@ts-expect-error typescript definition not correct
          return createReadStream(join(currentDir, entry));
        },
      });
    }
  }
}

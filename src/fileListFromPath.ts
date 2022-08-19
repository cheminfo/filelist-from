import { readdirSync, statSync, createReadStream } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';

import { PartialFileList } from './PartialFile';
import { fileListUngzip } from './fileListUngzip';
import { fileListUnzip } from './fileListUnzip';

/**
 * Generate a FileList from a directory path
 * By default this method will expand all zip and gzip files
 * @param path
 * @returns
 */
export async function fileListFromPath(
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
) {
  const { unzip = {}, ungzip = {} } = options;
  let fileList: PartialFileList = [];
  appendFiles(fileList, path);
  fileList = await fileListUnzip(fileList, unzip);
  fileList = await fileListUngzip(fileList, ungzip);

  return fileList;
}

function appendFiles(fileList: PartialFileList, currentDir: string) {
  const entries = readdirSync(currentDir);
  for (let entry of entries) {
    const current = join(currentDir, entry);
    const stat = statSync(current);

    if (stat.isDirectory()) {
      appendFiles(fileList, current);
    } else {
      fileList.push({
        name: entry,
        size: stat.size,
        webkitRelativePath: join(currentDir, entry).replace(/\\/g, '/'),
        lastModified: Math.round(stat.mtimeMs),
        text: (): Promise<string> => {
          return readFile(join(currentDir, entry), {
            encoding: 'utf8',
          });
        },
        arrayBuffer: (): Promise<ArrayBuffer> => {
          return readFile(join(currentDir, entry));
        },
        //@ts-expect-error wrong type script definition ?
        stream: (): ReadableStream => {
          //@ts-expect-error typescript definition not correct
          return createReadStream(join(currentDir, entry));
        },
      });
    }
  }
}

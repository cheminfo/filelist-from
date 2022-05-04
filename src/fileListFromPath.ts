import { readdirSync, statSync, createReadStream } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { Readable } from 'stream';
import { ReadableStream } from 'stream/web';

import { PartialFileList } from './PartialFile';

/**
 * Generate a FileList from a directory path
 * @param path
 * @returns
 */
export function fileListFromPath(path: string) {
  const fileList: PartialFileList = [];
  appendFiles(fileList, path);
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
          return Readable.toWeb(createReadStream(join(currentDir, entry)));
        },
      });
    }
  }
}

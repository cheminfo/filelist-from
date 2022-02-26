import { readdirSync, statSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';

import { File } from './fileListFromZip';
/**
 * Generate a FileList from a directory path
 * @param path
 * @returns FileList
 */
export function fileListFromPath(path: string): File[] {
  const fileList: File[] = [];
  appendFiles(fileList, path);
  return fileList;
}

function appendFiles(fileList: File[], currentDir: string) {
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
        webkitRelativePath: currentDir,
        lastModified: Math.round(stat.mtimeMs),
        text: (): Promise<string> => {
          return readFile(join(currentDir, entry), {
            encoding: 'utf8',
          });
        },
        arrayBuffer: (): Promise<ArrayBuffer> => {
          return readFile(join(currentDir, entry));
        },
      });
    }
  }
}

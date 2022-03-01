import { readdirSync, statSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';

/** subset for File */
export type PartialFileList = Omit<File, 'stream' | 'slice' | 'type'>[];

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

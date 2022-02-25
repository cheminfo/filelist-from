import { readdirSync, statSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';

export function fileListFromPath(currentDir: string) {
  const fileList: File[] = [];
  appendFiles(fileList, currentDir);
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
      // @ts-expect-error We didn't implement all the requires properties
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

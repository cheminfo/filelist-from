import { ungzip } from 'pako';

import { PartialFileList, PartialFile } from './PartialFile';
/**
 * Some files in the fileList may actually be gzip. This method will ungzip those files.
 * The method will actually not really ungzip the files but decompress them if you need.
 * During this process the extension .gz will be removed
 * @param fileList
 * @param options
 * @returns
 */

export async function fileListUngzip(
  fileList: PartialFileList,
  options: {
    /**
  Case insensitive list of extensions that are zip files
  We will check anyway if the first 4 bytes
  @default ['gz']
  */
    gzipExtensions?: string[];
  } = {},
): Promise<PartialFileList> {
  let { gzipExtensions = ['gz'] } = options;
  gzipExtensions = gzipExtensions.map((extension) => extension.toLowerCase());
  fileList = fileList.slice(0);
  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i];
    const extension = file.name.replace(/^.*\./, '').toLowerCase();
    if (!gzipExtensions.includes(extension)) {
      continue;
    }

    if (!(await isGzip(file))) {
      continue;
    }

    fileList.push({
      name: file.name.replace(/\.[^.]+$/, ''),
      size: file.size,
      webkitRelativePath: file.webkitRelativePath.replace(/\.[^.]+$/, ''),
      lastModified: file.lastModified,
      text: (): Promise<string> => {
        return file.arrayBuffer().then((arrayBuffer) => {
          const decoder = new TextDecoder('utf8');
          return decoder.decode(ungzip(new Uint8Array(arrayBuffer)));
        });
      },
      arrayBuffer: (): Promise<ArrayBuffer> => {
        return file
          .arrayBuffer()
          .then((arrayBuffer) => ungzip(new Uint8Array(arrayBuffer)));
      },
    });

    fileList.splice(i, 1);
    i--;
  }

  return fileList.sort((a, b) =>
    a.webkitRelativePath < b.webkitRelativePath ? -1 : 1,
  );
}

async function isGzip(file: PartialFile) {
  const buffer = await file.arrayBuffer();
  if (buffer.byteLength < 2) return false;
  const bytes = new Uint8Array(buffer);

  return bytes[0] === 0x1f && bytes[1] === 0x8b;
}

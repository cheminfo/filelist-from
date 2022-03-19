import { fileListFromZip } from './fileListFromZip';

import { PartialFileList, PartialFile } from './index';

export async function fileListUnzip(
  fileList: PartialFileList,
  options: {
    /**
  Case insensitive list of extensions that are zip files
  We will check anyway if the first 4 bytes
  @default ['zip']
  */
    zipExtensions?: string[];
  } = {},
): Promise<PartialFileList> {
  let { zipExtensions = ['zip'] } = options;
  zipExtensions = zipExtensions.map((extension) => extension.toLowerCase());
  fileList = fileList.slice(0);
  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i];
    const extension = file.name.replace(/^.*\./, '').toLowerCase();
    if (!zipExtensions.includes(extension)) {
      continue;
    }

    if (!(await isZip(file))) {
      continue;
    }
    const zipFileList = await fileListFromZip(await file.arrayBuffer());
    for (let zipEntry of zipFileList) {
      zipEntry.webkitRelativePath = `${file.webkitRelativePath}/${zipEntry.webkitRelativePath}`;
      fileList.push(zipEntry);
    }
    fileList.splice(i, 1);
    i--;
  }

  return fileList.sort((a, b) =>
    a.webkitRelativePath < b.webkitRelativePath ? -1 : 1,
  );
}

async function isZip(file: PartialFile) {
  const buffer = await file.arrayBuffer();
  if (buffer.byteLength < 4) return false;
  const bytes = new Uint8Array(buffer);

  return (
    bytes[0] === 0x50 &&
    bytes[1] === 0x4b &&
    (bytes[2] === 0x03 || bytes[2] === 0x05 || bytes[2] === 0x07) &&
    (bytes[3] === 0x04 || bytes[3] === 0x06 || bytes[3] === 0x08)
  );
}

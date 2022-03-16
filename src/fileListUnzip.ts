import { fileListFromZip } from './fileListFromZip';

interface FileList {
  name: string;
  webkitRelativePath: string;
  lastModified: number;
  size: any;
  text: () => Promise<string>;
  arrayBuffer: () => Promise<ArrayBuffer>;
}

interface ZipFiles {
  match: RegExp;
  checkZip: boolean;
}
interface FileListUnzipOptions {
  zipFiles?: ZipFiles[];
}

const FILES_SIGNATURES = {
  ZIP: '504b0304',
};
export async function fileListUnzip(
  fileList: FileList[],
  options: FileListUnzipOptions = {},
) {
  const { zipFiles } = options;
  for (let i = 0; i < fileList.length; i++) {
    let { isZipped, buffer } = await checkIfZip(fileList[i], zipFiles);
    if (!isZipped) continue;
    const zipBuffer = !buffer ? await fileList[i].arrayBuffer() : buffer;
    const currentFileList = await fileListFromZip(zipBuffer);
    for (let subFile of currentFileList) {
      subFile.webkitRelativePath = `${fileList[i].webkitRelativePath}/${subFile.webkitRelativePath}`;
      fileList.push(subFile);
    }
    fileList.splice(i, 1);
  }

  return fileList;
}

async function checkIfZip(file: FileList, zipFiles: ZipFiles[] = []) {
  for (let current of zipFiles) {
    const { match, checkZip } = current;
    if (match.exec(file.name)) {
      if (checkZip) {
        const buffer = await file.arrayBuffer();
        const signature = getFileSignature(buffer);
        return { isZipped: signature === FILES_SIGNATURES.ZIP, buffer };
      }
      return { isZipped: true };
    }
  }

  return { isZipped: /\.zip$/.exec(file.name) };
}

function getFileSignature(fileArrayBuffer: ArrayBuffer) {
  return new Uint8Array(fileArrayBuffer)
    .slice(0, 4)
    .reduce((acc, byte) => (acc += byte.toString(16).padStart(2, '0')), '');
}

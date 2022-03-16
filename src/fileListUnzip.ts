import { fileListFromZip } from './fileListFromZip';

interface FileList {
  name: string;
  webkitRelativePath: string;
  lastModified: number;
  size: any;
  text: () => Promise<string>;
  arrayBuffer: () => Promise<ArrayBuffer>;
}

const FILES_SIGNATURES = {
  ZIP: '504b0304',
};
export async function fileListUnzip(
  fileList: FileList[],
  options: { checkZip?: boolean } = {},
) {
  const { checkZip = false } = options;
  for (let i = 0; i < fileList.length; i++) {
    let { isZipped, buffer } = await checkIfZip(fileList[i], checkZip);
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

async function checkIfZip(file: FileList, checkZip: boolean) {
  if (checkZip) {
    const buffer = await file.arrayBuffer();
    const signature = getFileSignature(buffer);
    return { isZipped: signature === FILES_SIGNATURES.ZIP, buffer };
  }
  return { isZipped: /\.zip$/.exec(file.name) };
}

function getFileSignature(fileArrayBuffer: ArrayBuffer) {
  return new Uint8Array(fileArrayBuffer)
    .slice(0, 4)
    .reduce((acc, byte) => (acc += byte.toString(16).padStart(2, '0')), '');
}

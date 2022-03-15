import { fileListFromZip } from './fileListFromZip';

interface FileList {
  name: string;
  webkitRelativePath: string;
  lastModified: number;
  size: any;
  text: () => Promise<string>;
  arrayBuffer: () => Promise<ArrayBuffer>;
}
export async function fileListUnzip(fileList: FileList[]) {
  for (let i = 0; i < fileList.length; i++) {
    if (!/\.zip$/.exec(fileList[i].name)) continue;
    const zipBuffer = await fileList[i].arrayBuffer();
    const currentFileList = await fileListFromZip(zipBuffer);
    for (let subFile of currentFileList) {
      subFile.webkitRelativePath = `${fileList[i].webkitRelativePath}/${subFile.webkitRelativePath}`;
      fileList.push(subFile);
    }
    fileList.splice(i, 1);
  }

  return fileList;
}

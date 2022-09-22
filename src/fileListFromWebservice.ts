import fetch from 'cross-fetch';

import { PartialFileList } from './PartialFile';

export async function fileListFromWebservice(url: string | URL) {
  const response = await fetch(url);
  const baseURL = url;
  const entries = await response.json();
  const fileList: PartialFileList = [];
  /*
 Answer should contain:
 - webkitRelativePath
 - name
 - lastModified
 - size
 And we need to add those async functions:
 - stream
 - text
 - arrayBuffer
*/
  for (const entry of entries) {
    fileList.push({
      name: entry.name,
      size: entry.size,
      webkitRelativePath: entry.webkitRelativePath,
      lastModified: entry.lastModified,
      text: async (): Promise<string> => {
        const fileURL = new URL(entry.webkitRelativePath, baseURL).href;
        const response = await fetch(fileURL);
        return response.text();
      },
      arrayBuffer: async (): Promise<ArrayBuffer> => {
        const fileURL = new URL(entry.webkitRelativePath, baseURL).href;
        const response = await fetch(fileURL);
        return response.arrayBuffer();
      },
      //@ts-expect-error should be once implemented
      stream: (): ReadableStream => {
        throw new Error('stream not yet implemented');
      },
    });
  }
  return fileList;
}

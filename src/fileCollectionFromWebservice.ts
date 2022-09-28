import fetch from 'cross-fetch';

import { FileCollection } from './FileCollection';

export async function fileCollectionFromWebservice(url: string | URL) {
  const response = await fetch(url.toString());
  const baseURL = url;
  const entries = await response.json();
  const fileCollection: FileCollection = [];
  /*
 Answer should contain:
 - relativePath
 - name
 - lastModified
 - size
 And we need to add those async functions:
 - stream
 - text
 - arrayBuffer
*/
  for (const entry of entries) {
    fileCollection.push({
      name: entry.name,
      size: entry.size,
      relativePath: entry.relativePath,
      lastModified: entry.lastModified,
      text: async (): Promise<string> => {
        const fileURL = new URL(entry.relativePath, baseURL).href;
        const response = await fetch(fileURL);
        return response.text();
      },
      arrayBuffer: async (): Promise<ArrayBuffer> => {
        const fileURL = new URL(entry.relativePath, baseURL).href;
        const response = await fetch(fileURL);
        return response.arrayBuffer();
      },
      stream: (): ReadableStream => {
        throw new Error('stream not yet implemented');
      },
    });
  }
  return fileCollection;
}

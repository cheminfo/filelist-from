import fetch from 'cross-fetch';

import { ExpandOptions } from './ExpandOptions';
import { FileCollection } from './FileCollection';
import { maybeExpand } from './utilities/maybeExpand';

/**
 * Creates a FileCollection from a webservice. This webservice should return an array of objects containing the properties:
 * - relativePath
 * - name
 * - lastModified
 * - size
 * By default this method will expand all zip and gzip files
 * @param url
 * @param options
 * @returns
 */
export async function fileCollectionFromWebservice(
  url: string | URL,
  options: ExpandOptions = {},
) {
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
  return maybeExpand(fileCollection, options);
}

import JSZip from 'jszip';

import { FileCollection } from './FileCollection';

/**
 * This method will zip a file collection and return the zip as an ArrayBuffer
 * @param fileCollecrtion
 * @returns
 */
export async function fileCollectionToZip(
  fileCollection: FileCollection,
): Promise<ArrayBuffer> {
  const jsZip = new JSZip();

  for (const file of fileCollection) {
    jsZip.file(file.relativePath, await file.arrayBuffer());
  }

  return jsZip.generateAsync({ type: 'arraybuffer' });
}

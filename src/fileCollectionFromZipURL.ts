import fetch from 'cross-fetch';

import { FileCollection } from './FileCollection';
import { fileCollectionFromZip } from './fileCollectionFromZip';

/**
 * Create a FileCollection from a zip
 * @param zipContent
 * @returns
 */
export async function fileCollectionFromZipURL(
  url: string | URL,
): Promise<FileCollection> {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();

  return fileCollectionFromZip(arrayBuffer);
}

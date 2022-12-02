import fetch from 'cross-fetch';

import { ExpandOptions } from './ExpandOptions';
import { FileCollection } from './FileCollection';
import { fileCollectionFromFileArray } from './fileCollectionFromFileArray';
import { FilterOptions } from './utilities/maybeFilter';

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
  options: ExpandOptions & FilterOptions = {},
): Promise<FileCollection> {
  const response = await fetch(url.toString());
  const entries = await response.json();
  const baseURL = url;

  return fileCollectionFromFileArray(entries, baseURL, options);
}

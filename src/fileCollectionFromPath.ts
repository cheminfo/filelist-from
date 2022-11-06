import { ExpandOptions } from './ExpandOptions';
import { FileCollection } from './FileCollection';
import { fileCollectionFromPaths } from './fileCollectionFromPaths.browser';
import { FilterOptions } from './utilities/maybeFilter';

/**
 * Generate a FileCollection from a directory path
 * By default this method will expand all zip and gzip files
 * @param path
 * @returns
 */
export async function fileCollectionFromPath(
  path: string,
  options: ExpandOptions & FilterOptions = {},
): Promise<FileCollection> {
  return fileCollectionFromPaths([path], options);
}

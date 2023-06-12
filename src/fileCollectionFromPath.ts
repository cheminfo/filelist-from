import { FileCollection } from './FileCollection';
import { Options } from './Options';
import { fileCollectionFromPaths } from './fileCollectionFromPaths';

/**
 * Generate a FileCollection from a directory path
 * By default this method will expand all zip and gzip files
 * @param path
 * @returns
 */
export async function fileCollectionFromPath(
  path: string,
  options: Options = {},
): Promise<FileCollection> {
  return fileCollectionFromPaths([path], options);
}

import { FileCollection } from './FileCollection';
import { FileCollectionItem } from './FileCollectionItem';

export type StringObject = Record<string, string>;

type GroupByOption =
  | 'baseDir'
  | 'extension'
  | 'filename'
  | ((file?: FileCollectionItem, fileInfo?: StringObject) => string);

interface GroupOfFiles {
  meta: StringObject;
  key: string;
  fileCollection: FileCollection;
}

export interface GroupFilesOptions {
  /**
   * Regular expression containing capture groups that will become meta information
   */
  meta?: RegExp;
  /**
   * How to group the files, the default is to group by folder
   * @default ['baseDir']
   */
  groupBy?: GroupByOption;
}

export function groupFiles(
  fileCollection: FileCollection,
  options: GroupFilesOptions = {},
) {
  const { groupBy = 'baseDir', meta } = options;

  let results: Record<string, GroupOfFiles> = {};

  for (const file of fileCollection) {
    const key = getKey(file, groupBy);
    if (!results[key]) {
      results[key] = {
        meta: getMeta(key, meta),
        key,
        fileCollection: [],
      };
    }
    results[key].fileCollection.push(file);
  }

  return Object.keys(results).map((key) => results[key]);
}

function getMeta(key: string, meta?: RegExp) {
  if (!meta) return {};
  const matcher = key.match(meta);
  if (!matcher) return {};
  return matcher.groups || {};
}

function getKey(file: FileCollectionItem, groupBy: GroupByOption) {
  if (typeof groupBy === 'string') {
    const fileInfo = getFileInfo(file);
    switch (groupBy) {
      case 'baseDir':
        return fileInfo.baseDir;
      case 'extension':
        return fileInfo.extension;
      case 'filename':
        return fileInfo.filename;
      default:
        throw new Error(`Unknown groupBy strategy: ${String(groupBy)}`);
    }
  } else {
    return groupBy(file, getFileInfo(file));
  }
}

function getFileInfo(file: FileCollectionItem) {
  return {
    baseDir: file.relativePath.replace(/\/[^/]*$/, ''),
    extension: file.relativePath.replace(/^.*\./, ''),
    filename: file.relativePath.replace(/^.*\//, '').replace(/.[^.]*$/, ''),
  };
}

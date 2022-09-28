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
  fileCollectionItems: FileCollectionItem[];
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
) : {meta, key:string, fileColeFileCollection>{
  const { groupBy = 'baseDir', meta } = options;

  const fileCollectionItems: FileCollectionItem[] = fileCollection.files;

  let results: Record<string, GroupOfFiles> = {};

  for (const file of fileCollectionItems) {
    const key = getKey(file, groupBy);
    if (!results[key]) {
      results[key] = {
        meta: getMeta(key, meta),
        key,
        fileCollectionItems:  [],
      };
    }
    results[key].fileCollectionItems.push(file);
  }


  return Object.keys(results).map((key) => ({
    meta: results[key].meta,
    key,
    fileCollection: new FileCollection(results[key].fileCollectionItems)
  }));
}

function getMeta(key: string, meta?: RegExp):Record<string,string> {
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

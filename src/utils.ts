import { PartialFileList } from './PartialFile';

export type StringObject = Record<string, string>;

/**
 * Type for [[`groupFiles`]] function
 */
export type GroupFiles = (
  flist: PartialFileList | FileList,
  options: GroupFilesOptions,
) => GroupedFiles[];
/**
 * Group files under same directory path
 * i.e `[Dir1, Dir2, Dir3...]`  where each Dir is
 * ```
 * {
 *   id,
 *   extension,
 *   name,
 *   captureGroups
 *   fileA,
 *   fileB,...
 *  }
 *  ```
 * Files must be in the same directory to be grouped.
 * @param fileList
 * @param options - how to build the out object. See `[[GroupFilesOptions]]` for all options.
 * @return - array of dirs. Some keys are File objects (`fileA`, `fileB`..).
 */

export const groupFiles: GroupFiles = (
  fileList,
  options = { idWithBasename: true, fileKey: 'extension' },
) => {
  const { idWithBasename, fileKey, applyToFileKey, captureFromPath } = options;

  type ID = string;
  let results: Record<ID, Partial<GroupedFiles>> = {};

  for (const file of fileList) {
    /* name */
    const dirPath = file.webkitRelativePath.replace(/\/[^/]+$/, '');
    const filename = applyToFileKey ? applyToFileKey(file.name) : file.name;
    const basename = filename.replace(/\.[^.]+$/, '');
    const extension = filename.replace(/.*\./, '');

    /* Group ID */
    let gid;
    if (idWithBasename) {
      gid = `${dirPath}/${basename}`;
    } else {
      //just dir path, like for WDF parser.
      gid = dirPath;
    }

    /* set the unique grouping id */
    if (!results[gid]) results[gid] = { gid };

    /* captured information from regex */
    if (captureFromPath && !results[gid].captureGroups) {
      const cGroups = dirPath.match(captureFromPath)?.groups;
      if (cGroups) results[gid].captureGroups = cGroups;
    }

    /* place file under a particular group `results[gid]` */
    switch (fileKey) {
      case 'extension':
        results[gid][extension] = file;
        break;
      case 'basename':
        results[gid][basename] = file;
        break;
      default:
        results[gid][filename] = file;
        break;
    }
  }
  return Object.keys(results).map((gid) => results[gid]) as GroupedFiles[];
};

/**
 * Interface representing Grouped files as done by [[`groupFiles`]]
 * there is some metadata and the files (see below).
 * groupFiles will return an array of these.
 */
export interface GroupedFiles {
  /** group id used to group the files under same path */
  gid: string;
  /** file name as taken from [[`File`]] or compatible class.*/
  name: string;
  /** file extension if it has an extension */
  extension?: string;
  /** Object with groups captured by RegEx. See [[`GroupFilesOptions`]]. */
  captureGroups: StringObject;
  /** there is no other way atm, this will store the files */
  // eslint-disable-next-line
  [file: string]: any;
}

type NewFilename = string;
/**
 * Options for [[`groupFiles`]]
 */
export interface GroupFilesOptions {
  /** A path like `./dir1/dir2/base.ext` will use `./dir1/dir2/base` as id.
   * Sets `extensionAsKey:true`. Can segregate files. */
  idWithBasename?: boolean;
  /**
   * Example:
   * Take the path `./dir1/dir2/base.ext`
   * * With 'basename'  File be at `base` key
   * * With 'extension' File at `ext` key.
   * * With 'filename' (default) File at `base.ext` key.
   * If the fileKey is 'extension' but the file doesn't have one
   * (pretty common in a million files) it takes the basename.
   * If you lowercase them and end up being the same, one will be overwritten
   * (we can't have 2 same-name keys in an object).
   */
  fileKey?: 'basename' | 'extension' | 'filename';
  /** For example, `(filename) => filename.toLowerCase()`
   * and the file `a.EXT` will be at key `ext` */
  applyToFileKey?: (filename: string) => NewFilename;
  /** Optional regex to name-capture groups from path.
     * Could be useful for post processing and filtering.
     * Example:
     * ```
     "./hello/world/file.txt"
      .match(/\/(?<P2>\w+)\/(?<P1>\w+)\/(?<filename>.*$)/)
      .groups
        {
          P2: 'hello',
          P1: 'world',
          filename: 'file.txt'
        }
       ```
     */
  captureFromPath?: RegExp;
}

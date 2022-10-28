import { FileCollectionItem } from './FileCollectionItem';
import {
  fileCollectionItemsZip,
  FileCollectionItemsZipOptions,
} from './fileCollectionItemsZip';

export class FileCollection {
  readonly files: FileCollectionItem[];

  constructor(files: FileCollectionItem[]) {
    this.files = files;
  }

  filter(callback: (file: FileCollectionItem) => unknown) {
    return new FileCollection(this.files.filter(callback));
  }

  /**
   * Zip the FileCollection
   * This method returns a new FileCollection that contains only one FileItem that
   * is the zipped file (called by default 'file.zip')
   */
  async zip(options: FileCollectionItemsZipOptions = {}) {
    return new FileCollection([
      await fileCollectionItemsZip(this.files, options),
    ]);
  }

  [Symbol.iterator]() {
    return this.files.values();
  }
}

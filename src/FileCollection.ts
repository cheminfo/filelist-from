import { FileCollectionItem } from './FileCollectionItem';
import { fileCollectionToZip } from './fileCollectionToZip';

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
   * Not sure this is super useful and we should probably remove it and replace it by fileCollectionToZip
   */
  async zip() {
    return fileCollectionToZip(this);
  }

  [Symbol.iterator]() {
    return this.files.values();
  }
}

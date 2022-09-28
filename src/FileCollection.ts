import { FileCollectionItem } from './FileCollectionItem';

export class FileCollection {
  readonly files: FileCollectionItem[];

  constructor(files: FileCollectionItem[]) {
    this.files = files;
  }

  [Symbol.iterator]() {
    return this.files.values();
  }
}

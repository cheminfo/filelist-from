import { FileCollectionItem } from './FileCollectionItem';

export class FileCollection {
  readonly files: FileCollectionItem[];

  constructor(files: FileCollectionItem[]) {
    this.files = files;
  }

  filter(callback: (file: FileCollectionItem) => unknown) {
    return new FileCollection(this.files.filter(callback));
  }

  [Symbol.iterator]() {
    return this.files.values();
  }
}

import { FileCollectionItem } from './FileCollectionItem';

export class FileCollection {
  readonly items: FileCollectionItem[];

  constructor(files: FileCollectionItem[]) {
    this.items = files;
  }

  [Symbol.iterator]() {
    return this.items.values();
  }
}

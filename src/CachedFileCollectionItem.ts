import { FileCollectionItem } from './FileCollectionItem';

export interface CacheOptions {
  /**
   * Should we cache the data
   * @default false
   */
  cache?: boolean;
}

export class CachedFileCollectionItem {
  readonly fileCollectionItem: FileCollectionItem;
  private textCache?: string;
  private arrayBufferCache?: ArrayBuffer;

  constructor(fileCollectionItem: FileCollectionItem) {
    this.fileCollectionItem = fileCollectionItem;
  }
  async text() {
    if (this.arrayBufferCache) {
      return new TextDecoder().decode(this.arrayBufferCache);
    }
    return (this.textCache =
      this.textCache || (await this.fileCollectionItem.text()));
  }
  async arrayBuffer() {
    return (this.arrayBufferCache =
      this.arrayBufferCache || (await this.fileCollectionItem.arrayBuffer()));
  }
  stream() {
    return this.fileCollectionItem.stream(); // no cache for stream !
  }
  get lastModified() {
    return this.fileCollectionItem.lastModified;
  }
  get name() {
    return this.fileCollectionItem.name;
  }
  get relativePath() {
    return this.fileCollectionItem.relativePath;
  }
  get size() {
    return this.fileCollectionItem.size;
  }
}

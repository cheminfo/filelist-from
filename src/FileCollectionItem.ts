export interface BaseFile {
  relativePath: string;
  name: string;
  lastModified?: number;
  size?: number;
}

export interface FileCollectionItem extends Required<BaseFile> {
  arrayBuffer(): Promise<ArrayBuffer>;
  stream(): ReadableStream<Uint8Array>;
  text(): Promise<string>;
}

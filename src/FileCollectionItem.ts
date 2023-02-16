export interface FileCollectionItem {
  relativePath: string;
  name: string;
  lastModified?: number;
  size?: number;
  arrayBuffer(): Promise<ArrayBuffer>;
  stream(): ReadableStream<Uint8Array>;
  text(): Promise<string>;
}

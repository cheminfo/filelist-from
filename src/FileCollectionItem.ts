import { ReadableStream } from 'node:stream/web';

export type FileCollectionItem = {
  lastModified: number;
  name: string;
  relativePath: string;
  size: number;
  arrayBuffer(): Promise<ArrayBuffer>;
  stream(): ReadableStream<Uint8Array>;
  text(): Promise<string>;
};

import { ReadableStream } from 'node:stream/web';

export type FileItem = {
  lastModified: number;
  name: string;
  relativePath: string;
  size: number;
  arrayBuffer(): Promise<ArrayBuffer>;
  stream(): ReadableStream<Uint8Array>;
  text(): Promise<string>;
};

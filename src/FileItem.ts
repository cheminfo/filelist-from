import { ReadableStream } from 'node:stream/web';

export type FileItem = {
  readonly lastModified: number;
  readonly name: string;
  readonly relativePath: string;
  readonly size: number;
  arrayBuffer(): Promise<ArrayBuffer>;
  stream(): ReadableStream<Uint8Array>;
  text(): Promise<string>;
};

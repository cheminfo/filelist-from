import { ReadStream } from 'fs';
import { createGunzip } from 'zlib';

import { FileCollectionItem } from './FileCollectionItem';

export function ungzipStream(file: FileCollectionItem) {
  if (ReadStream.toWeb) {
    return ReadStream.toWeb(
      //@ts-expect-error Should fix this definition
      ReadStream.fromWeb(file.stream()).pipe(createGunzip()),
    );
  }
  throw new Error('The stream() method is only supported in Node.js >= 18.0.0');
}

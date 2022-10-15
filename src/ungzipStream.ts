import { ReadStream } from 'fs';
import { createGunzip } from 'zlib';

import { FileCollectionItem } from './FileCollectionItem';

export function ungzipStream(file: FileCollectionItem) {
  //@ts-expect-error Should fix this definition
  return ReadStream.fromWeb(file.stream()).pipe(createGunzip());
}

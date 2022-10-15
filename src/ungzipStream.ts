import { ReadStream } from 'fs';
import { createGunzip } from 'zlib';

import { FileCollectionItem } from './FileCollectionItem';

export function ungzipStream(file: FileCollectionItem) {
  return ReadStream.toWeb(
    //@ts-expect-error Should fix this definition
    ReadStream.fromWeb(file.stream()).pipe(createGunzip()),
  );
}

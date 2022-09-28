import { createGunzip } from 'zlib';

import { FileCollectionItem } from './FileCollectionItem';

export function ungzipStream(file: FileCollectionItem) {
  //@ts-expect-error Should fix this definition
  return file.stream().pipe(createGunzip());
}

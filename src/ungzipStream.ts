import { createGunzip } from 'zlib';

import { FileItem } from './FileItem';

export function ungzipStream(file: FileItem) {
  //@ts-expect-error Should fix this definition
  return file.stream().pipe(createGunzip());
}

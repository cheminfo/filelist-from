import { createGunzip } from 'zlib';

import { FileItem } from './FileItem';

export function ungzipStream(file: FileItem) {
  return file.stream().pipe(createGunzip());
}

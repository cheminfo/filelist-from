import { createGunzip } from 'zlib';

import { PartialFile } from './PartialFile';

export function ungzipStream(file: PartialFile) {
  return file.stream().pipe(createGunzip());
}

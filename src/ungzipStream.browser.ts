import { ungzip } from 'pako';
import { PartialFile } from './PartialFile';

export function ungzipStream(file: PartialFile) {
  return new ReadableStream({
    start(controller) {
      void file
        .arrayBuffer()
        .then((arrayBuffer) => ungzip(new Uint8Array(arrayBuffer)))
        .then((arrayBuffer) => {
          controller.enqueue(arrayBuffer);
          controller.close();
        });
    },
  });
}

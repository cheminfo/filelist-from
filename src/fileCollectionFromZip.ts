import JSZip from 'jszip';

export type ZipFileContent = Parameters<typeof JSZip.loadAsync>[0];

/**
 * Create a FileCollection from a zip
 * @param zipContent
 * @returns
 */
export async function fileCollectionFromZip(zipContent: ZipFileContent) {
  const jsZip = new JSZip();

  const zip = await jsZip.loadAsync(zipContent);
  const fileCollection = [];
  for (let key in zip.files) {
    const entry = zip.files[key];
    if (entry.dir) continue;
    fileCollection.push({
      name: entry.name.replace(/^.*\//, ''),
      webkitRelativePath: entry.name,
      lastModified: entry.date.getTime(),
      // @ts-expect-error _data is not exposed because missing for folder but it is really there
      size: entry._data.uncompressedSize,
      text: () => {
        return entry.async('text');
      },
      arrayBuffer: () => {
        return entry.async('arraybuffer');
      },
      stream: () => {
        return new ReadableStream({
          start(controller) {
            void entry.async('arraybuffer').then((arrayBuffer) => {
              controller.enqueue(arrayBuffer);
              controller.close();
            });
          },
        });
      },
    });
  }
  return fileCollection;
}

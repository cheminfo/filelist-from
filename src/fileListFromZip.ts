import JSZip from 'jszip';

export type ZipFileContent = Parameters<typeof JSZip.loadAsync>[0];

/**
 * Create a FileList from a zip
 * @param zipContent
 * @returns
 */
export async function fileListFromZip(zipContent: ZipFileContent) {
  const jsZip = new JSZip();

  const zip = await jsZip.loadAsync(zipContent);
  const fileList = [];
  for (let key in zip.files) {
    const entry = zip.files[key];
    if (entry.dir) continue;
    fileList.push({
      name: entry.name.replace(/^.*\//, ''),
      webkitRelativePath: entry.name.replace(/\/.*?$/, ''),
      lastModified: new Date(entry.date),
      // @ts-expect-error _data is not exposed because missing for folder but it is really there
      size: entry._data.uncompressedSize,
      text: () => {
        return entry.async('text');
      },
      arrayBuffer: () => {
        return entry.async('arraybuffer');
      },
    });
  }
  return fileList;
}

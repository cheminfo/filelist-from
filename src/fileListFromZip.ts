import JSZip from 'jszip';

type ZipFile = Parameters<typeof JSZip.loadAsync>[0];

export async function fileListFromZip(zipFile: ZipFile) {
  const jsZip = new JSZip();

  const zip = await jsZip.loadAsync(zipFile);
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

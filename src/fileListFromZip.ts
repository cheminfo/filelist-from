import JSZip from 'jszip';

type ZipFile = Parameters<typeof JSZip.loadAsync>[0];

/**
 * Create a FileList from a zip
 * @param zipContent
 * @returns File - Array storing the files retrieved
 */
export type MTimeMS = number;
export interface File {
  name: string;
  webkitRelativePath: string;
  lastModified: Date | MTimeMS;
  size: number;
  text: () => Promise<string>;
  arrayBuffer: () => Promise<ArrayBuffer>;
}

export async function fileListFromZip(zipContent: ZipFile): Promise<File[]> {
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

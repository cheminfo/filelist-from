import { join } from 'path';

import { fileListFromPath } from '../fileListFromPath';
import { fileListUnzip } from '../fileListUnzip';

describe('folder with zip files', () => {
  it('unzip fileList', async () => {
    const normalFileList = fileListFromPath(join(__dirname, 'dataUnzip'));
    const fileListUnzipped = await fileListUnzip(normalFileList);

    expect(
      Array.from(
        fileListUnzipped.map(
          (a) =>
            `${a.webkitRelativePath.replace(/^.*__tests__\/dataUnzip/, '')} - ${
              a.name
            }`,
        ),
      ),
    ).toStrictEqual([
      '/dir1/a.txt - a.txt',
      '/dir1/b.txt - b.txt',
      '/dir1/dir3/e.txt - e.txt',
      '/dir1/dir3/f.txt - f.txt',
      '/dir2/c.txt - c.txt',
      '/dir2/d.txt - d.txt',
      '/dir2/data.zipped - data.zipped',
      '/data.zip/data/c.txt - c.txt',
      '/data.zip/data/d.txt - d.txt',
      '/data.zip/data/dir1/a.txt - a.txt',
      '/data.zip/data/dir1/b.txt - b.txt',
      '/data.zip/data/dir1/dir3/e.txt - e.txt',
      '/data.zip/data/dir1/dir3/f.txt - f.txt',
      '/data.zip/data/dir1/dir3/zipFile3.zip/c.txt - c.txt',
      '/data.zip/data/dir1/dir3/zipFile3.zip/d.txt - d.txt',
    ]);

    const text = await fileListUnzipped[14].text();
    expect(text).toBe('d');
  });
  it('checkZip true', async () => {
    const normalFileList = fileListFromPath(join(__dirname, 'dataUnzip'));
    const fileListUnzipped = await fileListUnzip(normalFileList, {
      zipFiles: [{ match: /\.zipped$/i, checkZip: true }],
    });

    expect(
      Array.from(
        fileListUnzipped.map(
          (a) =>
            `${a.webkitRelativePath.replace(/^.*__tests__\/dataUnzip/, '')} - ${
              a.name
            }`,
        ),
      ),
    ).toStrictEqual([
      '/dir1/a.txt - a.txt',
      '/dir1/b.txt - b.txt',
      '/dir1/dir3/e.txt - e.txt',
      '/dir1/dir3/f.txt - f.txt',
      '/dir2/c.txt - c.txt',
      '/dir2/d.txt - d.txt',
      '/data.zip/data/c.txt - c.txt',
      '/data.zip/data/d.txt - d.txt',
      '/data.zip/data/dir1/a.txt - a.txt',
      '/data.zip/data/dir1/b.txt - b.txt',
      '/data.zip/data/dir1/dir3/e.txt - e.txt',
      '/data.zip/data/dir1/dir3/f.txt - f.txt',
      '/dir2/data.zipped/data/subDir1/c.txt - c.txt',
      '/dir2/data.zipped/data/subDir1/d.txt - d.txt',
      '/data.zip/data/dir1/dir3/zipFile3.zip/c.txt - c.txt',
      '/data.zip/data/dir1/dir3/zipFile3.zip/d.txt - d.txt',
    ]);

    const text = await fileListUnzipped[15].text();
    expect(text).toBe('d');
  });

  it('checkZip false', async () => {
    const normalFileList = fileListFromPath(join(__dirname, 'dataUnzip'));
    const fileListUnzipped = await fileListUnzip(normalFileList, {
      zipFiles: [{ match: /\.zipped$/i, checkZip: false }],
    });

    expect(
      Array.from(
        fileListUnzipped.map(
          (a) =>
            `${a.webkitRelativePath.replace(/^.*__tests__\/dataUnzip/, '')} - ${
              a.name
            }`,
        ),
      ),
    ).toStrictEqual([
      '/dir1/a.txt - a.txt',
      '/dir1/b.txt - b.txt',
      '/dir1/dir3/e.txt - e.txt',
      '/dir1/dir3/f.txt - f.txt',
      '/dir2/c.txt - c.txt',
      '/dir2/d.txt - d.txt',
      '/data.zip/data/c.txt - c.txt',
      '/data.zip/data/d.txt - d.txt',
      '/data.zip/data/dir1/a.txt - a.txt',
      '/data.zip/data/dir1/b.txt - b.txt',
      '/data.zip/data/dir1/dir3/e.txt - e.txt',
      '/data.zip/data/dir1/dir3/f.txt - f.txt',
      '/dir2/data.zipped/data/subDir1/c.txt - c.txt',
      '/dir2/data.zipped/data/subDir1/d.txt - d.txt',
      '/data.zip/data/dir1/dir3/zipFile3.zip/c.txt - c.txt',
      '/data.zip/data/dir1/dir3/zipFile3.zip/d.txt - d.txt',
    ]);

    const text = await fileListUnzipped[15].text();
    expect(text).toBe('d');
  });
});

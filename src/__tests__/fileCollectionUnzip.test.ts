import { join } from 'path';

import { fileCollectionFromPath } from '../fileCollectionFromPath';
import { fileCollectionUnzip } from '../fileCollectionUnzip';

describe('fileCollectionUnzip', () => {
  it('default value, only zip', async () => {
    const normalFileCollection = await fileCollectionFromPath(
      join(__dirname, 'dataUnzip'),
    );
    const fileCollectionUnzipped = await fileCollectionUnzip(
      normalFileCollection,
    );

    expect(
      Array.from(
        fileCollectionUnzipped.map(
          (a) =>
            `${a.webkitRelativePath.replace(/^.*__tests__\/dataUnzip/, '')} - ${
              a.name
            }`,
        ),
      ),
    ).toStrictEqual([
      '/data.zip/data/c.txt - c.txt',
      '/data.zip/data/d.txt - d.txt',
      '/data.zip/data/dir1/a.txt - a.txt',
      '/data.zip/data/dir1/b.txt - b.txt',
      '/data.zip/data/dir1/dir3/e.txt - e.txt',
      '/data.zip/data/dir1/dir3/f.txt - f.txt',
      '/data.zip/data/dir1/dir3/zipFile3.zip/c.txt - c.txt',
      '/data.zip/data/dir1/dir3/zipFile3.zip/d.txt - d.txt',
      '/dir1/a.txt - a.txt',
      '/dir1/b.txt - b.txt',
      '/dir1/dir3/e.txt - e.txt',
      '/dir1/dir3/f.txt - f.txt',
      '/dir2/c.txt - c.txt',
      '/dir2/d.txt - d.txt',
      '/dir2/data.zipped - data.zipped',
    ]);

    const text = await fileCollectionUnzipped[1].text();
    expect(text).toBe('d');
  });
  it('forced extension, only zipped', async () => {
    const normalFileCollection = await fileCollectionFromPath(
      join(__dirname, 'dataUnzip'),
    );
    const fileCollectionUnzipped = await fileCollectionUnzip(
      normalFileCollection,
      {
        zipExtensions: ['zip', 'zipped'],
      },
    );

    expect(
      Array.from(
        fileCollectionUnzipped.map(
          (a) =>
            `${a.webkitRelativePath.replace(/^.*__tests__\/dataUnzip/, '')} - ${
              a.name
            }`,
        ),
      ),
    ).toStrictEqual([
      '/data.zip/data/c.txt - c.txt',
      '/data.zip/data/d.txt - d.txt',
      '/data.zip/data/dir1/a.txt - a.txt',
      '/data.zip/data/dir1/b.txt - b.txt',
      '/data.zip/data/dir1/dir3/e.txt - e.txt',
      '/data.zip/data/dir1/dir3/f.txt - f.txt',
      '/data.zip/data/dir1/dir3/zipFile3.zip/c.txt - c.txt',
      '/data.zip/data/dir1/dir3/zipFile3.zip/d.txt - d.txt',
      '/dir1/a.txt - a.txt',
      '/dir1/b.txt - b.txt',
      '/dir1/dir3/e.txt - e.txt',
      '/dir1/dir3/f.txt - f.txt',
      '/dir2/c.txt - c.txt',
      '/dir2/d.txt - d.txt',
      '/dir2/data.zipped/data/subDir1/c.txt - c.txt',
      '/dir2/data.zipped/data/subDir1/d.txt - d.txt',
    ]);

    const text = await fileCollectionUnzipped[15].text();
    expect(text).toBe('d');
  });

  it('check non zip', async () => {
    const normalFileCollection = await fileCollectionFromPath(
      join(__dirname, 'dataUnzip'),
    );
    const fileCollectionUnzipped = await fileCollectionUnzip(
      normalFileCollection,
      {
        zipExtensions: ['txt', 'zip', 'zipped'],
      },
    );

    expect(
      Array.from(
        fileCollectionUnzipped.map(
          (a) =>
            `${a.webkitRelativePath.replace(/^.*__tests__\/dataUnzip/, '')} - ${
              a.name
            }`,
        ),
      ),
    ).toStrictEqual([
      '/data.zip/data/c.txt - c.txt',
      '/data.zip/data/d.txt - d.txt',
      '/data.zip/data/dir1/a.txt - a.txt',
      '/data.zip/data/dir1/b.txt - b.txt',
      '/data.zip/data/dir1/dir3/e.txt - e.txt',
      '/data.zip/data/dir1/dir3/f.txt - f.txt',
      '/data.zip/data/dir1/dir3/zipFile3.zip/c.txt - c.txt',
      '/data.zip/data/dir1/dir3/zipFile3.zip/d.txt - d.txt',
      '/dir1/a.txt - a.txt',
      '/dir1/b.txt - b.txt',
      '/dir1/dir3/e.txt - e.txt',
      '/dir1/dir3/f.txt - f.txt',
      '/dir2/c.txt - c.txt',
      '/dir2/d.txt - d.txt',
      '/dir2/data.zipped/data/subDir1/c.txt - c.txt',
      '/dir2/data.zipped/data/subDir1/d.txt - d.txt',
    ]);

    const text = await fileCollectionUnzipped[15].text();
    expect(text).toBe('d');
  });
});

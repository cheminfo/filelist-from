import { join } from 'path';

import { fileCollectionFromPath } from '../fileCollectionFromPath';
import { fileCollectionItemsUnzip } from '../fileCollectionItemsUnzip';

describe('fileCollectionItemsUnzip', () => {
  it('default value, only zip', async () => {
    const normalFileCollection = await fileCollectionFromPath(
      join(__dirname, '../__tests__/dataUnzip'),
    );
    const fileCollectionUnzipped = await fileCollectionItemsUnzip(
      normalFileCollection.items,
    );

    expect(
      Array.from(
        fileCollectionUnzipped.map((a) => `${a.relativePath} - ${a.name}`),
      ),
    ).toStrictEqual([
      'dataUnzip/data.zip/data/c.txt - c.txt',
      'dataUnzip/data.zip/data/d.txt - d.txt',
      'dataUnzip/data.zip/data/dir1/a.txt - a.txt',
      'dataUnzip/data.zip/data/dir1/b.txt - b.txt',
      'dataUnzip/data.zip/data/dir1/dir3/e.txt - e.txt',
      'dataUnzip/data.zip/data/dir1/dir3/f.txt - f.txt',
      'dataUnzip/data.zip/data/dir1/dir3/zipFile3.zip/c.txt - c.txt',
      'dataUnzip/data.zip/data/dir1/dir3/zipFile3.zip/d.txt - d.txt',
      'dataUnzip/dir1/a.txt - a.txt',
      'dataUnzip/dir1/b.txt - b.txt',
      'dataUnzip/dir1/dir3/e.txt - e.txt',
      'dataUnzip/dir1/dir3/f.txt - f.txt',
      'dataUnzip/dir2/c.txt - c.txt',
      'dataUnzip/dir2/d.txt - d.txt',
      'dataUnzip/dir2/data.zipped - data.zipped',
    ]);

    const text = await fileCollectionUnzipped[1].text();
    expect(text).toBe('d');
  });
  it('forced extension, only zipped', async () => {
    const normalFileCollection = await fileCollectionFromPath(
      join(__dirname, '../__tests__/dataUnzip'),
    );
    const fileCollectionUnzipped = await fileCollectionItemsUnzip(
      normalFileCollection.items,
      {
        zipExtensions: ['zip', 'zipped'],
      },
    );

    expect(
      Array.from(
        fileCollectionUnzipped.map((a) => `${a.relativePath} - ${a.name}`),
      ),
    ).toStrictEqual([
      'dataUnzip/data.zip/data/c.txt - c.txt',
      'dataUnzip/data.zip/data/d.txt - d.txt',
      'dataUnzip/data.zip/data/dir1/a.txt - a.txt',
      'dataUnzip/data.zip/data/dir1/b.txt - b.txt',
      'dataUnzip/data.zip/data/dir1/dir3/e.txt - e.txt',
      'dataUnzip/data.zip/data/dir1/dir3/f.txt - f.txt',
      'dataUnzip/data.zip/data/dir1/dir3/zipFile3.zip/c.txt - c.txt',
      'dataUnzip/data.zip/data/dir1/dir3/zipFile3.zip/d.txt - d.txt',
      'dataUnzip/dir1/a.txt - a.txt',
      'dataUnzip/dir1/b.txt - b.txt',
      'dataUnzip/dir1/dir3/e.txt - e.txt',
      'dataUnzip/dir1/dir3/f.txt - f.txt',
      'dataUnzip/dir2/c.txt - c.txt',
      'dataUnzip/dir2/d.txt - d.txt',
      'dataUnzip/dir2/data.zipped/data/subDir1/c.txt - c.txt',
      'dataUnzip/dir2/data.zipped/data/subDir1/d.txt - d.txt',
    ]);

    const text = await fileCollectionUnzipped[15].text();
    expect(text).toBe('d');
  });

  it('check non zip', async () => {
    const normalFileCollection = await fileCollectionFromPath(
      join(__dirname, '../__tests__/dataUnzip'),
    );
    const fileCollectionUnzipped = await fileCollectionItemsUnzip(
      normalFileCollection.items,
      {
        zipExtensions: ['txt', 'zip', 'zipped'],
      },
    );

    expect(
      Array.from(
        fileCollectionUnzipped.map((a) => `${a.relativePath} - ${a.name}`),
      ),
    ).toStrictEqual([
      'dataUnzip/data.zip/data/c.txt - c.txt',
      'dataUnzip/data.zip/data/d.txt - d.txt',
      'dataUnzip/data.zip/data/dir1/a.txt - a.txt',
      'dataUnzip/data.zip/data/dir1/b.txt - b.txt',
      'dataUnzip/data.zip/data/dir1/dir3/e.txt - e.txt',
      'dataUnzip/data.zip/data/dir1/dir3/f.txt - f.txt',
      'dataUnzip/data.zip/data/dir1/dir3/zipFile3.zip/c.txt - c.txt',
      'dataUnzip/data.zip/data/dir1/dir3/zipFile3.zip/d.txt - d.txt',
      'dataUnzip/dir1/a.txt - a.txt',
      'dataUnzip/dir1/b.txt - b.txt',
      'dataUnzip/dir1/dir3/e.txt - e.txt',
      'dataUnzip/dir1/dir3/f.txt - f.txt',
      'dataUnzip/dir2/c.txt - c.txt',
      'dataUnzip/dir2/d.txt - d.txt',
      'dataUnzip/dir2/data.zipped/data/subDir1/c.txt - c.txt',
      'dataUnzip/dir2/data.zipped/data/subDir1/d.txt - d.txt',
    ]);

    const text = await fileCollectionUnzipped[15].text();
    expect(text).toBe('d');
  });
});

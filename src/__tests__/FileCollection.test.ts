import { join } from 'path';

import type { FileCollectionItem } from '../FileCollectionItem';
import { fileCollectionFromPath } from '../fileCollectionFromPath';

describe('FileCollection', () => {
  it('filter', async () => {
    const fileCollection = await fileCollectionFromPath(
      join(__dirname, '../__tests__/data/dir1'),
    );

    const filtered = fileCollection.filter((file) =>
      file.name.match(/[ef]\.txt/),
    );

    expect(
      Array.from(filtered.files.map((a) => `${a.relativePath} - ${a.name}`)),
    ).toStrictEqual(['dir1/dir3/e.txt - e.txt', 'dir1/dir3/f.txt - f.txt']);
  });

  it('find', async () => {
    const fileCollection = await fileCollectionFromPath(
      join(__dirname, '../__tests__/data/dir1'),
    );

    const found = fileCollection.find((file) =>
      /e.txt/.test(file.name),
    ) as FileCollectionItem;
    const notFound = fileCollection.find((file) =>
      /notFound.txt/.test(file.name),
    ) as undefined;

    expect(`${found.relativePath} - ${found.name}`).toStrictEqual(
      'dir1/dir3/e.txt - e.txt',
    );
    expect(notFound).toBeUndefined();
  });
});

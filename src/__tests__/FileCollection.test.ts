import { join } from 'path';

import { fileCollectionFromPath } from '../fileCollectionFromPath';
import { fileCollectionFromZip } from '../fileCollectionFromZip';

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

    const zipped = await fileCollection.zip();
    expect(zipped).toHaveLength(612);

    const unzippedFileCollection = await fileCollectionFromZip(zipped);

    expect(
      Array.from(
        unzippedFileCollection.files.map(
          (a) => `${a.relativePath} - ${a.name}`,
        ),
      ),
    ).toStrictEqual([
      'dir1/a.txt - a.txt',
      'dir1/b.txt - b.txt',
      'dir1/dir3/e.txt - e.txt',
      'dir1/dir3/f.txt - f.txt',
    ]);
  });
});

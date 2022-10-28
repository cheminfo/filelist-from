/* eslint-disable @typescript-eslint/prefer-regexp-exec */
import { join } from 'path';

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

    const zipped = await fileCollection.zip();
    const zippedFile = zipped.files[0];
    expect(zippedFile.relativePath).toBe('file.zip');
    expect((await zippedFile.arrayBuffer()).byteLength).toBe(612);
  });
});

import { join } from 'path';

import { fileCollectionFromPath } from '../fileCollectionFromPath';
import { fileCollectionUngzip } from '../fileCollectionUngzip';

describe('fileCollectionUngzip', () => {
  it('default value, only gzip', async () => {
    const normalFileCollection = await fileCollectionFromPath(
      join(__dirname, 'dataUngzip'),
    );
    const fileCollectionUngzipped = await fileCollectionUngzip(
      normalFileCollection,
    );

    const files = Array.from(
      fileCollectionUngzipped.map(
        (a) =>
          `${a.relativePath.replace(/^.*__tests__\/dataUngzip/, '')} - ${
            a.name
          }`,
      ),
    );

    expect(files).toStrictEqual([
      '/dir1/a.txt - a.txt',
      '/dir1/b.txt.gz - b.txt',
      '/dir1/dir3/e.txt - e.txt',
      '/dir1/dir3/f.txt.gz - f.txt',
      '/dir2/c.txt - c.txt',
      '/dir2/d.txt - d.txt',
    ]);

    const text = await fileCollectionUngzipped[1].text();
    expect(text).toBe('b\n');

    const arrayBuffer = await fileCollectionUngzipped[1].arrayBuffer();
    expect(arrayBuffer).toMatchInlineSnapshot(`
      Uint8Array [
        98,
        10,
      ]
    `);
  });
});

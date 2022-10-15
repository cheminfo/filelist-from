import { join } from 'path';

import { fileCollectionFromPath } from '../fileCollectionFromPath';
import { fileCollectionItemsUngzip } from '../fileCollectionItemsUngzip';

describe('fileCollectionItemsUngzip', () => {
  it('default value, only gzip', async () => {
    const normalFileCollection = await fileCollectionFromPath(
      join(__dirname, '../__tests__/dataUngzip'),
    );
    const fileCollectionUngzipped = await fileCollectionItemsUngzip(
      normalFileCollection.files,
    );

    const files = Array.from(
      fileCollectionUngzipped.map((a) => `${a.relativePath} - ${a.name}`),
    );

    expect(files).toStrictEqual([
      'dataUngzip/dir1/a.txt - a.txt',
      'dataUngzip/dir1/b.txt.gz - b.txt',
      'dataUngzip/dir1/dir3/e.txt - e.txt',
      'dataUngzip/dir1/dir3/f.txt.gz - f.txt',
      'dataUngzip/dir2/c.txt - c.txt',
      'dataUngzip/dir2/d.txt - d.txt',
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

    if (parseInt(process.versions.node) >= 18) {
      const stream = fileCollectionUngzipped[1].stream();
      const results = [];
      //@ts-expect-error feature is too new
      for await (let chunk of stream) {
        results.push(chunk);
      }
      expect(new Uint8Array(results[0])[0]).toBe(98);
    } else {
      expect(() => {
        fileCollectionUngzipped[1].stream();
      }).toThrow('');
    }
  });
});

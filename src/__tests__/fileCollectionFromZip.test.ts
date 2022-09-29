import { readFileSync } from 'fs';
import { join } from 'path';

import { fileCollectionFromZip } from '../fileCollectionFromZip';

describe('fileCollectionFromZip', () => {
  it('simple data.zip', async () => {
    const fileCollection = await fileCollectionFromZip(
      readFileSync(join(__dirname, 'data.zip')),
    );

    expect(
      Array.from(
        fileCollection.items.map((a) => `${a.relativePath} - ${a.name}`),
      ).sort((a, b) => (a < b ? -1 : 1)),
    ).toStrictEqual([
      'data/dir1/a.txt - a.txt',
      'data/dir1/b.txt - b.txt',
      'data/dir1/dir3/e.txt - e.txt',
      'data/dir1/dir3/f.txt - f.txt',
      'data/dir2/c.txt - c.txt',
      'data/dir2/d.txt - d.txt',
    ]);

    const text = await fileCollection.items[0].text();
    expect(text).toBe('c');
    const arrayBuffer = new Uint8Array(
      await fileCollection.items[0].arrayBuffer(),
    );
    expect(arrayBuffer[0]).toBe(99);

    if (Number(process.versions.node.split('.')[0]) >= 18) {
      const stream = fileCollection.items[1].stream();
      const results = [];
      //@ts-expect-error feature is too new
      for await (let chunk of stream) {
        results.push(chunk);
      }
      expect(new Uint8Array(results[0])[0]).toBe(100);
    }
  });
});

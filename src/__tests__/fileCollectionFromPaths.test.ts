import { join } from 'path';

import { fileCollectionFromPaths } from '../fileCollectionFromPaths';

describe('fileCollectionFromPaths', () => {
  it('simple data', async () => {
    const fileCollection = await fileCollectionFromPaths([
      join(__dirname, 'data/dir1'),
      join(__dirname, 'data/dir2'),
    ]);

    expect(
      Array.from(
        fileCollection.files.map((a) => `${a.relativePath} - ${a.name}`),
      ),
    ).toStrictEqual([
      'dir1/a.txt - a.txt',
      'dir1/b.txt - b.txt',
      'dir1/dir3/e.txt - e.txt',
      'dir1/dir3/f.txt - f.txt',
      'dir2/c.txt - c.txt',
      'dir2/d.txt - d.txt',
    ]);

    const text = await fileCollection.files[0].text();
    expect(text).toBe('a');
    const arrayBuffer = new Uint8Array(
      await fileCollection.files[0].arrayBuffer(),
    );
    expect(arrayBuffer[0]).toBe(97);

    if (['v14', 'v16'].includes(process.version.split('.')[0])) {
      expect(() => fileCollection.files[1].stream()).toThrow(
        /method is only supported/,
      );
    } else {
      const stream = fileCollection.files[1].stream();
      const results = [];
      //TODO remove this expect-error
      //@ts-expect-error How to solve this ??
      for await (const chunk of stream) {
        results.push(chunk);
      }
      expect(results[0][0]).toBe(98);
    }

    const names: string[] = [];
    for (const file of fileCollection) {
      names.push(file.name);
    }
    expect(names).toStrictEqual([
      'a.txt',
      'b.txt',
      'e.txt',
      'f.txt',
      'c.txt',
      'd.txt',
    ]);
  });
});

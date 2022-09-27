import { join } from 'path';

import { fileCollectionFromPath } from '../fileCollectionFromPath';

describe('fileCollectionFromPath', () => {
  it('simple data', async () => {
    const fileCollection = await fileCollectionFromPath(
      join(__dirname, 'data'),
    );

    expect(
      Array.from(fileCollection.map((a) => `${a.relativePath} - ${a.name}`)),
    ).toStrictEqual([
      'data/dir1/a.txt - a.txt',
      'data/dir1/b.txt - b.txt',
      'data/dir1/dir3/e.txt - e.txt',
      'data/dir1/dir3/f.txt - f.txt',
      'data/dir2/c.txt - c.txt',
      'data/dir2/d.txt - d.txt',
      'data/dir3/a.MpT - a.MpT',
      'data/dir3/a.mpr - a.mpr',
      'data/dir3/a.mps - a.mps',
    ]);

    const text = await fileCollection[0].text();
    expect(text).toBe('a');
    const arrayBuffer = new Uint8Array(await fileCollection[0].arrayBuffer());
    expect(arrayBuffer[0]).toBe(97);

    if (['v14', 'v16'].includes(process.version.split('.')[0])) {
      expect(() => fileCollection[1].stream()).toThrow(
        /method is only supported/,
      );
    } else {
      const stream = fileCollection[1].stream();
      const results = [];
      for await (let chunk of stream) {
        results.push(chunk);
      }
      expect(results[0][0]).toBe(98);
    }
  });

  it('data with zip', async () => {
    const fileCollection = await fileCollectionFromPath(
      join(__dirname, 'dataUnzip'),
    );

    expect(
      Array.from(fileCollection.map((a) => `${a.relativePath} - ${a.name}`)),
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
  });
});

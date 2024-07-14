import { join } from 'path';

import { FifoLogger } from 'fifo-logger';

import { fileCollectionFromPath } from '../fileCollectionFromPath';

describe('fileCollectionFromPath', () => {
  it('simple file path', async () => {
    const fileCollection = await fileCollectionFromPath(
      join(__dirname, 'dataFile/data/file.txt'),
    );
    const file = fileCollection.files[0];
    expect(`${file.relativePath}-${file.name}`).toStrictEqual(
      'file.txt-file.txt',
    );

    const text = await file.text();

    expect(text).toBe('file');

    const arrayBuffer = new Uint8Array(
      await fileCollection.files[0].arrayBuffer(),
    );
    expect(arrayBuffer[0]).toBe(102);
  });
  it('simple data', async () => {
    const fileCollection = await fileCollectionFromPath(
      join(__dirname, 'data'),
    );

    expect(
      Array.from(
        fileCollection.files.map((a) => `${a.relativePath} - ${a.name}`),
      ),
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
      'a.MpT',
      'a.mpr',
      'a.mps',
    ]);
  });

  it('simple data without ignore dotFiles', async () => {
    const fileCollection = await fileCollectionFromPath(
      join(__dirname, 'data'),
      { filter: { ignoreDotfiles: false } },
    );
    expect(
      Array.from(
        fileCollection.files.map((a) => `${a.relativePath} - ${a.name}`),
      ),
    ).toStrictEqual([
      'data/.dotFile - .dotFile',
      'data/.dotFolder/a.txt - a.txt',
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
  });

  it('recursive zip, recursive:true', async () => {
    const fileCollection = await fileCollectionFromPath(
      join(__dirname, 'dataRecursiveZip'),
    );
    const results = fileCollection.files.map(
      (a) => `${a.relativePath} - ${a.name}`,
    );
    expect(results).toStrictEqual([
      'dataRecursiveZip/a.txt - a.txt',
      'dataRecursiveZip/data.zip/dataRecursiveZip/data.zip/data/dir1/a.txt - a.txt',
      'dataRecursiveZip/data.zip/dataRecursiveZip/data.zip/data/dir1/b.txt - b.txt',
      'dataRecursiveZip/data.zip/dataRecursiveZip/data.zip/data/dir1/dir3/e.txt - e.txt',
      'dataRecursiveZip/data.zip/dataRecursiveZip/data.zip/data/dir1/dir3/f.txt - f.txt',
      'dataRecursiveZip/data.zip/dataRecursiveZip/data.zip/data/dir2/c.txt - c.txt',
      'dataRecursiveZip/data.zip/dataRecursiveZip/data.zip/data/dir2/d.txt - d.txt',
    ]);
  });

  it('recursive zip, recursive:false', async () => {
    const fileCollection = await fileCollectionFromPath(
      join(__dirname, 'dataRecursiveZip'),
      { unzip: { recursive: false } },
    );
    const results = fileCollection.files.map(
      (a) => `${a.relativePath} - ${a.name}`,
    );
    expect(results).toStrictEqual([
      'dataRecursiveZip/a.txt - a.txt',
      'dataRecursiveZip/data.zip/dataRecursiveZip/data.zip - data.zip',
    ]);
  });

  it('recursive zip, ignoreDotfiles:false', async () => {
    const logger = new FifoLogger();
    const fileCollection = await fileCollectionFromPath(
      join(__dirname, 'dataRecursiveZip'),
      { filter: { ignoreDotfiles: false }, logger },
    );
    const results = fileCollection.files
      .map((a) => `${a.relativePath} - ${a.name}`)
      .filter((a) => !a.includes('.DS_Store') || a.includes('zip'));
    expect(logger.getLogs()).toHaveLength(2);
    expect(results).toStrictEqual([
      'dataRecursiveZip/.test.txt - .test.txt',
      'dataRecursiveZip/a.txt - a.txt',
      'dataRecursiveZip/data.zip/__MACOSX/dataRecursiveZip/._.DS_Store - ._.DS_Store',
      'dataRecursiveZip/data.zip/__MACOSX/dataRecursiveZip/._data.zip - ._data.zip',
      'dataRecursiveZip/data.zip/dataRecursiveZip/.DS_Store - .DS_Store',
      'dataRecursiveZip/data.zip/dataRecursiveZip/.dotFolder/empty.zip - empty.zip',
      'dataRecursiveZip/data.zip/dataRecursiveZip/data.zip/data/dir1/a.txt - a.txt',
      'dataRecursiveZip/data.zip/dataRecursiveZip/data.zip/data/dir1/b.txt - b.txt',
      'dataRecursiveZip/data.zip/dataRecursiveZip/data.zip/data/dir1/dir3/e.txt - e.txt',
      'dataRecursiveZip/data.zip/dataRecursiveZip/data.zip/data/dir1/dir3/f.txt - f.txt',
      'dataRecursiveZip/data.zip/dataRecursiveZip/data.zip/data/dir2/c.txt - c.txt',
      'dataRecursiveZip/data.zip/dataRecursiveZip/data.zip/data/dir2/d.txt - d.txt',
    ]);
  });

  it('data with zip', async () => {
    const fileCollection = await fileCollectionFromPath(
      join(__dirname, 'dataUnzip'),
    );

    expect(
      Array.from(
        fileCollection.files.map((a) => `${a.relativePath} - ${a.name}`),
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
  });
});

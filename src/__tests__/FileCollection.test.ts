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
  });

  it('zip', async () => {
    const fileCollection = await fileCollectionFromPath(
      join(__dirname, '../__tests__/data/dir1'),
    );

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

  it('addText addArrayBuffer addTypedArray', async () => {
    const fileCollection = await fileCollectionFromPath(
      join(__dirname, '../__tests__/data/dir1'),
    );

    fileCollection.addText('text', 'Hello');

    const uint8Array = Uint8Array.from([65, 66, 67, 68, 69]);

    fileCollection.addTypedArray('typedArray', uint8Array);

    fileCollection.addArrayBuffer('arrayBuffer', uint8Array.buffer);

    const textEntry = fileCollection.files.filter(
      (file) => file.name === 'text',
    )[0];

    const resultText = new Uint8Array(await textEntry.arrayBuffer());
    expect(resultText).toHaveLength(5);
    expect(Array.from(resultText)).toStrictEqual([72, 101, 108, 108, 111]);

    const uint8ArrayEntry = fileCollection.files.filter(
      (file) => file.name === 'typedArray',
    )[0];

    const resultUint8Array = await uint8ArrayEntry.text();
    expect(resultUint8Array).toHaveLength(5);
    expect(resultUint8Array).toBe('ABCDE');

    const arrayBufferEntry = fileCollection.files.filter(
      (file) => file.name === 'arrayBuffer',
    )[0];

    const resultArrayBuffer = await arrayBufferEntry.text();
    expect(resultArrayBuffer).toHaveLength(5);
    expect(resultArrayBuffer).toBe('ABCDE');
  });
});

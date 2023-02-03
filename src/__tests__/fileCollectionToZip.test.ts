import { join } from 'path';

import { fileCollectionFromPath } from '../fileCollectionFromPath';
import { fileCollectionFromZip } from '../fileCollectionFromZip';
import { fileCollectionToZip } from '../fileCollectionToZip';

describe('fileCollectionToZip', () => {
  it('data with zip', async () => {
    const fileCollection = await fileCollectionFromPath(
      join(__dirname, 'data'),
    );

    const typedArray = await fileCollectionToZip(fileCollection);
    const unzipped = await fileCollectionFromZip(typedArray);
    const paths = unzipped.files.map((file) => file.relativePath);
    expect(paths).toStrictEqual([
      'data/dir1/a.txt',
      'data/dir1/b.txt',
      'data/dir1/dir3/e.txt',
      'data/dir1/dir3/f.txt',
      'data/dir2/c.txt',
      'data/dir2/d.txt',
      'data/dir3/a.MpT',
      'data/dir3/a.mpr',
      'data/dir3/a.mps',
    ]);

    expect(await unzipped.files[0].text()).toBe('a');
  });
});

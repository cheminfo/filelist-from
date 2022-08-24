import { join } from 'path';

import { fileListFromPath } from '../fileListFromPath';
import { fileListUngzip } from '../fileListUngzip';

describe('fileListUngzip', () => {
  it('default value, only gzip', async () => {
    const normalFileList = await fileListFromPath(
      join(__dirname, 'dataUngzip'),
    );
    const fileListUngzipped = await fileListUngzip(normalFileList);

    const files = Array.from(
      fileListUngzipped.map(
        (a) =>
          `${a.webkitRelativePath.replace(/^.*__tests__\/dataUngzip/, '')} - ${
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

    const text = await fileListUngzipped[1].text();
    expect(text).toBe('b\n');

    const arrayBuffer = await fileListUngzipped[1].arrayBuffer();
    expect(arrayBuffer).toMatchInlineSnapshot(`
      Uint8Array [
        98,
        10,
      ]
    `);
  });
});

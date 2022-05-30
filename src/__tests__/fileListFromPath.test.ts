import { join } from 'path';

import { fileListFromPath } from '../fileListFromPath';

describe('fileListFromPath', () => {
  it('simple data', async () => {
    const fileList = fileListFromPath(join(__dirname, 'data'));

    expect(
      Array.from(
        fileList.map(
          (a) =>
            `${a.webkitRelativePath.replace(/^.*__tests__\/data/, '')} - ${
              a.name
            }`,
        ),
      ),
    ).toStrictEqual([
      '/dir1/a.txt - a.txt',
      '/dir1/b.txt - b.txt',
      '/dir1/dir3/e.txt - e.txt',
      '/dir1/dir3/f.txt - f.txt',
      '/dir2/c.txt - c.txt',
      '/dir2/d.txt - d.txt',
      '/dir3/a.MpT - a.MpT',
      '/dir3/a.mpr - a.mpr',
      '/dir3/a.mps - a.mps',
    ]);

    const text = await fileList[0].text();
    expect(text).toBe('a');
    const arrayBuffer = new Uint8Array(await fileList[0].arrayBuffer());
    expect(arrayBuffer[0]).toBe(97);
    const stream = fileList[1].stream();
    const results = [];
    for await (let chunk of stream) {
      results.push(chunk);
    }
    expect(results[0][0]).toBe(98);
  });
});

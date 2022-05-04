import { readFileSync } from 'fs';
import { join } from 'path';

import { fileListFromZip } from '../fileListFromZip';

describe('fileListFromZip', () => {
  it('simple data.zip', async () => {
    const fileList = await fileListFromZip(
      readFileSync(join(__dirname, 'data.zip')),
    );

    expect(
      Array.from(
        fileList.map((a) => `${a.webkitRelativePath} - ${a.name}`),
      ).sort((a, b) => (a < b ? -1 : 1)),
    ).toStrictEqual([
      'data/dir1/a.txt - a.txt',
      'data/dir1/b.txt - b.txt',
      'data/dir1/dir3/e.txt - e.txt',
      'data/dir1/dir3/f.txt - f.txt',
      'data/dir2/c.txt - c.txt',
      'data/dir2/d.txt - d.txt',
    ]);

    const text = await fileList[0].text();
    expect(text).toBe('c');
    const arrayBuffer = new Uint8Array(await fileList[0].arrayBuffer());
    expect(arrayBuffer[0]).toBe(99);

    const stream = fileList[1].stream();
    const results = [];
    for await (let chunk of stream) {
      results.push(chunk);
    }
    expect(new Uint8Array(results[0])[0]).toBe(100);
  });
});

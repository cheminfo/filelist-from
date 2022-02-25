import { readFileSync } from 'fs';
import { join } from 'path';

import { fileListFromZip } from '../fileListFromZip';

describe('fileListFromZip', () => {
  it('simple data.zip', async () => {
    const fileList = await fileListFromZip(
      readFileSync(join(__dirname, 'data.zip')),
    );

    expect(Array.from(fileList.map((a) => a.name))).toStrictEqual([
      'c.txt',
      'd.txt',
      'b.txt',
      'a.txt',
      'e.txt',
      'f.txt',
    ]);

    const text = await fileList[0].text();
    expect(text).toBe('c');
    const arrayBuffer = new Uint8Array(await fileList[0].arrayBuffer());
    expect(arrayBuffer[0]).toBe(99);
  });
});

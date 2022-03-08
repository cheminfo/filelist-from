import { join } from 'path';

import { fileListFromPath } from '../fileListFromPath';

describe('fileListFromPath', () => {
  it('simple data', async () => {
    const fileList = fileListFromPath(join(__dirname, 'data'));

    expect(Array.from(fileList.map((a) => a.name))).toStrictEqual([
      'a.txt',
      'b.txt',
      'e.txt',
      'f.txt',
      'c.txt',
      'd.txt',
    ]);

    const text = await fileList[0].text();
    expect(text).toBe('a');
    const arrayBuffer = new Uint8Array(await fileList[0].arrayBuffer());
    expect(arrayBuffer[0]).toBe(97);
  });
});

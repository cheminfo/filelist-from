import { readFileSync } from 'fs';
import { join } from 'path';

import { fileCollectionFromFileList } from '../fileCollectionFromFileList';

describe('fileCollectionFromFileList', () => {
  it('simple test', async () => {
    const fileList: FileList = [
      //@ts-expect-error Not all properties are defined
      {
        name: 'cd.txt',
        webkitRelativePath: 'ab/cd.txt',
        lastModified: 123456,
        size: 23,
        text: async () => 'hello',
        arrayBuffer: async () => new ArrayBuffer(8),
        type: 'ab',
        slice: () => new Blob(),
      },
    ];

    const result = (await fileCollectionFromFileList(fileList)).files[0];
    expect(result.name).toBe('cd.txt');
    expect(result.relativePath).toBe('ab/cd.txt');
    expect(await result.text()).toBe('hello');
  });
  it('with zip file', async () => {
    const data = readFileSync(join(__dirname, 'data.zip'));
    const fileList: FileList = [
      //@ts-expect-error Not all properties are defined
      {
        name: 'cd.zip',
        webkitRelativePath: 'ab/cd.zip',
        lastModified: 123456,
        size: 23,
        text: async () => 'hello',
        arrayBuffer: async () => data,
        type: 'ab',
        slice: () => new Blob(),
      },
    ];

    const results = (await fileCollectionFromFileList(fileList)).files;
    expect(results).toHaveLength(6);
    const result = results[0];
    expect(result.name).toBe('a.txt');
    expect(result.relativePath).toBe('ab/cd.zip/data/dir1/a.txt');
    expect(await result.text()).toBe('a');
  });
  it('error test', async () => {
    const fileList: FileList = [
      //@ts-expect-error Not all properties are defined
      {
        name: 'cd.txt',
        lastModified: 123456,
        size: 23,
      },
    ];
    await expect(
      fileCollectionFromFileList(fileList),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"The File of FileList must have the property webkitRelativePath. Did you forget to add the webkitdirectory property in the input element ?"`,
    );
  });
});

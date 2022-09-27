import { fileCollectionFromFileList } from '../fileCollectionFromFileList';

test('fileCollectionFromFileList', async () => {
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

  const result = fileCollectionFromFileList(fileList)[0];
  expect(result.name).toBe('cd.txt');
  expect(result.relativePath).toBe('ab/cd.txt');
  expect(await result.text()).toBe('hello');
});

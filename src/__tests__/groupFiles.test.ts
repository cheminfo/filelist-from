import { join } from 'path';

import { FileItem } from '../FileItem';
import { fileCollectionFromPath } from '../fileCollectionFromPath';
import { groupFiles, GroupFilesOptions } from '../groupFiles';

describe('groupFiles', () => {
  it('Default options, groupBy baseDir', async () => {
    const files = await fileCollectionFromPath(join(__dirname, 'data/dir3'));
    const results = groupFiles(files, {} as GroupFilesOptions);
    expect(results).toHaveLength(1);
    expect(results[0].meta).toStrictEqual({});
    expect(results[0].fileCollection).toHaveLength(3);
    expect(results[0].fileCollection.map((file) => file.name)).toStrictEqual([
      'a.MpT',
      'a.mpr',
      'a.mps',
    ]);
  });
  it('groupBy filename', async () => {
    const files = await fileCollectionFromPath(join(__dirname, 'data/dir3'));
    const results = groupFiles(files, {
      groupBy: 'filename',
    } as GroupFilesOptions);

    expect(results).toHaveLength(1);
    expect(results[0].meta).toStrictEqual({});
    expect(results[0].fileCollection).toHaveLength(3);
    expect(results[0].fileCollection.map((file) => file.name)).toStrictEqual([
      'a.MpT',
      'a.mpr',
      'a.mps',
    ]);
  });
  it('groupBy extension', async () => {
    const files = await fileCollectionFromPath(join(__dirname, 'data/dir3'));
    const results = groupFiles(files, {
      groupBy: 'extension',
    } as GroupFilesOptions);

    expect(results).toHaveLength(3);
    expect(
      results.map((result) => result.fileCollection[0].name),
    ).toStrictEqual(['a.MpT', 'a.mpr', 'a.mps']);
  });
  it('groupBy callback', async () => {
    const files = await fileCollectionFromPath(join(__dirname, 'data/dir3'));
    const results = groupFiles(files, {
      groupBy: (file: FileItem) => {
        return file.name.substring(0, 3);
      },
    } as GroupFilesOptions);
    expect(results).toHaveLength(2);
    expect(results.map((result) => result.key)).toStrictEqual(['a.M', 'a.m']);
  });
  it('meta', async () => {
    const files = await fileCollectionFromPath(join(__dirname, 'data'));
    const results = groupFiles(files, {
      meta: /.*\/data\/(?<dir>[^/]*).*/,
    } as GroupFilesOptions);

    expect(results.map((result) => result.meta)).toMatchObject([
      { dir: 'dir1' },
      { dir: 'dir1' },
      { dir: 'dir2' },
      { dir: 'dir3' },
    ]);
  });
});

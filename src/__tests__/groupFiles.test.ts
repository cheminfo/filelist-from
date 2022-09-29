import { join } from 'path';

import { FileCollectionItem } from '../FileCollectionItem';
import { fileCollectionFromPath } from '../fileCollectionFromPath';
import { groupFiles, GroupFilesOptions } from '../groupFiles';

describe('groupFiles', () => {
  it('Default options, groupBy baseDir', async () => {
    const files = await fileCollectionFromPath(join(__dirname, 'data/dir3'));
    const results = groupFiles(files, {} as GroupFilesOptions);
    expect(results).toHaveLength(1);
    expect(results[0].meta).toStrictEqual({});
    expect(results[0].key).toBe('dir3');
    expect(results[0].fileCollection.items).toHaveLength(3);
    expect(
      results[0].fileCollection.items.map((file) => file.name),
    ).toStrictEqual(['a.MpT', 'a.mpr', 'a.mps']);
  });
  it('groupBy filename', async () => {
    const files = await fileCollectionFromPath(join(__dirname, 'data/dir3'));
    const groupedFiles = groupFiles(files, {
      groupBy: 'filename',
    } as GroupFilesOptions);

    expect(groupedFiles).toHaveLength(1);
    expect(groupedFiles[0].meta).toStrictEqual({});
    expect(groupedFiles[0].fileCollection.items).toHaveLength(3);
    expect(
      groupedFiles[0].fileCollection.items.map((file) => file.name),
    ).toStrictEqual(['a.MpT', 'a.mpr', 'a.mps']);
  });
  it('groupBy extension', async () => {
    const files = await fileCollectionFromPath(join(__dirname, 'data/dir3'));
    const results = groupFiles(files, {
      groupBy: 'extension',
    } as GroupFilesOptions);

    expect(results).toHaveLength(3);
    expect(
      results.map((result) => result.fileCollection.items[0].name),
    ).toStrictEqual(['a.MpT', 'a.mpr', 'a.mps']);
  });
  it('groupBy callback', async () => {
    const files = await fileCollectionFromPath(join(__dirname, 'data/dir3'));
    const groupedFiles = groupFiles(files, {
      groupBy: (file: FileCollectionItem) => {
        return file.name.substring(0, 3);
      },
    } as GroupFilesOptions);
    expect(groupedFiles).toHaveLength(2);
    expect(groupedFiles.map((result) => result.key)).toStrictEqual([
      'a.M',
      'a.m',
    ]);
  });
  it('meta', async () => {
    const files = await fileCollectionFromPath(join(__dirname, 'data'));
    const groupesFiles = groupFiles(files, {
      meta: /data\/(?<dir>[^/]*).*/,
    } as GroupFilesOptions);

    expect(groupesFiles.map((result) => result.meta)).toMatchObject([
      { dir: 'dir1' },
      { dir: 'dir1' },
      { dir: 'dir2' },
      { dir: 'dir3' },
    ]);
  });
});

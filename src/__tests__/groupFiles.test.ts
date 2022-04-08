import { join } from 'path';

import { PartialFile } from '../PartialFile';
import { fileListFromPath } from '../fileListFromPath';
import { groupFiles, GroupFilesOptions } from '../groupFiles';

describe('groupFiles', () => {
  it('Default options, groupBy baseDir', () => {
    const files = fileListFromPath(join(__dirname, 'data/dir3'));
    const results = groupFiles(files, {} as GroupFilesOptions);
    expect(results).toHaveLength(1);
    expect(results[0].meta).toStrictEqual({});
    expect(results[0].fileList).toHaveLength(3);
    expect(results[0].fileList.map((file) => file.name)).toStrictEqual([
      'a.MpT',
      'a.mpr',
      'a.mps',
    ]);
  });
  it('groupBy filename', () => {
    const files = fileListFromPath(join(__dirname, 'data/dir3'));
    const results = groupFiles(files, {
      groupBy: 'filename',
    } as GroupFilesOptions);

    expect(results).toHaveLength(1);
    expect(results[0].meta).toStrictEqual({});
    expect(results[0].fileList).toHaveLength(3);
    expect(results[0].fileList.map((file) => file.name)).toStrictEqual([
      'a.MpT',
      'a.mpr',
      'a.mps',
    ]);
  });
  it('groupBy extension', () => {
    const files = fileListFromPath(join(__dirname, 'data/dir3'));
    const results = groupFiles(files, {
      groupBy: 'extension',
    } as GroupFilesOptions);

    expect(results).toHaveLength(3);
    expect(results.map((result) => result.fileList[0].name)).toStrictEqual([
      'a.MpT',
      'a.mpr',
      'a.mps',
    ]);
  });
  it('groupBy callback', () => {
    const files = fileListFromPath(join(__dirname, 'data/dir3'));
    const results = groupFiles(files, {
      groupBy: (file: PartialFile) => {
        return file.name.substring(0, 3);
      },
    } as GroupFilesOptions);
    expect(results).toHaveLength(2);
    expect(results.map((result) => result.key)).toStrictEqual(['a.M', 'a.m']);
  });
  it('meta', () => {
    const files = fileListFromPath(join(__dirname, 'data'));
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

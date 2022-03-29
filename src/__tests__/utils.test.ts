import { join } from 'path';

import { fileListFromPath } from '../fileListFromPath';
import { groupFiles } from '../utils';

describe('file grouping', () => {
  it('Default options', () => {
    const files = fileListFromPath(join(__dirname, 'data/dir3'));
    const result = groupFiles(files, {
      idWithBasename: true,
      fileKey: 'extension',
      applyToFileKey: (fk) => fk.toLowerCase(),
    });
    expect(result).toHaveLength(1);
    expect(Object.keys(result[0])).toStrictEqual(['gid', 'mpt', 'mpr', 'mps']);
  });

  it('Subset of options', () => {
    const files = fileListFromPath(join(__dirname, 'data/dir1'));
    const result = groupFiles(files, {
      idWithBasename: false,
      fileKey: 'basename',
      applyToFileKey: (fk) => fk.toUpperCase(),
    });
    expect(result).toHaveLength(2);
    expect(result[1].F).toMatchObject({
      name: 'f.txt',
      size: 1,
    });
  });

  it('Subset 2 of options', () => {
    const files = fileListFromPath(join(__dirname, 'data'));
    const result = groupFiles(files, {
      idWithBasename: false,
      fileKey: 'filename',
      captureFromPath: /\/(?<P2>\w+)\/(?<P1>\w+)$/,
    });
    const first = result[0];
    expect(first.gid).toMatch(/.*\/data\/dir1/);
    expect(first.captureGroups).toMatchObject({ P2: 'data', P1: 'dir1' });
  });
});

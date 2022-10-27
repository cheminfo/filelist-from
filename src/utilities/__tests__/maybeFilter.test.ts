import { join } from 'path';

import { fileCollectionFromPath } from '../../fileCollectionFromPath';
import { maybeFilter } from '../maybeFilter';

test('maybeFilter', async () => {
  const files = (
    await fileCollectionFromPath(join(__dirname, 'data/hidden'), {
      ignoreDotFiles: false,
    })
  ).files;
  const filtered = await maybeFilter(files);
  expect(filtered).toHaveLength(4);

  const notFiltered = await maybeFilter(files, { ignoreDotFiles: false });
  expect(notFiltered).toHaveLength(9);
});

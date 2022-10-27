import { join } from 'path';

import { fileCollectionFromPath } from '../../fileCollectionFromPath';
import { maybeFilter } from '../maybeFilter';

test('maybeFilter', async () => {
  const files = (
    await fileCollectionFromPath(join(__dirname, 'data/hidden'), {
      ignoreDotfiles: false,
    })
  ).files;
  const filtered = await maybeFilter(files);
  expect(filtered).toHaveLength(4);

  const notFiltered = await maybeFilter(files, { ignoreDotfiles: false });
  expect(notFiltered).toHaveLength(9);
});

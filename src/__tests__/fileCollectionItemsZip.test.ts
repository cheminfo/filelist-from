import { join } from 'path';

import { fileCollectionFromPath } from '../fileCollectionFromPath';
import { fileCollectionItemsZip } from '../fileCollectionItemsZip';

describe('fileCollectionItemsZip', () => {
  it('simple data', async () => {
    const fileCollection = await fileCollectionFromPath(
      join(__dirname, 'data'),
    );

    const zippedItem = await fileCollectionItemsZip(fileCollection.files);

    const zip = await zippedItem.arrayBuffer();
    expect(zip.byteLength).toBe(1482);

    // This is the way you can check that the zip is correct
    // writeFileSync('test.zip', Buffer.from(await zippedItem.arrayBuffer()));
  });
});

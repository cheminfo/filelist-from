import { stat, readFile } from 'fs/promises';
import { join } from 'path';

import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { fileCollectionFromZipURL } from '../fileCollectionFromZipURL';

const server = setupServer(
  rest.get('http://localhost/*', async (req, res, ctx) => {
    const pathname = join(__dirname, req.url.pathname);
    const pathnameStat = await stat(pathname);
    if (pathnameStat.isDirectory()) {
      return res(ctx.json({}));
    } else if (pathnameStat.isFile()) {
      const data = await readFile(pathname);
      return res(ctx.body(data));
    } else {
      throw new Error(`unknown path: ${pathname}`);
    }
  }),
);

// Enable request interception.
beforeAll(() => {
  server.listen();
});

// Reset handlers so that each test could alter them
// without affecting other, unrelated tests.
afterEach(() => server.resetHandlers());

// Don't forget to clean up afterwards.
afterAll(() => {
  server.close();
});

test('list of zip file', async () => {
  const url = 'http://localhost/data.zip';
  const fileCollection = (await fileCollectionFromZipURL(url)).files;

  expect(fileCollection).toHaveLength(6);
  const first = await fileCollection[0].text();
  expect(first).toBe('c');
  const second = await fileCollection[1].arrayBuffer();
  expect(Array.from(Buffer.from(second))).toStrictEqual([100]);
});

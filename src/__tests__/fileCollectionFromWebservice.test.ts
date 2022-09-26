import { readdir, stat, readFile } from 'fs/promises';
import { join } from 'path';

import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { fileCollectionFromWebservice } from '../fileCollectionFromWebservice';

const server = setupServer(
  rest.get('http://localhost/data*', async (req, res, ctx) => {
    const pathname = join(__dirname, req.url.pathname);
    const pathnameStat = await stat(pathname);
    if (pathnameStat.isDirectory()) {
      const files = await getJSON(join(__dirname, 'data'));
      return res(ctx.json(files));
    } else if (pathnameStat.isFile()) {
      const data = await readFile(pathname);
      return res(ctx.body(data));
    } else {
      throw new Error(`uhknown path: ${pathname}`);
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

test('displays the list of recent posts', async () => {
  const url = 'http://localhost/data';
  const fileCollection = await fileCollectionFromWebservice(url);
  expect(fileCollection).toHaveLength(9);
  const first = await fileCollection[0].text();
  expect(first).toBe('a');
  const second = await fileCollection[1].arrayBuffer();
  expect(Array.from(Buffer.from(second))).toStrictEqual([98]);
});

async function getJSON(path: string) {
  let files: any = [];
  await appendFiles(files, path);
  files.forEach((file: any) => {
    file.webkitRelativePath = file.webkitRelativePath.replace(
      /.*__tests__\//,
      '',
    );
  });
  return files;
}

async function appendFiles(files: any, currentDir: string) {
  const entries = await readdir(currentDir);
  for (let entry of entries) {
    const current = join(currentDir, entry);
    const info = await stat(current);

    if (info.isDirectory()) {
      await appendFiles(files, current);
    } else {
      files.push({
        name: entry,
        size: info.size,
        webkitRelativePath: join(currentDir, entry).replace(/\\/g, '/'),
        lastModified: Math.round(info.mtimeMs),
      });
    }
  }
}

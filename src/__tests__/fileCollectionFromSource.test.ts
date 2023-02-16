import { readdir, stat, readFile } from 'fs/promises';
import { join } from 'path';

import { fetch } from 'cross-fetch';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { fileCollectionFromSource } from '../fileCollectionFromSource';

const server = setupServer(
  rest.get('http://localhost/data*', async (req, res, ctx) => {
    const pathname = join(__dirname, req.url.pathname);
    const pathnameStat = await stat(pathname);
    if (pathnameStat.isDirectory()) {
      const source = await getJSON(join(__dirname, 'dataUnzip'));
      return res(ctx.json(source));
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

test('fileCollectionFromSource with baseURL in options', async () => {
  const url = 'http://localhost/data';
  const response = await fetch(url);
  const source = await response.json();

  await expect(fileCollectionFromSource(source, {})).rejects.toThrow(
    'We could not find a baseURL for dataUnzip/data.zip',
  );

  const fileCollection = await fileCollectionFromSource(source, {
    baseURL: 'http://localhost/',
  });

  expect(fileCollection.files).toHaveLength(15);
  const first = await fileCollection.files[0].text();
  expect(first).toBe('c');
  const second = await fileCollection.files[1].arrayBuffer();
  expect(Array.from(Buffer.from(second))).toStrictEqual([100]);
  const third = await fileCollection.files[14].arrayBuffer();
  expect(Array.from(Buffer.from(third))).toHaveLength(580);
});

test('fileCollectionFromSource with defaultBaseURL', async () => {
  const url = 'http://localhost/data';
  const response = await fetch(url);
  const source = await response.json();

  source.baseURL = 'http://localhost/';

  const fileCollection = await fileCollectionFromSource(source, {});

  expect(fileCollection.files).toHaveLength(15);
  const first = await fileCollection.files[0].text();
  expect(first).toBe('c');
  const second = await fileCollection.files[1].arrayBuffer();
  expect(Array.from(Buffer.from(second))).toStrictEqual([100]);
  const third = await fileCollection.files[14].arrayBuffer();
  expect(Array.from(Buffer.from(third))).toHaveLength(580);
});

test('fileCollectionFromSource with baseURL in the file', async () => {
  const url = 'http://localhost/data';
  const response = await fetch(url);
  const source = await response.json();

  source.entries.forEach((entry: any) => {
    entry.baseURL = 'http://localhost/';
  });

  const fileCollection = await fileCollectionFromSource(source, {});

  expect(fileCollection.files).toHaveLength(15);
  const first = await fileCollection.files[0].text();
  expect(first).toBe('c');
  const second = await fileCollection.files[1].arrayBuffer();
  expect(Array.from(Buffer.from(second))).toStrictEqual([100]);
  const third = await fileCollection.files[14].arrayBuffer();
  expect(Array.from(Buffer.from(third))).toHaveLength(580);
});

async function getJSON(path: string) {
  let entries: any = [];
  await appendFiles(entries, path);
  entries.forEach((entry: any) => {
    entry.relativePath = entry.relativePath.replace(/.*__tests__\//, '');
  });
  return { entries };
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
        relativePath: join(currentDir, entry).replace(/\\/g, '/'),
        lastModified: Math.round(info.mtimeMs),
      });
    }
  }
}

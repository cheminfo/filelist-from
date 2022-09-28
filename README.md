# filelist-utils

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

Create a FileCollection from various sources.

## Introduction

In order to make compatible code between the browser and node and to allow drag and drop of a folder it is useful to an abstraction level.

This package allows to create a `FileCollection` from various sources:

- a [FileList](https://developer.mozilla.org/en-US/docs/Web/API/FileList) (that implements an Iterator of [File](https://developer.mozilla.org/en-US/docs/Web/API/File)).
- a relative path (with its basedir)
- a webservice that returns a JSON containing an array of object that has the following properties: `relativePath`, `name`, `lastModified`, `size`

A `FileCollection` has an iterator on `FileCollectionItem` that has the following properties:

- lastModified: number;
- name: string;
- relativePath: string;
- size: number;
- arrayBuffer(): Promise<ArrayBuffer>;
- stream(): ReadableStream<Uint8Array>;
- text(): Promise<string>;

## Installation

`npm i filelist-utils`

## Usage

```js
import { fileCollectionFromPath } from 'filelist-utils';

const fileCollection = fileCollectionFromPath(__dirname);
```

```js
import { fileCollectionFromZip } from 'filelist-utils';

const zip = readFileSync(join(__dirname, 'test.zip'));
const fileCollection = fileCollectionFromZip(zip);
```

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/filelist-utils.svg
[npm-url]: https://www.npmjs.com/package/filelist-utils
[ci-image]: https://github.com/cheminfo/filelist-utils/workflows/Node.js%20CI/badge.svg?branch=main
[ci-url]: https://github.com/cheminfo/filelist-utils/actions?query=workflow%3A%22Node.js+CI%22
[codecov-image]: https://img.shields.io/codecov/c/github/cheminfo/filelist-utils.svg
[codecov-url]: https://codecov.io/gh/cheminfo/filelist-utils
[download-image]: https://img.shields.io/npm/dm/filelist-utils.svg
[download-url]: https://www.npmjs.com/package/filelist-utils

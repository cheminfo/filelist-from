# filelist-from

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

Create a FileList from a path or a zip.

In order to make compatible code between the browser and node and to allow drag and drop of a folder it is useful to deal with [FileList](https://developer.mozilla.org/en-US/docs/Web/API/FileList) (that implements an Iterator of [File](https://developer.mozilla.org/en-US/docs/Web/API/File)).

This library allows to create such a [FileList](https://developer.mozilla.org/en-US/docs/Web/API/FileList) from a directory path (only available in nodejs) or from a zip file (available from nodejs and the browser).

## Installation

`$ npm i filelist-from`

## Usage

```js
import { fileListFromPath } from 'filelist-from';

const fileList = fileListFromPath(join(__dirname));
```

```js
import { fileListFromZip } from 'filelist-from';

const zip = readFileSync(join(__dirname, 'test.zip'));
const fileList = fileListFromZip(zip);
```

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/filelist-from.svg
[npm-url]: https://www.npmjs.com/package/filelist-from
[ci-image]: https://github.com/cheminfo/filelist-from/workflows/Node.js%20CI/badge.svg?branch=main
[ci-url]: https://github.com/cheminfo/filelist-from/actions?query=workflow%3A%22Node.js+CI%22
[codecov-image]: https://img.shields.io/codecov/c/github/cheminfo/filelist-from.svg
[codecov-url]: https://codecov.io/gh/cheminfo/filelist-from
[download-image]: https://img.shields.io/npm/dm/filelist-from.svg
[download-url]: https://www.npmjs.com/package/filelist-from
